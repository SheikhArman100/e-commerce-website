import JournalsClient from "./JournalsClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bakingtales.com";

export const metadata = {
  title: "Culinary Chronicles & Journal | Baking Tales",
  description:
    "Explore the narratives, pastry techniques, and sourdough secrets behind our artisanal creations in the Baking Tales Journal.",
  alternates: {
    canonical: `${siteUrl}/journals`,
  },
  openGraph: {
    title: "Culinary Chronicles & Journal | Baking Tales",
    description:
      "Exploring the narratives behind our artisanal creations, from sourdough secrets to the soul of dark chocolate.",
    url: `${siteUrl}/journals`,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Culinary Chronicles & Journal | Baking Tales",
    description:
      "Exploring the narratives behind our artisanal creations, from sourdough secrets to the soul of dark chocolate.",
  },
};

export default function JournalsPage() {
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Baking Tales Culinary Chronicles",
    url: `${siteUrl}/journals`,
    description:
      "Stories and insights into artisanal pastry craft, chocolate tempering, and sourdough science.",
    publisher: {
      "@type": "Organization",
      name: "Baking Tales",
      url: siteUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <JournalsClient />
    </>
  );
}
