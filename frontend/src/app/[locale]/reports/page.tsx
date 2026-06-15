"use client";
export const dynamic = "force-dynamic";

import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileBarChart,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Receipt,
  Download,
  BarChart3,
  PieChart,
  ArrowRight
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import api from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

export default function ReportsPage() {
  const t = useTranslations("reports");
  const tCommon = useTranslations("common");

  // Fetch sales summary
  const { data: salesSummary, isLoading: salesLoading } = useQuery({
    queryKey: ["sales-summary"],
    queryFn: () => api.get("/reports/sales-summary").then((res) => res.data),
  });

  if (salesLoading) {
    return <div className="p-8 text-center">{tCommon("loading")}</div>;
  }

  const totalSales = salesSummary?.totalSales || 0;
  const invoiceCount = salesSummary?.invoiceCount || 0;

  // For now, other reports use placeholder data
  // Later you can add endpoints for purchase-summary, expense-summary, etc.
  const totalPurchases = 0; // TODO: fetch from backend
  const totalExpenses = 0;   // TODO: fetch from backend
  const netProfit = totalSales - totalPurchases - totalExpenses;

  // Placeholder monthly data (replace with real API)
  const monthlyData = [
    { month: "Jan", sales: 0, purchases: 0, expenses: 0 },
  ];

  const topProducts = [
    { name: "No data yet", sales: 0, revenue: 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
          <p className="text-muted-foreground">Business analytics and financial reports</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          {tCommon("export")}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(totalSales, "en")}</p>
                <p className="text-sm text-muted-foreground">{t("totalSales")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(totalPurchases, "en")}</p>
                <p className="text-sm text-muted-foreground">{t("totalPurchases")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10">
                <Receipt className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(totalExpenses, "en")}</p>
                <p className="text-sm text-muted-foreground">{t("totalExpenses")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-emerald-600' : 'text-destructive'}`}>
                  {formatCurrency(netProfit, "en")}
                </p>
                <p className="text-sm text-muted-foreground">{t("netProfit")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Breakdown (placeholder) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Monthly Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-muted-foreground">
            Connect additional backend endpoints for detailed monthly reports.
          </div>
        </CardContent>
      </Card>

      {/* Top Products & Quick Reports */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Top Selling Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="py-8 text-center text-muted-foreground">
              Add product sales analytics endpoint.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileBarChart className="h-5 w-5 text-primary" />
              Available Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: t("salesSummary"), icon: TrendingUp, color: "bg-emerald-500/10 text-emerald-600" },
                { name: t("purchaseSummary"), icon: ShoppingCart, color: "bg-blue-500/10 text-blue-600" },
                { name: t("expenseSummary"), icon: Receipt, color: "bg-red-500/10 text-red-600" },
                { name: t("profitLoss"), icon: BarChart3, color: "bg-purple-500/10 text-purple-600" },
              ].map((report) => (
                <div
                  key={report.name}
                  className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50 cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${report.color}`}>
                      <report.icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium">{report.name}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
