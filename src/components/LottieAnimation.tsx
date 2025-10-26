import dynamic from "next/dynamic";
import React from "react";

// Dynamically import player once, SSR disabled
const DotLottieReact = dynamic(
  () => import("@lottiefiles/dotlottie-react").then((mod) => mod.DotLottieReact),
  {
    ssr: false,
    loading: () => (
      <div style={{ width: 200, height: 200 }} className="animate-pulse bg-gray-800 rounded" />
    ),
  }
);

interface Props {
  src: string; // path like "/animations/login.lottie"
  width?: number;
  height?: number;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
}

export default function LottieAnimation({
  src,
  width = 300,
  height = 300,
  loop = true,
  autoplay = true,
  className = "",
}: Props) {
  return (
    <div className={className} style={{ width, height }}>
      <DotLottieReact src={src} loop={loop} autoplay={autoplay} style={{ width, height }} />
    </div>
  );
}
