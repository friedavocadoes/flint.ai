import countriesRaw from "@/content/countries.json";

export type CountryEntry = { value: string };

// Top sought-after destinations — shown first in that exact order, not alphabetical
export const PRIORITY_COUNTRIES = [
  "United States",
  "United Arab Emirates",
  "India",
  "Singapore",
  "Japan",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "South Korea",
  "France",
  "Netherlands",
  "Switzerland",
  "Sweden",
  "Ireland",
  "Saudi Arabia",
  "Qatar",
  "New Zealand",
] as const;

// Build dropdown list: priority first, then rest alphabetically
export function getPrioritizedCountries(): CountryEntry[] {
  const allValues = (countriesRaw as CountryEntry[]).map((c) => c.value);
  const prioritySet = new Set(PRIORITY_COUNTRIES as readonly string[]);
  const priority = PRIORITY_COUNTRIES.filter((c) => allValues.includes(c)).map(
    (v) => ({ value: v }),
  );
  const rest = allValues
    .filter((v) => !prioritySet.has(v))
    .sort((a, b) => a.localeCompare(b))
    .map((v) => ({ value: v }));
  return [...priority, ...rest];
}

// Minimal currency map for salary display — covers priority + common. Falls back to USD.
export const COUNTRY_CURRENCY: Record<
  string,
  { code: string; symbol: string }
> = {
  "United States": { code: "USD", symbol: "$" },
  "United Arab Emirates": { code: "AED", symbol: "AED" },
  India: { code: "INR", symbol: "₹" },
  Singapore: { code: "SGD", symbol: "S$" },
  Japan: { code: "JPY", symbol: "¥" },
  "United Kingdom": { code: "GBP", symbol: "£" },
  Canada: { code: "CAD", symbol: "C$" },
  Australia: { code: "AUD", symbol: "A$" },
  Germany: { code: "EUR", symbol: "€" },
  "South Korea": { code: "KRW", symbol: "₩" },
  "Korea, Republic of": { code: "KRW", symbol: "₩" },
  France: { code: "EUR", symbol: "€" },
  Netherlands: { code: "EUR", symbol: "€" },
  Switzerland: { code: "CHF", symbol: "CHF" },
  Sweden: { code: "SEK", symbol: "kr" },
  Ireland: { code: "EUR", symbol: "€" },
  "Saudi Arabia": { code: "SAR", symbol: "SAR" },
  Qatar: { code: "QAR", symbol: "QAR" },
  "New Zealand": { code: "NZD", symbol: "NZ$" },
  China: { code: "CNY", symbol: "¥" },
  "Hong Kong": { code: "HKD", symbol: "HK$" },
  Malaysia: { code: "MYR", symbol: "RM" },
  Thailand: { code: "THB", symbol: "฿" },
  Indonesia: { code: "IDR", symbol: "Rp" },
  Brazil: { code: "BRL", symbol: "R$" },
  Mexico: { code: "MXN", symbol: "$" },
  "South Africa": { code: "ZAR", symbol: "R" },
  Norway: { code: "NOK", symbol: "kr" },
  Denmark: { code: "DKK", symbol: "kr" },
  Italy: { code: "EUR", symbol: "€" },
  Spain: { code: "EUR", symbol: "€" },
  Poland: { code: "PLN", symbol: "zł" },
  Turkey: { code: "TRY", symbol: "₺" },
  Pakistan: { code: "PKR", symbol: "₨" },
  Bangladesh: { code: "BDT", symbol: "৳" },
  Nigeria: { code: "NGN", symbol: "₦" },
  Egypt: { code: "EGP", symbol: "E£" },
  Philippines: { code: "PHP", symbol: "₱" },
  "Viet Nam": { code: "VND", symbol: "₫" },
};

export function getCurrencyForCountry(country?: string | null) {
  if (!country) return { code: "USD", symbol: "$" };
  return COUNTRY_CURRENCY[country] ?? { code: "USD", symbol: "$" };
}

// Helpers for select options
export const EDUCATION_LEVELS = [
  "High School",
  "Diploma",
  "Bachelor's",
  "Master's",
  "PhD",
  "Bootcamp / Other",
] as const;

export const GRADUATION_TIMELINES = [
  "Already graduated",
  "< 3 months",
  "3-6 months",
  "6-12 months",
  "1-2 years",
  "2+ years",
] as const;

export const CURRENT_STATUSES = [
  { value: "studying", label: "Studying" },
  { value: "internship", label: "Internship" },
  { value: "working", label: "Working full-time" },
  { value: "freelance", label: "Freelance / Part-time" },
  { value: "seeking", label: "Between jobs / Seeking" },
  { value: "break", label: "Career break / Other" },
] as const;

export const YEARS_IN_DOMAIN = [
  "0 (switching)",
  "< 1 year",
  "1-2 years",
  "3-5 years",
  "5-10 years",
  "10+ years",
] as const;

export const COMPANY_TYPES = [
  "Startup (0-50)",
  "Scale-up (50-500)",
  "Big Tech / FAANG",
  "MNC / Enterprise",
  "Remote-first",
  "Consulting / Agency",
  "Product company",
  "Service company",
  "Government / Public",
  "Any — best fit for role",
] as const;

export const SALARY_PERIODS = [
  { value: "yearly", label: "/ year" },
  { value: "monthly", label: "/ month" },
] as const;

export const OPPORTUNITY_TYPES = [
  { value: "internship", label: "Internship" },
  { value: "job", label: "Full-time job" },
  { value: "either", label: "Either / Open" },
] as const;
