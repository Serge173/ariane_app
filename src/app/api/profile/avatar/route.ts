import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { randomUUID } from "crypto";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { extensionFromMime, storeUploadedImage } from "@/lib/store-uploaded-image";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("avatar") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Format non supporté. Utilisez JPG, PNG ou WebP." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Fichier trop volumineux (max 5 Mo)" }, { status: 400 });
    }

    const ext = extensionFromMime(file.type);
    const fileName = `${session.user.id}-${randomUUID()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const avatarUrl = await storeUploadedImage({
      folder: "avatars",
      fileName,
      buffer,
      contentType: file.type,
    });

    const storedUrl = avatarUrl.split("?")[0];

    await prisma.user.update({
      where: { id: session.user.id },
      data: { avatar: storedUrl },
    });

    return NextResponse.json({ avatar: `${storedUrl}?t=${Date.now()}`, success: true });
  } catch (error) {
    console.error("Avatar upload error:", error);
    const message = error instanceof Error ? error.message : "Erreur lors de l'upload";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { avatar: true, firstName: true, lastName: true },
  });

  return NextResponse.json(user);
}
