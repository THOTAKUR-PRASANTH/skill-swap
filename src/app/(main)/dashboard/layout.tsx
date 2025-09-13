import { currentUser } from "@clerk/nextjs/server";
import { UserContextProvider } from "@/lib/userContextProvider";
import { DashboardShell } from "@/components";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const clerkUser = await currentUser();

  const user = clerkUser
    ? {
        id: clerkUser.id,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        email: clerkUser.emailAddresses[0]?.emailAddress || null,
        imageUrl: clerkUser.imageUrl,
        phoneNumber: clerkUser.phoneNumbers[0]?.phoneNumber || null,
        twoFactorEnabled: clerkUser.twoFactorEnabled,
      }
    : null;

  return (
    <div >
   
    <UserContextProvider value={user}>
      <DashboardShell>
        {children}
      </DashboardShell>
    </UserContextProvider>
    </div>
  );
}

