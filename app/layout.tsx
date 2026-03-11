import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "@/app/globals.css";

const bodyFont = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  title: "MeetSync - 가장 빠른 미팅 시간 찾기",
  description: "여러 사람의 가능한 시간을 한 번에 확인하고 가장 적합한 미팅 시간을 찾는 미팅 조율 도구입니다.",
  applicationName: "MeetSync"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${bodyFont.variable} font-sans`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
