import { SignIn } from '@clerk/nextjs'


export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <SignIn
        path="/auth/sign-in"
        routing="path"
        signUpUrl="/auth/sign-up"
        fallbackRedirectUrl="/dashboard"
        signUpFallbackRedirectUrl="/dashboard"
        appearance={{
          elements: {
            card: "shadow-xl rounded-xl p-8 w-[400px] bg-white",
            headerTitle: "text-2xl font-semibold text-gray-800",
            headerSubtitle: "text-sm text-gray-500 mb-4",
            formFieldInput:
              "w-full px-3 py-2 border rounded-md focus-visible:border-foreground focus:outline-none",
            formFieldLabel: "text-sm font-medium text-gray-700 mb-1",
            formButtonPrimary:
              "w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition",
            footerActionLink: "text-blue-600 hover:underline",
          },
        }}
      />
    </div>
  );
}
