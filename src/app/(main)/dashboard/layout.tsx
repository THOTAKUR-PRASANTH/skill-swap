
import { DashboardShell } from "@/components";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div >
   
  
      <DashboardShell>
        {children}
      </DashboardShell>
    </div>
  );
}

