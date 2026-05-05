export type WarrantyStatus = "Active" | "Expiring soon" | "Expired" | "Unknown";
export type WarrantyPeriodUnit = "months" | "years" | string;

const warningWindowDays = 60;
const dayMs = 24 * 60 * 60 * 1000;

function parseLocalDate(value?: string | null) {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
}

function formatDate(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getWarrantyStartDate({
  installedDate,
  purchaseDate,
}: {
  installedDate?: string | null;
  purchaseDate?: string | null;
}) {
  return installedDate || purchaseDate || null;
}

export function calculateWarrantyExpiryDate({
  installedDate,
  purchaseDate,
  warrantyPeriodNumber,
  warrantyPeriodUnit,
}: {
  installedDate?: string | null;
  purchaseDate?: string | null;
  warrantyPeriodNumber?: number | null;
  warrantyPeriodUnit?: WarrantyPeriodUnit | null;
}) {
  const startDate = parseLocalDate(
    getWarrantyStartDate({ installedDate, purchaseDate }),
  );

  if (!startDate || !warrantyPeriodNumber || warrantyPeriodNumber <= 0) {
    return null;
  }

  const expiryDate = new Date(startDate);

  if (warrantyPeriodUnit === "years") {
    expiryDate.setFullYear(expiryDate.getFullYear() + warrantyPeriodNumber);
  } else if (warrantyPeriodUnit === "months") {
    expiryDate.setMonth(expiryDate.getMonth() + warrantyPeriodNumber);
  } else {
    return null;
  }

  return formatDate(expiryDate);
}

export function calculateWarrantyStatus(expiryDate?: string | null): WarrantyStatus {
  const expiry = parseLocalDate(expiryDate);

  if (!expiry) {
    return "Unknown";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (expiry < today) {
    return "Expired";
  }

  const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / dayMs);

  return daysUntilExpiry <= warningWindowDays ? "Expiring soon" : "Active";
}

export function warrantyTone(status: WarrantyStatus) {
  if (status === "Active") {
    return "success" as const;
  }

  if (status === "Expiring soon") {
    return "warning" as const;
  }

  if (status === "Expired") {
    return "danger" as const;
  }

  return "neutral" as const;
}
