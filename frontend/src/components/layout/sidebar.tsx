"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  ShoppingCart,
  Receipt,
  Briefcase,
  UserCircle,
  Wallet,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Building2,
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navigation = [
  { name: "dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "customers", href: "/customers", icon: Users },
  { name: "products", href: "/products", icon: Package },
  { name: "invoices", href: "/invoices", icon: FileText },
  { name: "purchases", href: "/purchases", icon: ShoppingCart },
  { name: "expenses", href: "/expenses", icon: Receipt },
];

const hrNavigation = [
  { name: "employees", href: "/hr/employees", icon: UserCircle },
  { name: "payroll", href: "/payroll", icon: Wallet },
];

const reportNavigation = [
  { name: "reports", href: "/reports", icon: BarChart3 },
];

function NavItem({
  href,
  icon: Icon,
  label,
  collapsed,
  active,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  collapsed: boolean;
  active: boolean;
}) {
  if (collapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={href}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span className="truncate">{label}</span>
      {active && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-foreground" />}
    </Link>
  );
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const t = useTranslations("navigation");
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-sidebar transition-all duration-300 ease-in-out",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold tracking-tight text-sidebar-foreground">
              BizFlow
            </span>
          )}
        </Link>
      </div>

      {/* Toggle Button */}
      <div className="flex justify-end px-2 -mt-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="h-6 w-6 rounded-full bg-sidebar border border-sidebar-border hover:bg-sidebar-accent"
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto scrollbar-thin">
        <div className={cn("mb-2", collapsed ? "px-1.5" : "px-3")}>
          {!collapsed && (
            <p className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
              Main
            </p>
          )}
          {collapsed && <div className="h-px bg-sidebar-border" />}
        </div>
        <div className="space-y-1">
          {navigation.map((item) => (
            <NavItem
              key={item.name}
              href={item.href}
              icon={item.icon}
              label={t(item.name)}
              collapsed={collapsed}
              active={pathname === item.href}
            />
          ))}
        </div>

        <div className={cn("mt-6 mb-2", collapsed ? "px-1.5" : "px-3")}>
          {!collapsed && (
            <p className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
              HR
            </p>
          )}
          {collapsed && <div className="h-px bg-sidebar-border" />}
        </div>
        <div className="space-y-1">
          {hrNavigation.map((item) => (
            <NavItem
              key={item.name}
              href={item.href}
              icon={item.icon}
              label={t(item.name)}
              collapsed={collapsed}
              active={pathname === item.href}
            />
          ))}
        </div>

        <div className={cn("mt-6 mb-2", collapsed ? "px-1.5" : "px-3")}>
          {!collapsed && (
            <p className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
              Analytics
            </p>
          )}
          {collapsed && <div className="h-px bg-sidebar-border" />}
        </div>
        <div className="space-y-1">
          {reportNavigation.map((item) => (
            <NavItem
              key={item.name}
              href={item.href}
              icon={item.icon}
              label={t(item.name)}
              collapsed={collapsed}
              active={pathname === item.href}
            />
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4">
        {!collapsed && (
          <div className="rounded-lg bg-sidebar-accent/50 p-3">
            <p className="text-xs text-sidebar-foreground/70">
              BizFlow v1.0
            </p>
            <p className="text-xs text-sidebar-foreground/50 mt-1">
              Professional Business Management
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
