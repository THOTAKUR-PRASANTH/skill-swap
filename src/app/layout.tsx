import { getServerSession } from "next-auth";
import "@/styles/globals.css";
import { authOptions } from "@/lib/authOptions";
import { aeonik, cn, generateMetadata, inter } from "@/utils";
import { ClientLayout } from "./ClientLayout";
import { LoaderProvider } from "@/app/context/LoaderContext";
import TopLoader from "@/components/SkillSwapLoader/toploader";
import { SidebarProvider } from "@/app/context/SidebarContext";

export const metadata = generateMetadata();

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className="scrollbar">
      <body
        className={cn(
          "min-h-screen bg-background text-foreground antialiased !font-default overflow-x-hidden",
          aeonik.variable,
          inter.variable
        )}
      >

       <TopLoader />
       <SidebarProvider>
        <LoaderProvider>
          <ClientLayout session={session}>{children}</ClientLayout>
        </LoaderProvider>
        </SidebarProvider>
      </body>
    </html>
  );
}
