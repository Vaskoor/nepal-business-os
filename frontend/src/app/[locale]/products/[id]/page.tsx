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
  ArrowLeft, Package, TrendingUp, DollarSign, BarChart3, Trash2, Pencil,
} from "lucide-react";
import api from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

export default function ProductDetailPage() {
  const t = useTranslations("productDetail");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const [showDelete, setShowDelete] = useState(false);

  const id = params.id as string;

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => api.get(`/products/${id}`).then((res) => res.data),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      router.push("/products");
    },
  });

  if (isLoading) return <div className="p-8 text-center">{tCommon("loading")}</div>;
  if (!product) return <div className="p-8 text-center">{tCommon("noData")}</div>;

  const profitMargin = product.price && product.cost
    ? (((product.price - product.cost) / product.price) * 100).toFixed(1)
    : 0;

  const stockStatus = product.stock <= 0 ? "outOfStock" : product.stock <= 5 ? "lowStock" : "inStock";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/products")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold tracking-tight">{product.name}</h2>
          <p className="text-sm text-muted-foreground">{product.sku}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/products/${id}/edit`)}>
            <Pencil className="mr-2 h-4 w-4" /> {t("edit")}
          </Button>
          <Button variant="destructive" onClick={() => setShowDelete(true)}>
            <Trash2 className="mr-2 h-4 w-4" /> {t("delete")}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(product.price?.toNumber?.() || product.price || 0, locale)}</p>
                <p className="text-sm text-muted-foreground">Price</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
                <Package className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{product.stock}</p>
                <p className="text-sm text-muted-foreground">Stock</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{profitMargin}%</p>
                <p className="text-sm text-muted-foreground">Profit Margin</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <Badge variant={stockStatus === "outOfStock" ? "destructive" : stockStatus === "lowStock" ? "warning" : "success"}>
                  {stockStatus === "outOfStock" ? "Out of Stock" : stockStatus === "lowStock" ? "Low Stock" : "In Stock"}
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">Status</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Product Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">SKU</p>
              <p className="font-medium">{product.sku}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Category</p>
              <p className="font-medium">{product.category?.name || "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Cost</p>
              <p className="font-medium">{formatCurrency(product.cost?.toNumber?.() || product.cost || 0, locale)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Stock Value</p>
              <p className="font-medium">{formatCurrency((product.cost?.toNumber?.() || product.cost || 0) * product.stock, locale)}</p>
            </div>
          </div>
          {product.description && (
            <>
              <Separator />
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Description</p>
                <p>{product.description}</p>
              </div>
            </>
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
