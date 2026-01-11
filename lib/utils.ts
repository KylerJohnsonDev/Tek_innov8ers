import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import DOMPurify from "isomorphic-dompurify";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function removeUndefinedProperties<T extends Record<string, unknown>>(obj: T): Partial<T> { 
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as Partial<T>
}

/**
 * Sanitizes HTML content to prevent XSS attacks
 * Allows only safe tags and attributes including inline styles
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'style', 'class']
  });
}
