
import type { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "相册管理",
  description: "图床管理",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <section>{children}</section>
}
