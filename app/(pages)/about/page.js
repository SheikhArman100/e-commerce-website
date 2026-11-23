import AboutClient from "./AboutClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bakingtales.com";

export const metadata = {
  title: "Our Heritage & Story | Baking Tales",
  description:
    "Discover the story behind Baking Tales — our artisan pastry heritage, pure organic ingredients, master pâtissiers, and commitment to creating edible memories.",
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  openGraph: {
    title: "Our Heritage & Story | Baking Tales",
    description:
      "A culture of excellence. Sourcing the finest Madagascan vanilla, Belgian chocolate, and locally churned butter.",
    url: `${siteUrl}/about`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Heritage & Story | Baking Tales",
    description:
      "A culture of excellence. Sourcing the finest Madagascan vanilla, Belgian chocolate, and locally churned butter.",
  },
};

export default function AboutPage() {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Baking Tales",
    url: `${siteUrl}/about`,
    description:
      "The heritage and philosophy of Baking Tales artisanal boutique bakery.",
    mainEntity: {
      "@type": "Bakery",
      name: "Baking Tales",
      url: siteUrl,
      foundingDate: "2023",
      servesCuisine: ["Artisanal Bakery", "Cakes", "Cupcakes", "Pastries"],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <AboutClient />
    </>
  );
}
