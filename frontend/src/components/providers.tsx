"use client";

import { ThemeProvider } from "@/components/layout/theme-provider";
import { NextIntlClientProvider } from "next-intl";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function Providers({
  children,
  messages,
  locale,
}: {
  children: React.ReactNode;
  messages: any;
  locale: string;
}) {
  return (
    <NextIntlClientProvider messages={messages} locale={locale} timeZone="Asia/Kathmandu">
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </NextIntlClientProvider>
  );
}

// Also export as default to match the import in layout.tsx
export default Providers;
