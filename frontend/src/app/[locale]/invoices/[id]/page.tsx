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
  ArrowLeft, FileText, Calendar, DollarSign, CheckCircle, Clock, AlertCircle,
  Trash2, Pencil, MapPin, Phone, Mail, Printer, Download
} from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import api from "@/lib/api";
import { formatDate, formatCurrency } from "@/lib/utils";

export default function InvoiceDetailPage() {
  const t = useTranslations("invoiceDetail");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const [showDelete, setShowDelete] = useState(false);

  const id = params.id as string;

  const { data: invoice, isLoading } = useQuery({
    queryKey: ["invoice", id],
    queryFn: () => api.get(`/invoices/${id}`).then((res) => res.data),
    enabled: !!id,
  });

  const updateStatusMutation = useMutation({
    mutationFn: (status: string) => api.patch(`/invoices/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoice", id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/invoices/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      router.push("/invoices");
    },
  });

  if (isLoading) return <div className="p-8 text-center">{tCommon("loading")}</div>;
  if (!invoice) return <div className="p-8 text-center">{tCommon("noData")}</div>;

  const statusConfig: Record<string, { color: string; icon: any }> = {
    PAID: { color: "bg-emerald-500/10 text-emerald-600", icon: CheckCircle },
    PENDING: { color: "bg-amber-500/10 text-amber-600", icon: Clock },
    OVERDUE: { color: "bg-red-500/10 text-red-600", icon: AlertCircle },
  };

  const StatusIcon = statusConfig[invoice.status]?.icon || Clock;
  const statusColor = statusConfig[invoice.status]?.color || "";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/invoices")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
          <p className="text-sm text-muted-foreground">{invoice.invoiceNo}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" /> {t("print")}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" /> {t("download")}
          </Button>
          {invoice.status !== "PAID" && (
            <Button variant="outline" size="sm" onClick={() => updateStatusMutation.mutate("PAID")}>
              <CheckCircle className="mr-2 h-4 w-4" /> {t("markAsPaid")}
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => router.push(`/invoices/${id}/edit`)}>
            <Pencil className="mr-2 h-4 w-4" /> {t("edit")}
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setShowDelete(true)}>
            <Trash2 className="mr-2 h-4 w-4" /> {t("delete")}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {t("invoiceInfo")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant="outline" className={statusColor}>
                  <StatusIcon className="mr-1 h-3 w-3" /> {invoice.status}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDate(invoice.date, locale)}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Tax</p>
                <p>{formatCurrency(invoice.tax?.toNumber?.() || invoice.tax || 0, locale)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Grand Total</p>
                <p className="font-bold text-lg text-primary">{formatCurrency(invoice.grandTotal?.toNumber?.() || invoice.grandTotal || 0, locale)}</p>
              </div>
            </div>
            <Separator />
            <div>
              <h4 className="font-medium mb-3">{t("items")}</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.items?.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.product?.name || item.productId}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.price?.toNumber?.() || item.price || 0, locale)}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(item.total?.toNumber?.() || item.total || 0, locale)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 space-y-2 text-right">
                <p className="text-sm text-muted-foreground">Subtotal: {formatCurrency(invoice.total?.toNumber?.() || invoice.total || 0, locale)}</p>
                <p className="text-sm text-muted-foreground">Tax: {formatCurrency(invoice.tax?.toNumber?.() || invoice.tax || 0, locale)}</p>
                <p className="text-lg font-bold">Grand Total: {formatCurrency(invoice.grandTotal?.toNumber?.() || invoice.grandTotal || 0, locale)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              {t("customerInfo")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="font-medium text-lg">{invoice.customer?.name}</p>
            {invoice.customer?.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {invoice.customer.email}
              </div>
            )}
            {invoice.customer?.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                {invoice.customer.phone}
              </div>
            )}
            {invoice.customer?.address && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {invoice.customer.address}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

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
