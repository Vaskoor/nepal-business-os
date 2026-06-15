"use client";
export const dynamic = "force-dynamic";

import { useTranslations } from "next-intl";
import { StatsCard } from "@/components/layout/stats-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Receipt,
  Package,
  Users,
  ArrowRight,
  Plus,
} from "lucide-react";
import { Link } from "@/i18n/navigation";

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const tNav = useTranslations("navigation");

  const stats = [
    {
      title: t("sales"),
      value: "रू 1,45,000",
      change: "+12.5%",
      trend: "up" as const,
      icon: DollarSign,
      description: t("thisMonth"),
    },
    {
      title: t("purchases"),
      value: "रू 89,500",
      change: "+8.2%",
      trend: "up" as const,
      icon: ShoppingBag,
      description: t("thisMonth"),
    },
    {
      title: t("expenses"),
      value: "रू 34,200",
      change: "-2.4%",
      trend: "down" as const,
      icon: Receipt,
      description: t("thisMonth"),
    },
    {
      title: t("profit"),
      value: "रू 21,300",
      change: "+15.8%",
      trend: "up" as const,
      icon: TrendingUp,
      description: t("thisMonth"),
    },
  ];

  const quickActions = [
    { name: t("createInvoice"), href: "/invoices", icon: Plus, color: "bg-blue-500/10 text-blue-600" },
    { name: t("addProduct"), href: "/products", icon: Package, color: "bg-emerald-500/10 text-emerald-600" },
    { name: t("addCustomer"), href: "/customers", icon: Users, color: "bg-amber-500/10 text-amber-600" },
    { name: t("viewReports"), href: "/reports", icon: TrendingUp, color: "bg-purple-500/10 text-purple-600" },
  ];

  const recentActivity = [
    { id: 1, type: "invoice", description: "Invoice #INV-001 created for ABC Company", amount: "रू 25,000", time: "2 hours ago", status: "paid" },
    { id: 2, type: "purchase", description: "Purchase order #PO-001 from XYZ Suppliers", amount: "रू 45,000", time: "5 hours ago", status: "pending" },
    { id: 3, type: "expense", description: "Office rent payment", amount: "रू 15,000", time: "1 day ago", status: "completed" },
    { id: 4, type: "invoice", description: "Invoice #INV-002 created for DEF Traders", amount: "रू 18,500", time: "1 day ago", status: "pending" },
    { id: 5, type: "product", description: "New product added: Premium Rice 25kg", amount: "-", time: "2 days ago", status: "completed" },
  ];

  const lowStockItems = [
    { name: "Premium Rice 25kg", sku: "RICE-001", stock: 5 },
    { name: "Sunflower Oil 1L", sku: "OIL-002", stock: 3 },
    { name: "Sugar 1kg", sku: "SUG-003", stock: 8 },
    { name: "Wheat Flour 5kg", sku: "WF-004", stock: 2 },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {t("welcome")}, Admin
          </h2>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your business today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            {t("thisMonth")}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Quick Actions & Low Stock */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">{t("quickActions")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <Link
                  key={action.name}
                  href={action.href}
                  className="flex flex-col items-center gap-3 rounded-xl border p-4 transition-all duration-200 hover:bg-accent hover:shadow-md group"
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${action.color} transition-transform group-hover:scale-110`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-medium text-center">{action.name}</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">{t("lowStock")}</CardTitle>
            <Badge variant="warning">{lowStockItems.length} items</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockItems.map((item) => (
                <div
                  key={item.sku}
                  className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.sku}</p>
                  </div>
                  <Badge
                    variant={item.stock <= 3 ? "destructive" : "warning"}
                    className="text-xs"
                  >
                    {item.stock} left
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4" size="sm" asChild>
              <Link href="/products">
                View all products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("recentActivity")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    activity.type === "invoice"
                      ? "bg-blue-500/10 text-blue-600"
                      : activity.type === "purchase"
                      ? "bg-emerald-500/10 text-emerald-600"
                      : activity.type === "expense"
                      ? "bg-red-500/10 text-red-600"
                      : "bg-purple-500/10 text-purple-600"
                  }`}>
                    {activity.type === "invoice" ? (
                      <DollarSign className="h-5 w-5" />
                    ) : activity.type === "purchase" ? (
                      <ShoppingBag className="h-5 w-5" />
                    ) : activity.type === "expense" ? (
                      <Receipt className="h-5 w-5" />
                    ) : (
                      <Package className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold">{activity.amount}</span>
                  <Badge
                    variant={
                      activity.status === "paid"
                        ? "success"
                        : activity.status === "pending"
                        ? "warning"
                        : "default"
                    }
                    className="text-xs"
                  >
                    {activity.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
