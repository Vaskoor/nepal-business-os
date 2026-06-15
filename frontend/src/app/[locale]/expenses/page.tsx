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
import { Search, Plus, Receipt, TrendingDown, Calendar, MoreHorizontal, FileText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "@/i18n/navigation";
import api from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

const categoryColors: Record<string, string> = {
  Rent: "bg-blue-500/10 text-blue-600",
  Utilities: "bg-amber-500/10 text-amber-600",
  Transportation: "bg-purple-500/10 text-purple-600",
  "Office Supplies": "bg-pink-500/10 text-pink-600",
  Marketing: "bg-emerald-500/10 text-emerald-600",
  Salaries: "bg-red-500/10 text-red-600",
  Insurance: "bg-cyan-500/10 text-cyan-600",
};

export default function ExpensesPage() {
  const t = useTranslations("expenses");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const { data: expenses, isLoading } = useQuery({
    queryKey: ["expenses"],
    queryFn: () => api.get("/expenses").then((res) => res.data),
  });

  if (isLoading) {
    return <div className="p-8 text-center">{tCommon("loading")}</div>;
  }

  const totalExpenses = expenses?.length || 0;
  const totalAmount = expenses?.reduce((sum: number, e: any) => sum + e.amount, 0) || 0;
  const thisMonthAmount = expenses?.filter((e: any) => {
    const d = new Date(e.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).reduce((sum: number, e: any) => sum + e.amount, 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
          <p className="text-muted-foreground">Track and manage business expenses</p>
        </div>
        <Button onClick={() => router.push("/expenses/new")}>
          <Plus className="mr-2 h-4 w-4" />
          {t("addExpense")}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10">
                <Receipt className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalExpenses}</p>
                <p className="text-sm text-muted-foreground">Total Entries</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
                <TrendingDown className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(thisMonthAmount, "en")}</p>
                <p className="text-sm text-muted-foreground">This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(totalAmount, "en")}</p>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
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
                <TableHead>{t("category")}</TableHead>
                <TableHead>{t("description")}</TableHead>
                <TableHead>{t("date")}</TableHead>
                <TableHead>{t("amount")}</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses?.map((expense: any) => (
                <TableRow key={expense.id}>
                  <TableCell>
                    <Badge variant="outline" className={categoryColors[expense.category] || "bg-gray-500/10 text-gray-600"}>
                      {expense.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{expense.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(expense.date).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-destructive">
                    {formatCurrency(expense.amount, "en")}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>{tCommon("edit")}</DropdownMenuItem>
                        <DropdownMenuItem>{tCommon("view")}</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          {tCommon("delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {(!expenses || expenses.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    {t("noExpenses")}
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
