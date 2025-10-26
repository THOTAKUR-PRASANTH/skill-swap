"use client";

import dynamic from "next/dynamic";

export default function AnimatedUserProfile() {
 const DynamicPlayer = dynamic(
       () => import("@lottiefiles/react-lottie-player").then(mod => mod.Player),
       { ssr: false }
     );

    return (
        <div className="w-9 h-9 rounded-full ring-1 ring-neutral-700 overflow-hidden">
        <DynamicPlayer autoplay loop src="/animations/profile persons.json" style={{ width: "100%", maxWidth: "300", height: "auto" }} />
        </div>
    );
}