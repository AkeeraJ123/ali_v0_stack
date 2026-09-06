import { NextRequest, NextResponse } from "next/server";
import { getRequestUser } from "@/lib/auth/getRequestUser";
import { storeUserImage } from "@/lib/storage/storeUserImage";
import { validateImageFile, validateReferenceCount } from "@/lib/utils/validation";
import { checkRateLimit } from "@/lib/utils/rateLimit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { userId, unauthorized } = await getRequestUser();
  if (unauthorized || !userId) {
    return NextResponse.json({ error: "You must be logged in to upload references." }, { status: 401 });
  }

  const rate = checkRateLimit(`upload:${userId}`, { limit: 30, windowMs: 60_000 });
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Too many uploads. Please wait a moment and try again." },
      { status: 429 }
    );
  }

  const formData = await req.formData();
  const files = formData.getAll("files").filter((f): f is File => f instanceof File);

  const countCheck = validateReferenceCount(files.length);
  if (!countCheck.valid) {
    return NextResponse.json({ error: countCheck.error }, { status: 400 });
  }

  const uploaded: { url: string }[] = [];

  for (const file of files) {
    const fileCheck = validateImageFile(file);
    if (!fileCheck.valid) {
      return NextResponse.json({ error: fileCheck.error }, { status: 400 });
    }

    try {
      const url = await storeUserImage({ userId, bucket: "references", file });
      uploaded.push({ url });
    } catch (err) {
      console.error("Reference upload failed", err);
      return NextResponse.json(
        { error: "We couldn't upload that image. Please try again." },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ images: uploaded });
}
