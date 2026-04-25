import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/session";
import { hasCloudinaryConfig, uploadImageBuffer } from "@/lib/cloudinary";

export const runtime = "nodejs";

function sanitizeFolder(value: string) {
  return value.replace(/[^a-z0-9/-]/gi, "").replace(/^\/+|\/+$/g, "") || "misc";
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const folder = sanitizeFolder(url.searchParams.get("folder") ?? "misc");
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "Missing image file." }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ message: "Only image uploads are supported." }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json(
      { message: "Images must be 5 MB or smaller." },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  if (hasCloudinaryConfig()) {
    const uploadedUrl = await uploadImageBuffer({
      buffer,
      mimeType: file.type,
      folder: `devfolio/${folder}`,
    });

    return NextResponse.json({ url: uploadedUrl });
  }

  const extension = path.extname(file.name) || ".png";
  const fileName = `${randomUUID()}${extension}`;
  const uploadsDir = path.join(process.cwd(), "public", "uploads", folder);

  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, fileName), buffer);

  return NextResponse.json({ url: `/uploads/${folder}/${fileName}` });
}
