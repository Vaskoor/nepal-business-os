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
  ArrowLeft, UserCircle, Mail, Phone, Calendar, DollarSign, Wallet,
  Trash2, Pencil, Briefcase
} from "lucide-react";
import api from "@/lib/api";
import { formatDate, formatCurrency } from "@/lib/utils";

export default function EmployeeDetailPage() {
  const t = useTranslations("employeeDetail");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const [showDelete, setShowDelete] = useState(false);

  const id = params.id as string;

  const { data: employee, isLoading } = useQuery({
    queryKey: ["employee", id],
    queryFn: () => api.get(`/hr/employees/${id}`).then((res) => res.data),
    enabled: !!id,
  });

  const { data: payrolls } = useQuery({
    queryKey: ["employee-payroll", id],
    queryFn: () => api.get(`/payroll`).then((res) =>
      res.data?.filter((p: any) => p.employeeId === id) || []
    ),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/hr/employees/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      router.push("/hr/employees");
    },
  });

  if (isLoading) return <div className="p-8 text-center">{tCommon("loading")}</div>;
  if (!employee) return <div className="p-8 text-center">{tCommon("noData")}</div>;

  const totalPayroll = payrolls?.reduce((sum: number, p: any) => sum + (p.netSalary?.toNumber?.() || p.netSalary || 0), 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/hr/employees")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/hr/employees/${id}/edit`)}>
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
              <UserCircle className="h-5 w-5 text-primary" />
              {t("contactInfo")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="font-medium text-lg">{employee.firstName} {employee.lastName}</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {employee.email}
              </div>
              {employee.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {employee.phone}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                {employee.department || "—"}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {t("joinDate")}: {formatDate(employee.joinDate, locale)}
              </div>
            </div>
            <Separator />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{t("salary")}</p>
                <p className="font-medium text-lg">{formatCurrency(employee.salary?.toNumber?.() || employee.salary || 0, locale)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                  <Wallet className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatCurrency(totalPayroll, locale)}</p>
                  <p className="text-sm text-muted-foreground">{t("totalPayroll")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatCurrency(employee.salary?.toNumber?.() || employee.salary || 0, locale)}</p>
                  <p className="text-sm text-muted-foreground">{t("salaryInfo")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            {t("payrollHistory")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {payrolls?.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">{tCommon("noData")}</div>
          ) : (
            <div className="space-y-3">
              {payrolls?.map((payroll: any) => (
                <div key={payroll.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="font-medium">{payroll.month}/{payroll.year}</p>
                    <p className="text-sm text-muted-foreground">Gross: {formatCurrency(payroll.grossSalary?.toNumber?.() || payroll.grossSalary || 0, locale)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(payroll.netSalary?.toNumber?.() || payroll.netSalary || 0, locale)}</p>
                    <p className="text-xs text-muted-foreground">Net Salary</p>
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
