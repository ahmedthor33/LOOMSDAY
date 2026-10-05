import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  if (typeof amount !== "number" || isNaN(amount)) return "Rs. 0";
  return `Rs. ${Math.round(amount).toLocaleString("en-PK")}`;
}

export function calculateInstallments(amount: number, count = 4): string {
  if (typeof amount !== "number" || isNaN(amount)) return "Rs. 0";
  return formatCurrency(amount / count);
}

// Nationwide Pakistan thresholds in PKR
export const FREE_SHIPPING_THRESHOLD = 5000; // Free delivery across Pakistan on orders over Rs. 5,000
export const MONOGRAM_THRESHOLD = 35000; // Bespoke monogramming threshold (Rs. 35,000)
export const STANDARD_SHIPPING_FEE = 350; // Standard courier delivery Rs. 350
