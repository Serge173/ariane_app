#!/usr/bin/env bash
set -euo pipefail

echo "==> Prisma generate"
npx prisma generate

DB_URL="${DATABASE_URL_UNPOOLED:-${DATABASE_URL:-}}"
if [ -z "$DB_URL" ]; then
  echo "ERROR: DATABASE_URL / DATABASE_URL_UNPOOLED is not set"
  exit 1
fi

echo "==> Prisma db push"
PUSH_URL="${DATABASE_URL_UNPOOLED:-${DATABASE_URL:-}}"
ORIGINAL_DATABASE_URL="${DATABASE_URL:-}"
export DATABASE_URL="$PUSH_URL"
npx prisma db push
export DATABASE_URL="$ORIGINAL_DATABASE_URL"

echo "==> Prisma db seed"
npx prisma db seed

echo "==> Next.js build"
next build
