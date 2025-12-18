import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/reset.css";
import "@/styles/custom.sass";
import { AntdRegistry } from "@ant-design/nextjs-registry";

export const metadata: Metadata = {
  title: "Job Portal",
  description: "Find your dream job",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          {children}
        </AntdRegistry>
      </body>
    </html>
  );
}
