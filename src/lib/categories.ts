import { Prisma, ProductType } from "@prisma/client";

export interface FlatCategory {
  id: string;
  name?: string;
  slug?: string;
  parentId?: string | null;
  sortOrder?: number;
}

export interface CategoryTreeNode<T extends FlatCategory = FlatCategory> extends FlatCategory {
  children: CategoryTreeNode<T>[];
}

export function buildCategoryTree<T extends FlatCategory>(categories: T[]): (T & { children: CategoryTreeNode<T>[] })[] {
  const map = new Map<string, T & { children: CategoryTreeNode<T>[] }>();

  for (const cat of categories) {
    map.set(cat.id, { ...cat, children: [] });
  }

  const roots: (T & { children: CategoryTreeNode<T>[] })[] = [];

  for (const cat of categories) {
    const node = map.get(cat.id)!;
    if (cat.parentId && map.has(cat.parentId)) {
      map.get(cat.parentId)!.children.push(node as CategoryTreeNode<T>);
    } else {
      roots.push(node);
    }
  }

  const sortNodes = (nodes: CategoryTreeNode<T>[]) => {
    nodes.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || (a.name ?? "").localeCompare(b.name ?? ""));
    nodes.forEach((n) => sortNodes(n.children));
  };
  sortNodes(roots as CategoryTreeNode<T>[]);

  return roots;
}

export function flattenCategoryTree<T extends CategoryTreeNode>(
  nodes: T[],
  depth = 0
): { node: T; depth: number }[] {
  const result: { node: T; depth: number }[] = [];
  for (const node of nodes) {
    result.push({ node, depth });
    if (node.children.length > 0) {
      result.push(...flattenCategoryTree(node.children as T[], depth + 1));
    }
  }
  return result;
}

export function getCategoryDescendantIds(
  categoryId: string,
  categories: { id: string; parentId?: string | null }[]
): Set<string> {
  const byParent = new Map<string | null, { id: string; parentId?: string | null }[]>();
  for (const c of categories) {
    const key = c.parentId ?? null;
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key)!.push(c);
  }

  const ids = new Set<string>();
  const walk = (id: string) => {
    ids.add(id);
    for (const child of byParent.get(id) ?? []) walk(child.id);
  };
  walk(categoryId);
  return ids;
}

export function categoryOptionLabel(name: string, depth: number): string {
  return `${depth > 0 ? "— ".repeat(depth) : ""}${name}`;
}

export function formatCategoryLabel(
  category: { name: string; parent?: { name: string } | null }
): string {
  return category.parent ? `${category.parent.name} · ${category.name}` : category.name;
}

/** Filtre produits par slug catégorie (inclut les sous-catégories si parent sélectionné). */
export function buildCategorySlugProductFilter(slug: string): Prisma.ProductWhereInput {
  return {
    OR: [
      { category: { slug, isActive: true } },
      { category: { isActive: true, parent: { slug, isActive: true } } },
    ],
  };
}

export interface PublicCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  parentId: string | null;
  sortOrder: number;
  scope: ProductType;
}

/** Catégories actives d'un catalogue (boutique luxe ou accompagnements). */
export function filterCategoriesByScope(
  all: PublicCategory[],
  scope: ProductType
): PublicCategory[] {
  return all.filter((c) => c.scope === scope);
}

export interface PublicCategoryTreeNode extends PublicCategory {
  children: PublicCategoryTreeNode[];
}

export function getCategoriesWithProducts(
  all: PublicCategory[],
  categoryIdsWithProducts: Set<string>
): PublicCategory[] {
  return getVisiblePublicCategories(all, categoryIdsWithProducts, { includeEmptyChildren: true });
}

interface VisibleCategoriesOptions {
  includeEmptyChildren?: boolean;
}

function addAncestors(
  categoryId: string,
  all: PublicCategory[],
  visible: Set<string>
) {
  visible.add(categoryId);
  let parentId = all.find((c) => c.id === categoryId)?.parentId ?? null;
  while (parentId) {
    visible.add(parentId);
    parentId = all.find((c) => c.id === parentId)?.parentId ?? null;
  }
}

function addEmptyChildren(all: PublicCategory[], visible: Set<string>) {
  let changed = true;
  while (changed) {
    changed = false;
    for (const cat of all) {
      if (cat.parentId && visible.has(cat.parentId) && !visible.has(cat.id)) {
        visible.add(cat.id);
        changed = true;
      }
    }
  }
}

function subtreeHasProductType(
  rootId: string,
  all: { id: string; parentId?: string | null }[],
  categoryIdsByType: Map<ProductType, Set<string>>,
  type: ProductType
): boolean {
  const ids = getCategoryDescendantIds(rootId, all);
  const typed = categoryIdsByType.get(type);
  if (!typed) return false;
  for (const id of ids) {
    if (typed.has(id)) return true;
  }
  return false;
}

/** Catégories visibles sur le site selon le type de produit (LUXE boutique / SERVICE offres). */
export function getVisiblePublicCategories(
  all: PublicCategory[],
  categoryIdsWithProducts: Set<string>,
  options?: VisibleCategoriesOptions
): PublicCategory[];
export function getVisiblePublicCategories(
  all: PublicCategory[],
  productRefs: { categoryId: string; productType: ProductType; isActive: boolean }[],
  scope: ProductType
): PublicCategory[];
export function getVisiblePublicCategories(
  all: PublicCategory[],
  second:
    | Set<string>
    | { categoryId: string; productType: ProductType; isActive: boolean }[],
  third?: ProductType | VisibleCategoriesOptions
): PublicCategory[] {
  const visible = new Set<string>();

  if (second instanceof Set) {
    for (const id of second) addAncestors(id, all, visible);
    if (third && typeof third === "object" && third.includeEmptyChildren !== false) {
      addEmptyChildren(all, visible);
    }
    return all.filter((c) => visible.has(c.id));
  }

  const scope = third as ProductType;
  const active = second.filter((p) => p.isActive);
  const byType = new Map<ProductType, Set<string>>();
  for (const p of active) {
    if (!byType.has(p.productType)) byType.set(p.productType, new Set());
    byType.get(p.productType)!.add(p.categoryId);
  }

  for (const categoryId of byType.get(scope) ?? []) {
    addAncestors(categoryId, all, visible);
  }
  addEmptyChildren(all, visible);

  if (scope === "SERVICE") {
    for (const cat of all) {
      if (!cat.parentId && !subtreeHasProductType(cat.id, all, byType, "LUXE")) {
        visible.add(cat.id);
        for (const child of all) {
          if (child.parentId === cat.id) visible.add(child.id);
        }
      }
    }
  }

  if (scope === "LUXE") {
    for (const cat of all) {
      if (
        !cat.parentId &&
        visible.has(cat.id) &&
        !subtreeHasProductType(cat.id, all, byType, "LUXE")
      ) {
        for (const id of getCategoryDescendantIds(cat.id, all)) visible.delete(id);
      }
    }
  }

  return all.filter((c) => visible.has(c.id));
}

export function buildPublicCategoryTree(
  categories: PublicCategory[]
): PublicCategoryTreeNode[] {
  return buildCategoryTree(categories) as PublicCategoryTreeNode[];
}

export function flattenPublicCategoryFilters(
  roots: PublicCategoryTreeNode[]
): { slug: string; name: string; depth: number }[] {
  return flattenCategoryTree(roots).map(({ node, depth }) => ({
    slug: node.slug,
    name: node.name,
    depth,
  }));
}
