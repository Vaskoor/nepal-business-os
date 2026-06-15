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
import { Search, Plus, FileText, TrendingUp, Clock, CheckCircle, AlertCircle, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "@/i18n/navigation";
import api from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

export default function InvoicesPage() {
  const t = useTranslations("invoices");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const { data: invoices, isLoading } = useQuery({
    queryKey: ["invoices"],
    queryFn: () => api.get("/invoices").then((res) => res.data),
  });

  if (isLoading) {
    return <div className="p-8 text-center">{tCommon("loading")}</div>;
  }

  const totalInvoices = invoices?.length || 0;
  const paidCount = invoices?.filter((i: any) => i.status === "PAID").length || 0;
  const pendingAmount = invoices?.filter((i: any) => i.status !== "PAID").reduce((sum: number, i: any) => sum + i.grandTotal, 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
          <p className="text-muted-foreground">Manage your sales invoices</p>
        </div>
        <Button onClick={() => router.push("/invoices/new")}>
          <Plus className="mr-2 h-4 w-4" />
          {t("createInvoice")}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalInvoices}</p>
                <p className="text-sm text-muted-foreground">Total Invoices</p>
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
                <p className="text-2xl font-bold">{paidCount}</p>
                <p className="text-sm text-muted-foreground">Paid Invoices</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
                <TrendingUp className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(pendingAmount, "en")}</p>
                <p className="text-sm text-muted-foreground">Pending Amount</p>
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
                <TableHead>{t("invoiceNo")}</TableHead>
                <TableHead>{t("customer")}</TableHead>
                <TableHead>{t("date")}</TableHead>
                <TableHead>{t("total")}</TableHead>
                <TableHead>{t("tax")}</TableHead>
                <TableHead>{t("grandTotal")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices?.map((invoice: any) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-mono text-sm font-medium">{invoice.invoiceNo}</TableCell>
                  <TableCell>{invoice.customer?.name}</TableCell>
                  <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                  <TableCell>{formatCurrency(invoice.total, "en")}</TableCell>
                  <TableCell className="text-muted-foreground">{formatCurrency(invoice.tax, "en")}</TableCell>
                  <TableCell className="font-semibold">{formatCurrency(invoice.grandTotal, "en")}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        invoice.status === "PAID"
                          ? "success"
                          : invoice.status === "PENDING"
                          ? "warning"
                          : "destructive"
                      }
                    >
                      {invoice.status === "PAID" ? (
                        <CheckCircle className="mr-1 h-3 w-3" />
                      ) : invoice.status === "PENDING" ? (
                        <Clock className="mr-1 h-3 w-3" />
                      ) : (
                        <AlertCircle className="mr-1 h-3 w-3" />
                      )}
                      {invoice.status.toLowerCase()}
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
                        <DropdownMenuItem onClick={() => router.push(`/invoices/${invoice.id}`)}>
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
              {(!invoices || invoices.length === 0) && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    {t("noInvoices")}
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
