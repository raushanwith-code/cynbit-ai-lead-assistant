import { LeadScore } from "@/types";

export function formatCurrencyINR(amount: number): string {
  if (isNaN(amount) || amount === 0) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string | Date): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return String(dateString);
  }
}

export function parseBudgetString(budgetStr: string): { amount: number; score: LeadScore } {
  if (!budgetStr) {
    return { amount: 50000, score: "Medium" };
  }

  const clean = budgetStr.toLowerCase().replace(/,/g, "").trim();

  let amount = 0;

  // Patterns
  // 1. "X lakh" or "X lac" or "X l"
  const lakhMatch = clean.match(/([\d.]+)\s*(?:lakh|lacs|lac|l)/i);
  // 2. "X k" or "X thousand"
  const kMatch = clean.match(/([\d.]+)\s*(?:k|thousand)/i);
  // 3. direct numeric like "150000" or "80000"
  const numMatch = clean.match(/(\d{4,})/);

  if (lakhMatch) {
    amount = parseFloat(lakhMatch[1]) * 100000;
  } else if (kMatch) {
    amount = parseFloat(kMatch[1]) * 1000;
  } else if (numMatch) {
    amount = parseFloat(numMatch[1]);
  } else if (clean.includes("> 1 lakh") || clean.includes("above 1 lakh") || clean.includes("high")) {
    amount = 150000;
  } else if (clean.includes("50k - 1 lakh") || clean.includes("50k-1lakh") || clean.includes("medium")) {
    amount = 75000;
  } else if (clean.includes("< 50k") || clean.includes("below 50k") || clean.includes("low")) {
    amount = 35000;
  } else {
    // Default safe fallback
    amount = 60000;
  }

  // Exact scoring criteria from USER_REQUEST:
  // High: Budget > ₹1 lakh (> 100,000)
  // Medium: ₹50k - ₹1 lakh (50,000 to 100,000 inclusive)
  // Low: Below ₹50k (< 50,000)
  let score: LeadScore = "Medium";
  if (amount > 100000) {
    score = "High";
  } else if (amount >= 50000 && amount <= 100000) {
    score = "Medium";
  } else {
    score = "Low";
  }

  return { amount, score };
}
