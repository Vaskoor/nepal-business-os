"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Search, Play, Wallet, Users, TrendingUp, Calendar, MoreHorizontal, Banknote } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "@/i18n/navigation";
import api from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

export default function PayrollPage() {
  const t = useTranslations("payroll");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showRunDialog, setShowRunDialog] = useState(false);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const { data: payrolls, isLoading } = useQuery({
    queryKey: ["payroll"],
    queryFn: () => api.get("/payroll").then((res) => res.data),
  });

  const runMutation = useMutation({
    mutationFn: () => api.post("/payroll/run", { month, year }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payroll"] });
      setShowRunDialog(false);
    },
  });

  if (isLoading) {
    return <div className="p-8 text-center">{tCommon("loading")}</div>;
  }

  const totalEmployees = payrolls?.length || 0;
  const processedCount = payrolls?.filter((p: any) => p.netSalary > 0).length || 0;
  const totalNetSalary = payrolls?.reduce((sum: number, p: any) => sum + p.netSalary, 0) || 0;
  const totalDeductions = payrolls?.reduce((sum: number, p: any) => sum + p.deductions, 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
          <p className="text-muted-foreground">Process and manage employee payroll</p>
        </div>
        <Button onClick={() => setShowRunDialog(true)}>
          <Play className="mr-2 h-4 w-4" />
          {t("runPayroll")}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalEmployees}</p>
                <p className="text-sm text-muted-foreground">Records</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                <Wallet className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(totalNetSalary, "en")}</p>
                <p className="text-sm text-muted-foreground">Net Payroll</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10">
                <TrendingUp className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(totalDeductions, "en")}</p>
                <p className="text-sm text-muted-foreground">Total Deductions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
                <Banknote className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{processedCount}/{totalEmployees}</p>
                <p className="text-sm text-muted-foreground">Processed</p>
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
                <TableHead>Employee</TableHead>
                <TableHead>Month</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Gross Salary</TableHead>
                <TableHead>Deductions</TableHead>
                <TableHead>Net Salary</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrolls?.map((run: any) => (
                <TableRow key={run.id}>
                  <TableCell className="font-medium">{run.employee?.firstName} {run.employee?.lastName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      {run.month}
                    </div>
                  </TableCell>
                  <TableCell>{run.year}</TableCell>
                  <TableCell>{formatCurrency(run.grossSalary, "en")}</TableCell>
                  <TableCell className="text-destructive">{formatCurrency(run.deductions, "en")}</TableCell>
                  <TableCell className="font-semibold text-emerald-600">{formatCurrency(run.netSalary, "en")}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>{tCommon("view")}</DropdownMenuItem>
                        <DropdownMenuItem>Generate Payslip</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {(!payrolls || payrolls.length === 0) && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    {t("noPayroll")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showRunDialog} onOpenChange={setShowRunDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Run Payroll</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label>Month</label>
              <Input type="number" value={month} onChange={(e) => setMonth(parseInt(e.target.value))} min={1} max={12} />
            </div>
            <div className="space-y-2">
              <label>Year</label>
              <Input type="number" value={year} onChange={(e) => setYear(parseInt(e.target.value))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRunDialog(false)}>Cancel</Button>
            <Button onClick={() => runMutation.mutate()} disabled={runMutation.isPending}>
              {runMutation.isPending ? "Processing..." : "Run Payroll"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
