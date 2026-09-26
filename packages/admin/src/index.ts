export type {
  StatusData,
  PaymentMethodBreakdown,
  OrderSourceBreakdown,
  TopProduct,
  DailySale,
  MonthlySale,
  RecentOrder,
  AdminStats,
  GetStatsParams,
  FinancialsTenantInfo,
  InvoiceOrderItem,
  InvoiceOrder,
  InvoicesData,
  MonthlyReportSummary,
  PaymentMethodTotals,
  DailySalesEntry,
  MonthlyProductSales,
  MonthlyReportData,
  MonthlyBreakdownEntry,
  YearlyReportSummary,
  YearlyReportData,
  BilanSummary,
  BilanData,
  JournalEntryItem,
  JournalData,
  FinancialsType,
  FinancialsQueryParams,
  FinancialsResponse,
} from './types';

export { AdminApiClient } from './client';
export type { AdminConfig } from './client';

export { AdminProvider, useAdminClient } from './provider';
export type { AdminProviderProps } from './provider';

export { useAdminDashboard, useFinancials } from './hooks';
