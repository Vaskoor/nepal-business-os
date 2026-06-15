"use client";
export const dynamic = "force-dynamic";

import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Search, Plus, ShoppingCart, TrendingUp, Clock, CheckCircle, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "@/i18n/navigation";
import api from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

export default function PurchasesPage() {
  const t = useTranslations("purchases");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const { data: purchases, isLoading } = useQuery({
    queryKey: ["purchases"],
    queryFn: () => api.get("/purchases").then((res) => res.data),
  });

  if (isLoading) {
    return <div className="p-8 text-center">{tCommon("loading")}</div>;
  }

  const totalPurchases = purchases?.length || 0;
  const receivedCount = purchases?.filter((p: any) => p.status === "RECEIVED").length || 0;
  const totalAmount = purchases?.reduce((sum: number, p: any) => sum + p.total, 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
          <p className="text-muted-foreground">Manage your purchase orders</p>
        </div>
        <Button onClick={() => router.push("/purchases/new")}>
          <Plus className="mr-2 h-4 w-4" />
          {t("createPurchase")}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalPurchases}</p>
                <p className="text-sm text-muted-foreground">Total Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{receivedCount}</p>
                <p className="text-sm text-muted-foreground">Received</p>
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
                <p className="text-2xl font-bold">{formatCurrency(totalAmount, "en")}</p>
                <p className="text-sm text-muted-foreground">Total Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder={t("search")} className="pl-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("purchaseNo")}</TableHead>
                <TableHead>{t("supplier")}</TableHead>
                <TableHead>{t("date")}</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>{t("total")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchases?.map((purchase: any) => (
                <TableRow key={purchase.id}>
                  <TableCell className="font-mono text-sm font-medium">{purchase.invoiceNo || purchase.id.slice(0,8)}</TableCell>
                  <TableCell>{purchase.supplier?.name}</TableCell>
                  <TableCell>{new Date(purchase.date).toLocaleDateString()}</TableCell>
                  <TableCell>{purchase.items?.length || 0} items</TableCell>
                  <TableCell className="font-semibold">{formatCurrency(purchase.total, "en")}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        purchase.status === "RECEIVED"
                          ? "success"
                          : purchase.status === "PENDING"
                          ? "warning"
                          : "secondary"
                      }
                    >
                      {purchase.status === "RECEIVED" ? (
                        <CheckCircle className="mr-1 h-3 w-3" />
                      ) : (
                        <Clock className="mr-1 h-3 w-3" />
                      )}
                      {purchase.status === "RECEIVED" ? "Received" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/purchases/${purchase.id}`)}>
                          {tCommon("view")}
                        </DropdownMenuItem>
                        <DropdownMenuItem>{tCommon("edit")}</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          {tCommon("delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {(!purchases || purchases.length === 0) && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    {t("noPurchases")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
