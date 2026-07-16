import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "JX Bible Journey",
    short_name: "JX Journey",
    description: "Interactive Bible learning through listening, puzzles, and story sequencing.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f0e6",
    theme_color: "#082d28",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
