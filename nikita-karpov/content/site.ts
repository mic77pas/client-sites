export const site = {
  name: "Nik Karpov",
  role: "Photographer, videographer & editor",
  location: "Toronto, Ontario",
  description:
    "Nik Karpov is a Toronto-based photographer, videographer and editor making clean, cinematic images for people and brands.",
  email: "nikitichkarp@gmail.com",
  socials: [
    { label: "Instagram", handle: "@nktfilms_", href: "https://www.instagram.com/nktfilms_/" },
    { label: "LinkedIn", handle: "nik-karpov", href: "https://www.linkedin.com/in/nik-karpov-9ab58a34b/" },
    { label: "YouTube", handle: "@nicksjuice", href: "https://www.youtube.com/@nicksjuice" },
  ],
} as const;

export const nav = [
  { href: "/work", label: "Work" },
  { href: "/film", label: "Film" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const services = [
  {
    n: "01",
    title: "Photography",
    text: "Portraits, events, sport and product. Planned with you beforehand, shot with natural direction, delivered edited and ready to use.",
    items: ["Portraits & couples", "Events & celebrations", "Sport", "Product & jewellery"],
  },
  {
    n: "02",
    title: "Videography",
    text: "Short films and content for brands, events and social — from planning the shots to filming on the day.",
    items: ["Brand & promo content", "Event coverage", "Social & short-form"],
  },
  {
    n: "03",
    title: "Editing & post",
    text: "Cutting, colour and finishing. Footage or photos you already have, shaped into something that feels considered.",
    items: ["Video editing", "Colour grading", "Photo retouching"],
  },
] as const;

/** Inquiry form options. */
export const projectTypes = ["Photography", "Video", "Photo + video", "Editing only", "Something else"] as const;
