import { AppHeader } from "@/components/app-shell/app-header";
import { MobileBottomNav } from "@/components/app-shell/mobile-bottom-nav";
import { Sidebar } from "@/components/app-shell/sidebar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col pb-20 lg:pb-0">
        <AppHeader />
        {children}
      </div>
      <MobileBottomNav />
    </div>
  );
}
