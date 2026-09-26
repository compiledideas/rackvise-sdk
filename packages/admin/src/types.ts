export interface StatusData {
  name: string;
  value: number;
  color: string;
}

export interface PaymentMethodBreakdown {
  name: string;
  value: number;
  count: number;
  color: string;
}

export interface OrderSourceBreakdown {
  name: string;
  value: number;
  count: number;
  color: string;
}

export interface TopProduct {
  name: string;
  quantity: number;
}

export interface DailySale {
  day: string;
  revenue: number;
  orderCount: number;
}

export interface MonthlySale {
  month: string;
  sales: number;
}

export interface RecentOrder {
  id: number;
  orderNumber: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  source: string;
  createdAt: string;
  user: { id: number; firstName: string; lastName: string; email: string } | null;
}

export interface AdminStats {
  totalProducts: number;
  totalStock: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  deliveredOrders: number;
  onlineOrders: number;
  averageOrderValue: number;
  deliveryRate: number;
  orderStatuses: StatusData[];
  orderSourceBreakdown: OrderSourceBreakdown[];
  paymentMethodBreakdown: PaymentMethodBreakdown[];
  monthlySales: MonthlySale[];
  dailySales: DailySale[];
  recentOrders: RecentOrder[];
  topProducts: TopProduct[];
}

export interface GetStatsParams {
  pointOfSellId?: number;
  sellerId?: number;
  startDate?: string;
  endDate?: string;
}

export interface FinancialsTenantInfo {
  name: string;
  logoUrl: string | null;
  primaryColor: string | null;
}

export interface InvoiceOrderItem {
  id: number;
  quantity: number;
  price: number;
  product: { id: number; name: string; sku: string };
  variant: { id: number; name: string } | null;
  subVariant: { id: number; size?: string | null; ageStart?: number | null; ageEnd?: number | null; ageUnit?: string | null } | null;
}

export interface InvoiceOrder {
  id: number;
  orderNumber: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  source: string;
  createdAt: string;
  user: { id: number; firstName: string; lastName: string; email: string } | null;
  seller: { id: number; firstName: string; lastName: string } | null;
  orderItems: InvoiceOrderItem[];
  totalHT: number;
  tva: number;
  totalTTC: number;
  invoiceNumber: string;
}

export interface InvoicesData {
  invoices: InvoiceOrder[];
  tenant: FinancialsTenantInfo;
}

export interface MonthlyReportSummary {
  totalOrders: number;
  totalRevenueHT: number;
  totalTVA: number;
  totalRevenueTTC: number;
  averageOrderValue: number;
}

export interface PaymentMethodTotals {
  ESPECE: { count: number; total: number };
  TPE: { count: number; total: number };
  COUPON: { count: number; total: number };
  TPE_ESPECE: { count: number; total: number };
}

export interface DailySalesEntry {
  date: string;
  revenue: number;
  orderCount: number;
}

export interface MonthlyProductSales {
  name: string;
  quantity: number;
  revenue: number;
}

export interface MonthlyReportData {
  period: { month: number; year: number };
  summary: MonthlyReportSummary;
  paymentBreakdown: PaymentMethodTotals;
  dailySales: DailySalesEntry[];
  topProducts: MonthlyProductSales[];
  tenant: FinancialsTenantInfo;
}

export interface MonthlyBreakdownEntry {
  month: number;
  orders: number;
  revenue: number;
}

export interface YearlyReportSummary {
  totalRevenue: number;
  totalOrders: number;
  totalTVA: number;
  averageMonthlyRevenue: number;
  bestMonth: { month: number; revenue: number; orders: number };
  worstMonth: { month: number; revenue: number; orders: number };
}

export interface YearlyReportData {
  year: number;
  summary: YearlyReportSummary;
  monthlyBreakdown: MonthlyBreakdownEntry[];
  tenant: FinancialsTenantInfo;
}

export interface BilanSummary {
  totalRevenue: number;
  totalOrders: number;
  cancelledOrders: number;
  totalDiscount: number;
  totalTVA: number;
  totalTTC: number;
}

export interface BilanData {
  year: number;
  summary: BilanSummary;
  tenant: FinancialsTenantInfo;
}

export interface JournalEntryItem {
  id: number;
  orderNumber: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  source: string;
  createdAt: string;
  user: { id: number; firstName: string; lastName: string; email: string } | null;
  orderItems: InvoiceOrderItem[];
  invoiceNumber: string;
  totalHT: number;
  tva: number;
  totalTTC: number;
  itemsDescription: string;
}

export interface JournalData {
  journal: JournalEntryItem[];
  tenant: FinancialsTenantInfo;
}

export type FinancialsType = 'invoices' | 'monthly-report' | 'yearly-report' | 'bilan' | 'journal';

export interface FinancialsQueryParams {
  type: FinancialsType;
  startDate?: string;
  endDate?: string;
  year?: number;
  month?: number;
  pointOfSellId?: number;
}

export type FinancialsResponse = InvoicesData | MonthlyReportData | YearlyReportData | BilanData | JournalData;
