import "server-only";
import { randomUUID } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

const SIGNED_URL_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

/**
 * Persists an uploaded image to private Supabase Storage under the owning
 * user's folder and returns a signed URL scoped to that file. When Supabase
 * is not configured (local/demo environments), the image is inlined as a
 * data URI instead so the rest of the pipeline behaves identically — no
 * component needs to know which mode it's running in.
 */
export async function storeUserImage(opts: {
  userId: string;
  bucket: "references" | "generations";
  file: File;
}): Promise<string> {
  const admin = createAdminClient();
  const extension = opts.file.type.split("/")[1] || "jpg";
  const path = `${opts.userId}/${randomUUID()}.${extension}`;
  const arrayBuffer = await opts.file.arrayBuffer();

  if (admin) {
    const { error } = await admin.storage
      .from(opts.bucket)
      .upload(path, Buffer.from(arrayBuffer), {
        contentType: opts.file.type,
        upsert: false,
      });

    if (error) {
      throw new Error(`Storage upload failed: ${error.message}`);
    }

    const { data, error: signError } = await admin.storage
      .from(opts.bucket)
      .createSignedUrl(path, SIGNED_URL_TTL_SECONDS);

    if (signError || !data?.signedUrl) {
      throw new Error(`Failed to create signed URL: ${signError?.message ?? "unknown error"}`);
    }

    return data.signedUrl;
  }

  const base64 = Buffer.from(arrayBuffer).toString("base64");
  return `data:${opts.file.type};base64,${base64}`;
}

/**
 * Re-signs (or passes through, in demo mode) a URL already stored for a
 * user so private storage objects can be safely re-shared with the client
 * without ever making the bucket public.
 */
export async function getSignedUrlForPath(
  bucket: "references" | "generations",
  path: string
): Promise<string | null> {
  const admin = createAdminClient();
  if (!admin) return null;
  const { data } = await admin.storage.from(bucket).createSignedUrl(path, SIGNED_URL_TTL_SECONDS);
  return data?.signedUrl ?? null;
}
