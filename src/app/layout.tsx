import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter as requested in PRD
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import GlobalSearch from "@/components/GlobalSearch";
import { getProjects } from "@/lib/projects";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Roadmap Engine",
  description: "Strategy Matrix Assessment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const projects = getProjects();
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden bg-slate-50">
            <Sidebar />
            <div className="flex-grow flex flex-col h-screen overflow-hidden">
                 {/* Top Bar */}
                 <div className="flex-none h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-10">
                    <div className="text-sm font-medium text-slate-500">
                         {/* Breadcrumbs or Date */}
                         {today}
                    </div>
                    <div>
                        <GlobalSearch projects={projects} />
                    </div>
                 </div>

                 {/* Main Content */}
                <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
                    {children}
                </div>
            </div>
        </div>
      </body>
    </html>
  );
}
