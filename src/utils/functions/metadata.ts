import { Metadata } from "next";

export const generateMetadata = ({
    title = `${process.env.NEXT_PUBLIC_APP_NAME}  `,
    description = `${process.env.NEXT_PUBLIC_APP_NAME} enjoy the connections`,
    image = "/logo1.png",
   icons = [
        { rel: "icon", sizes: "100x100", url: "/favicon-16x16.png" },
        { rel: "icon", sizes: "32x32", url: "/favicon-16x16.png" },
        { rel: "icon", sizes: "64x64", url: "/favicon-16x16.png" },
        { rel: "icon", sizes: "128x128", url: "/favicon-16x16.png" },
        { rel: "icon", sizes: "256x256", url: "/favicon-16x16.png" },
    ],
    noIndex = false
}: {
    title?: string;
    description?: string;
    image?: string | null;
    icons?: Metadata["icons"];
    noIndex?: boolean;
} = {}): Metadata => ({
    title,
    description,
    icons,
    openGraph: {
        title,
        description,
        ...(image && { images: [{ url: image }] }),
    },
    twitter: {
        title,
        description,
        ...(image && { card: "summary_large_image", images: [image] }),
        creator: "@Prashanth_chowdari",
    },
    ...(noIndex && { robots: { index: false, follow: false } }),
});
