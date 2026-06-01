import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getApiErrorMessage(response: Response): Promise<string> {
  try {
    const data = await response.json();

    if (data.message) {
      if (typeof data.message === 'string') {
        return data.message;
      }
      if (typeof data.message === 'object' && data.message !== null) {
        return Object.values(data.message).join(', ');
      }
    }
    if (data.error) {
      return data.error;
    }

  } catch (e) {
    console.error("Failed to parse error response", e);
  }

  return response.statusText || "An unexpected error occurred";
}
