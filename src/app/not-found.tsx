"use client";
import { Footer, Navbar } from '@/components';
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

const NotFound = () => {
    const DynamicPlayer = dynamic(
        () => import("@lottiefiles/react-lottie-player").then(mod => mod.Player),
        { ssr: false }
    );

    return (
        <main className="relative flex flex-col items-center justify-start px-4 pt-20 sm:pt-24">
            {/* Fixed Navbar */}
            <div className="fixed top-0 left-0 w-full z-50">
                <Navbar />
            </div>

            <div className="flex flex-col items-center justify-center w-full flex-1">
                <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto text-center">

                    {/* Slight space above animation */}
                    <div className="h-4 sm:h-6"></div>

                    {/* Lottie Animation */}
                    <DynamicPlayer 
                        autoplay 
                        loop 
                        src="/animations/404 error page with cat.json" 
                        style={{ width: "100%", maxWidth: "600px", height: "auto" }} 
                    />

                    {/* Space below animation */}
                    <div className="h-4 sm:h-6"></div>

                    {/* Text */}
                    <p className="text-sm sm:text-base text-neutral-400 font-medium mt-2 mx-4">
                        The page you are looking for does not exist. <br /> 
                        But don&apos;t worry, we&apos;ve got you covered. You can{" "}
                        <a href="/resources/help" className="text-foreground underline">
                            contact us
                        </a>
                    </p>

                    {/* Back Button */}
                    <a href="/">
                        <Button className="mt-4 mb-6 sm:mt-6 px-4 py-2 sm:px-6 sm:py-3">
                            Back to homepage
                        </Button>
                    </a>
                </div>
            </div>

            <Footer />
        </main>
    );
}

export default NotFound;
