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
  ArrowLeft, Package, Calendar, DollarSign, Truck, CheckCircle,
  Trash2, Pencil, MapPin, Phone, Mail
} from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import api from "@/lib/api";
import { formatDate, formatCurrency } from "@/lib/utils";

export default function PurchaseDetailPage() {
  const t = useTranslations("purchaseDetail");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const [showDelete, setShowDelete] = useState(false);
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);

  const id = params.id as string;

  const { data: purchase, isLoading } = useQuery({
    queryKey: ["purchase", id],
    queryFn: () => api.get(`/purchases/${id}`).then((res) => res.data),
    enabled: !!id,
  });

  const updateStatusMutation = useMutation({
    mutationFn: (status: string) => api.patch(`/purchases/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase", id] });
      setShowStatusUpdate(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/purchases/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
      router.push("/purchases");
    },
  });

  if (isLoading) return <div className="p-8 text-center">{tCommon("loading")}</div>;
  if (!purchase) return <div className="p-8 text-center">{tCommon("noData")}</div>;

  const statusColors: Record<string, string> = {
    PENDING: "bg-amber-500/10 text-amber-600",
    RECEIVED: "bg-emerald-500/10 text-emerald-600",
    CANCELLED: "bg-red-500/10 text-red-600",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/purchases")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
          <p className="text-sm text-muted-foreground">{purchase.invoiceNo || purchase.id.slice(0, 8)}</p>
        </div>
        <div className="flex gap-2">
          {purchase.status === "PENDING" && (
            <Button variant="outline" onClick={() => setShowStatusUpdate(true)}>
              <CheckCircle className="mr-2 h-4 w-4" /> {t("markAsReceived")}
            </Button>
          )}
          <Button variant="outline" onClick={() => router.push(`/purchases/${id}/edit`)}>
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
              <Package className="h-5 w-5 text-primary" />
              {t("purchaseInfo")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant="outline" className={statusColors[purchase.status] || ""}>
                  {purchase.status}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDate(purchase.date, locale)}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="font-bold text-lg">{formatCurrency(purchase.total?.toNumber?.() || purchase.total || 0, locale)}</p>
              </div>
            </div>
            <Separator />
            <div>
              <h4 className="font-medium mb-3">Items</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Cost</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchase.items?.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.product?.name || item.productId}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.costPrice?.toNumber?.() || item.costPrice || 0, locale)}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(item.total?.toNumber?.() || item.total || 0, locale)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              {t("supplierInfo")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="font-medium text-lg">{purchase.supplier?.name}</p>
            {purchase.supplier?.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {purchase.supplier.email}
              </div>
            )}
            {purchase.supplier?.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                {purchase.supplier.phone}
              </div>
            )}
            {purchase.supplier?.address && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {purchase.supplier.address}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={showStatusUpdate} onOpenChange={setShowStatusUpdate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Status</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatusUpdate(false)}>{tCommon("cancel")}</Button>
            <Button onClick={() => updateStatusMutation.mutate("RECEIVED")} disabled={updateStatusMutation.isPending}>
              {updateStatusMutation.isPending ? tCommon("loading") : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
