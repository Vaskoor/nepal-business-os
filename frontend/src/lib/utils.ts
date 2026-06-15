import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, locale: string = 'en') {
  const formatter = new Intl.NumberFormat(locale === 'ne' ? 'ne-NP' : 'en-US', {
    style: 'currency',
    currency: 'NPR',
    minimumFractionDigits: 2,
  });
  return formatter.format(amount);
}

export function formatDate(date: string | Date, locale: string = 'en') {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (locale === 'ne') {
    // Nepali date formatting - simplified
    return d.toLocaleDateString('ne-NP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatNumber(num: number, locale: string = 'en') {
  return new Intl.NumberFormat(locale === 'ne' ? 'ne-NP' : 'en-US').format(num);
}