import { ILead } from "@/types";
import { formatCurrencyINR, formatDate } from "@/lib/utils/formatters";

export function exportLeadsToCSV(leads: ILead[]): string {
  const headers = [
    "Lead ID",
    "Date Created",
    "Client Name",
    "Email",
    "Phone",
    "Business Type",
    "Recommended Service",
    "Lead Score",
    "Budget Declared",
    "Parsed Budget (INR)",
    "Timeline",
    "Status",
    "Project Requirement",
    "AI Qualification Rationale",
  ];

  const escapeCSV = (value: string | number | undefined | null): string => {
    if (value === undefined || value === null) return '""';
    const stringValue = String(value).replace(/"/g, '""');
    return `"${stringValue}"`;
  };

  const rows = leads.map((lead) => [
    escapeCSV(lead.id || lead._id),
    escapeCSV(formatDate(lead.createdAt)),
    escapeCSV(lead.name),
    escapeCSV(lead.email),
    escapeCSV(lead.phone || "N/A"),
    escapeCSV(lead.businessType),
    escapeCSV(lead.serviceRecommended),
    escapeCSV(lead.leadScore),
    escapeCSV(lead.budget),
    escapeCSV(formatCurrencyINR(lead.budgetAmount)),
    escapeCSV(lead.timeline),
    escapeCSV(lead.status),
    escapeCSV(lead.projectRequirement),
    escapeCSV(lead.aiAnalysis?.rationale || ""),
  ]);

  // Include UTF-8 BOM (\uFEFF) so Excel respects encoding
  return "\uFEFF" + [headers.join(","), ...rows.map((row) => row.join(","))].join("\r\n");
}
