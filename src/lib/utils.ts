import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  // Convert or format to Pakistani Rupee (PKR / Rs.)
  const pkrValue = amount > 0 && amount < 1000 ? amount * 100 : amount;
  return `Rs. ${Math.round(pkrValue).toLocaleString("en-PK")}`;
}

export function calculateInstallments(amount: number, count = 4): string {
  const pkrValue = amount > 0 && amount < 1000 ? amount * 100 : amount;
  return formatCurrency(pkrValue / count);
}

// Nationwide Pakistan thresholds in PKR
export const FREE_SHIPPING_THRESHOLD = 5000; // Free delivery across Pakistan on orders over Rs. 5,000
export const MONOGRAM_THRESHOLD = 35000; // Bespoke monogramming threshold (Rs. 35,000)
export const STANDARD_SHIPPING_FEE = 350; // Standard courier delivery Rs. 350
