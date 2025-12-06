/**
 * Utility to convert undefined to null for Prisma compatibility
 * with exactOptionalPropertyTypes: true
 */
export function toNullable<T>(value: T | undefined): T | null {
  return value ?? null;
}

/**
 * Build Prisma data object excluding undefined fields
 */
export function cleanData<T extends Record<string, any>>(data: T): Partial<T> {
  const cleaned: any = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

