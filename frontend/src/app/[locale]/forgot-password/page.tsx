"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Building2, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import api from "@/lib/api";

export default function ForgotPasswordPage() {
  const t = useTranslations("forgotPassword");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSubmitted(true);
    } catch (err) {
      // Still show success to prevent email enumeration
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/50 to-background p-4">
        <Card className="w-full max-w-md border-0 shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">{t("success")}</h2>
            <p className="text-muted-foreground mb-4">Check your email for reset instructions.</p>
            <Button variant="link" onClick={() => router.push("/login")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> {t("backToLogin")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/50 to-background p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/25 mb-4">
            <Building2 className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">BizFlow</h1>
        </div>

        <Card className="border-0 shadow-2xl shadow-black/5">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl">{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("email")}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="h-11 pl-10"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full h-11" disabled={loading}>
                {loading ? "Sending..." : t("submit")}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <Button variant="link" className="h-auto p-0" onClick={() => router.push("/login")}>
                <ArrowLeft className="mr-2 h-4 w-4" /> {t("backToLogin")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}