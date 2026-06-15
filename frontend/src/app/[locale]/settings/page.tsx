"use client";
export const dynamic = "force-dynamic";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Building2, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe,
  Save,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  FileText
} from "lucide-react";

export default function SettingsPage() {
  const t = useTranslations("navigation");
  const tCommon = useTranslations("common");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t("settings")}</h2>
        <p className="text-muted-foreground">Manage your business and account settings</p>
      </div>

      {/* Business Profile */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <CardTitle>Business Profile</CardTitle>
          </div>
          <CardDescription>Update your business information and PAN details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Business Name</label>
              <Input defaultValue="Demo Business" placeholder="Enter business name" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">PAN Number</label>
              <Input defaultValue="123456789" placeholder="Enter PAN number" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9" defaultValue="admin@example.com" placeholder="Business email" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9" placeholder="Business phone" />
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9" defaultValue="Kathmandu" placeholder="Business address" />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button>
              <Save className="mr-2 h-4 w-4" />
              {tCommon("save")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tax Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle>Tax & Invoice Settings</CardTitle>
          </div>
          <CardDescription>Configure VAT and invoice preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">VAT Rate (%)</label>
              <Input type="number" defaultValue="13" placeholder="Enter VAT rate" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Invoice Prefix</label>
              <Input defaultValue="INV-" placeholder="e.g., INV-" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Purchase Order Prefix</label>
              <Input defaultValue="PO-" placeholder="e.g., PO-" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Currency</label>
              <Input defaultValue="NPR (रू)" disabled />
            </div>
          </div>
          <div className="flex justify-end">
            <Button>
              <Save className="mr-2 h-4 w-4" />
              {tCommon("save")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <CardTitle>Account Settings</CardTitle>
          </div>
          <CardDescription>Manage your login credentials</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input defaultValue="Admin User" placeholder="Your full name" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input defaultValue="admin@example.com" disabled />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Password</label>
              <Input type="password" placeholder="Enter current password" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">New Password</label>
              <Input type="password" placeholder="Enter new password" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button>
              <Save className="mr-2 h-4 w-4" />
              {tCommon("save")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <CardTitle>Notifications</CardTitle>
          </div>
          <CardDescription>Configure email and system notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {[
              { label: "Low stock alerts", desc: "Get notified when products run low", checked: true },
              { label: "Invoice reminders", desc: "Reminders for pending invoices", checked: true },
              { label: "Payment received", desc: "Notification when payment is received", checked: true },
              { label: "Monthly reports", desc: "Receive monthly summary reports", checked: false },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <div className={`h-6 w-11 rounded-full transition-colors ${item.checked ? 'bg-primary' : 'bg-muted'}`}>
                  <div className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${item.checked ? 'translate-x-5' : 'translate-x-0.5'} mt-0.5`} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}