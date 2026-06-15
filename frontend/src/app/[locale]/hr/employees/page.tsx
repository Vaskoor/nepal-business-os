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
import { Search, Plus, Users, Wallet, Calendar, Mail, Phone, MoreHorizontal, UserCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "@/i18n/navigation";
import api from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

const departmentColors: Record<string, string> = {
  Sales: "bg-blue-500/10 text-blue-600",
  Finance: "bg-emerald-500/10 text-emerald-600",
  Operations: "bg-amber-500/10 text-amber-600",
  Management: "bg-purple-500/10 text-purple-600",
  HR: "bg-pink-500/10 text-pink-600",
};

export default function EmployeesPage() {
  const t = useTranslations("employees");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const { data: employees, isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: () => api.get("/hr/employees").then((res) => res.data),
  });

  if (isLoading) {
    return <div className="p-8 text-center">{tCommon("loading")}</div>;
  }

  const totalEmployees = employees?.length || 0;
  const totalPayroll = employees?.reduce((sum: number, e: any) => sum + e.salary, 0) || 0;
  const avgSalary = totalEmployees ? Math.round(totalPayroll / totalEmployees) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
          <p className="text-muted-foreground">Manage your team members</p>
        </div>
        <Button onClick={() => router.push("/hr/employees/new")}>
          <Plus className="mr-2 h-4 w-4" />
          {t("addEmployee")}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalEmployees}</p>
                <p className="text-sm text-muted-foreground">Total Employees</p>
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
                <p className="text-2xl font-bold">{formatCurrency(totalPayroll, "en")}</p>
                <p className="text-sm text-muted-foreground">Monthly Payroll</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
                <UserCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(avgSalary, "en")}</p>
                <p className="text-sm text-muted-foreground">Average Salary</p>
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
                <TableHead>{t("firstName")}</TableHead>
                <TableHead>{t("lastName")}</TableHead>
                <TableHead>{t("email")}</TableHead>
                <TableHead>{t("phone")}</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>{t("salary")}</TableHead>
                <TableHead>{t("joinDate")}</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees?.map((employee: any) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.firstName}</TableCell>
                  <TableCell>{employee.lastName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      {employee.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      {employee.phone || "—"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={departmentColors[employee.department] || "bg-gray-500/10 text-gray-600"}>
                      {employee.department || "—"}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold">{formatCurrency(employee.salary, "en")}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(employee.joinDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/hr/employees/${employee.id}`)}>
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
              {(!employees || employees.length === 0) && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    {t("noEmployees")}
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
