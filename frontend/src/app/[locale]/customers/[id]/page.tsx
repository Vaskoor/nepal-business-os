"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft, Users, Mail, Phone, MapPin, FileText, DollarSign,
  Trash2, Pencil, AlertCircle
} from "lucide-react";
import api from "@/lib/api";
import { formatDate, formatCurrency } from "@/lib/utils";

export default function CustomerDetailPage() {
  const t = useTranslations("customerDetail");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const [showDelete, setShowDelete] = useState(false);

  const id = params.id as string;

  const { data: customer, isLoading } = useQuery({
    queryKey: ["customer", id],
    queryFn: () => api.get(`/customers/${id}`).then((res) => res.data),
    enabled: !!id,
  });

  const { data: invoices } = useQuery({
    queryKey: ["customer-invoices", id],
    queryFn: () => api.get(`/invoices`).then((res) =>
      res.data?.filter((inv: any) => inv.customerId === id) || []
    ),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/customers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      router.push("/customers");
    },
  });

  if (isLoading) return <div className="p-8 text-center">{tCommon("loading")}</div>;
  if (!customer) return <div className="p-8 text-center">{tCommon("noData")}</div>;

  const totalInvoices = invoices?.length || 0;
  const totalAmount = invoices?.reduce((sum: number, inv: any) => sum + (inv.grandTotal?.toNumber?.() || inv.grandTotal || 0), 0) || 0;
  const outstanding = invoices?.filter((inv: any) => inv.status !== "PAID")
    .reduce((sum: number, inv: any) => sum + (inv.grandTotal?.toNumber?.() || inv.grandTotal || 0), 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/customers")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/customers/${id}/edit`)}>
            <Pencil className="mr-2 h-4 w-4" /> {t("edit")}
          </Button>
          <Button variant="destructive" onClick={() => setShowDelete(true)}>
            <Trash2 className="mr-2 h-4 w-4" /> {t("delete")}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              {t("contactInfo")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="font-medium text-lg">{customer.name}</p>
            <div className="grid gap-4 md:grid-cols-2">
              {customer.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {customer.email}
                </div>
              )}
              {customer.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {customer.phone}
                </div>
              )}
              {customer.address && (
                <div className="flex items-center gap-2 text-sm md:col-span-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {customer.address}
                </div>
              )}
              {customer.pan && (
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  PAN: {customer.pan}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalInvoices}</p>
                  <p className="text-sm text-muted-foreground">{t("totalInvoices")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                  <DollarSign className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatCurrency(totalAmount, locale)}</p>
                  <p className="text-sm text-muted-foreground">{t("totalAmount")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(outstanding, locale)}</p>
                  <p className="text-sm text-muted-foreground">{t("outstanding")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            {t("invoiceHistory")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {invoices?.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">{tCommon("noData")}</div>
          ) : (
            <div className="space-y-3">
              {invoices?.map((invoice: any) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => router.push(`/invoices/${invoice.id}`)}
                >
                  <div>
                    <p className="font-medium">{invoice.invoiceNo}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(invoice.date, locale)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{formatCurrency(invoice.grandTotal?.toNumber?.() || invoice.grandTotal || 0, locale)}</span>
                    <Badge variant={invoice.status === "PAID" ? "success" : invoice.status === "OVERDUE" ? "destructive" : "warning"}>
                      {invoice.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{tCommon("confirmDelete")}</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDelete(false)}>{tCommon("cancel")}</Button>
            <Button variant="destructive" onClick={() => deleteMutation.mutate()} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? tCommon("loading") : tCommon("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
