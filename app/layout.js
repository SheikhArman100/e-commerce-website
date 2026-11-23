import QueryProvider from "@/libs/react-query/QueryProvider";
import ToastifyComponent from "@/libs/react-toastify/ToastifyComponent";
import ReviewPromptModal from "@/Components/ReviewPromptModal";
import { Dancing_Script, Italiana, Playfair_Display, Poppins, Roboto_Condensed } from "next/font/google";
import "./globals.css";


// const italiana = Italiana({
//   subsets: ["latin"],
//   weight: "400",
//   variable: "--font-italiana",
// });
const poppins=Poppins({
  subsets:["latin"],
  weight:["100", "200", "300", ],
})
const roboto = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-roboto",
});


const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bakingtales.com";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Baking Tales | Delicious Handcrafted Cakes & Artisanal Delicacies",
    template: "%s | Baking Tales",
  },
  description:
    "Experience the finest handcrafted cakes, cupcakes, pastries, and artisanal baked goods at Baking Tales. Freshly made with love and premium ingredients.",
  keywords: [
    "bakery",
    "handcrafted cakes",
    "cupcakes",
    "artisanal bakery",
    "freshly baked",
    "custom cakes",
    "baking tales",
    "dessert boutique",
    "pastries",
  ],
  authors: [{ name: "Baking Tales", url: siteUrl }],
  creator: "Baking Tales",
  publisher: "Baking Tales",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Baking Tales | Handcrafted Cakes & Artisanal Delicacies",
    description:
      "Finest handcrafted cakes, cupcakes, and artisanal pastries made fresh with pure ingredients.",
    url: siteUrl,
    siteName: "Baking Tales",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Baking Tales | Handcrafted Cakes & Artisanal Delicacies",
    description:
      "Finest handcrafted cakes, cupcakes, and artisanal pastries made fresh with pure ingredients.",
    creator: "@bakingtales",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "Bakery",
  name: "Baking Tales",
  url: siteUrl,
  description:
    "Finest handcrafted cakes, cupcakes, and artisanal baked delicacies made fresh with pure ingredients.",
  priceRange: "$$",
  servesCuisine: ["Bakery", "Desserts", "Pastries", "Cakes"],
  potentialAction: {
    "@type": "OrderAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteUrl}/products`,
      actionPlatform: [
        "http://schema.org/DesktopWebPlatform",
        "http://schema.org/MobileWebPlatform",
      ],
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
      </head>
      <body
        className={`${roboto.variable} ${poppins.className} `}
      >
        <QueryProvider>
          {children}
          {/* Delivered-but-unreviewed prompt for signed-in customers; the
              component itself opts out on /auth and /checkout. */}
          <ReviewPromptModal />
          <ToastifyComponent />
        </QueryProvider>
      </body>
    </html>
  );
}
