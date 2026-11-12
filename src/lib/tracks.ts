// The six sponsor tracks. The slug is the route (/lenovo), the folder (src/app/lenovo/)
// and the PR title prefix ("lenovo: ..."). Tier and owner live in each track's CHECKLIST.md.
export const tracks = [
  { slug: "rtx", name: "RTX", channel: 2 },
  { slug: "cisco", name: "Cisco", channel: 3 },
  { slug: "amat", name: "Applied Materials", channel: 4 },
  { slug: "sandia", name: "Sandia National Laboratories", channel: 5 },
  { slug: "lenovo", name: "Lenovo", channel: 6 },
  { slug: "medtronic", name: "Medtronic", channel: 7 },
] as const;

export type TrackSlug = (typeof tracks)[number]["slug"] | "shared";
