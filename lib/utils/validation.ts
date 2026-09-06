export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_IMAGE_BYTES = 12 * 1024 * 1024; // 12MB
export const MAX_REFERENCES_PER_CHARACTER = 5;
export const MIN_REFERENCES_PER_CHARACTER = 1;

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function validateImageFile(file: { type: string; size: number; name?: string }): FileValidationResult {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Unsupported file type. Please upload a JPG, PNG, or WEBP image.",
    };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return {
      valid: false,
      error: "That image is too large. Please upload a file under 12MB.",
    };
  }
  if (file.size === 0) {
    return { valid: false, error: "That file appears to be empty. Please try another image." };
  }
  return { valid: true };
}

export function validateReferenceCount(count: number): FileValidationResult {
  if (count < MIN_REFERENCES_PER_CHARACTER) {
    return { valid: false, error: "Upload at least one reference image to continue." };
  }
  if (count > MAX_REFERENCES_PER_CHARACTER) {
    return { valid: false, error: "You can upload up to 5 reference images." };
  }
  return { valid: true };
}
