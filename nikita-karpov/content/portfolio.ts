/**
 * Editorial layer for the portfolio.
 *
 * Technical data (sizes, blur placeholders, EXIF) is generated into
 * content/media.json by `npm run media`. This file is the hand-written part:
 * how categories are named and ordered, what each photo is called, its alt
 * text, and which images are featured where.
 *
 * Adding photos:
 *   1. Drop originals into media/photos/<folder>/  (folder = category key)
 *   2. npm run media
 *   3. Optionally give them a title/alt below (ids are printed in media.json).
 *      Untitled photos still appear, with a generic caption.
 */

export type CategoryConfig = {
  /** Folder name under media/photos. */
  key: string;
  /** URL segment: /work/<slug> */
  slug: string;
  title: string;
  blurb: string;
  /** Photo id used as the category's cover. */
  cover: string;
  /** Optional: ids to show first, in this order. Others follow by filename. */
  order?: string[];
};

export const categories: CategoryConfig[] = [
  {
    key: "people",
    slug: "portraits",
    title: "Portraits",
    blurb: "People in the places that suit them: in studio, on the street or out in the woods.",
    cover: "dsc04277",
    order: ["dsc04277", "dsc08483-enhanced-nr", "dsc06148"],
  },
  {
    key: "events",
    slug: "events",
    title: "Events",
    blurb: "Celebrations and ceremonies, and the small details that make them.",
    cover: "dsc00910",
    order: ["dsc00910", "dsc07323", "dsc06741"],
  },
  {
    key: "sports",
    slug: "sport",
    title: "Sport",
    blurb: "Fast shutter, close to the action, on turf, indoors and out.",
    cover: "dsc01180",
    order: ["dsc01180", "imgl0009", "dsc01323"],
  },
  {
    key: "promo",
    slug: "product",
    title: "Product",
    blurb: "Jewellery and product imagery, styled in studio or on location.",
    cover: "dsc06026",
    order: ["dsc06026", "dsc06077", "dsc05818"],
  },
  {
    key: "street",
    slug: "street",
    title: "Street",
    blurb: "Unplanned frames from around the city.",
    cover: "dsc00703",
    order: ["dsc00703", "dsc00548", "dsc00625"],
  },
  {
    key: "animals",
    slug: "animals",
    title: "Animals",
    blurb: "Pets with personality, photographed with patience.",
    cover: "cat-in-nyc",
    order: ["cat-in-nyc", "dsc05339-2", "dsc00075-enhanced-nr"],
  },
];

export type PhotoText = {
  title: string;
  alt: string;
  /** Optional place, shown in captions. */
  place?: string;
};

export const photoText: Record<string, PhotoText> = {
  "cat-in-nyc": {
    title: "Cat in NYC",
    place: "New York",
    alt: "Orange cat wearing round sunglasses, a red bow tie and a heavy gold chain",
  },
  "dsc00075-enhanced-nr": {
    title: "Low light",
    alt: "Orange cat in profile, rim-lit against a deep blue darkness",
  },
  "dsc05339-2": {
    title: "On watch",
    alt: "Black-and-white photo of a lean dog standing alert on a paved path, pine trees behind",
  },
  dsc00910: {
    title: "Birthday",
    alt: "Woman in a red dress smiling behind a birthday cake topped with a lit sparkler",
  },
  dsc06741: {
    title: "Ceremony",
    alt: "Young man in a kippah and prayer shawl reading from a prayer book",
  },
  dsc07323: {
    title: "The table",
    alt: "Banquet table set with wine, champagne and plated food at a busy event hall",
  },
  dsc04277: {
    title: "Ballet in the woods",
    alt: "Young dancer in a pale blue tutu holding a pose beside a tree in a forest",
  },
  dsc06148: {
    title: "Studio portrait",
    alt: "Two young girls in party dresses sitting on a dark set surrounded by plush toys",
  },
  "dsc08483-enhanced-nr": {
    title: "Wedding, at dusk",
    alt: "Black-and-white photo of a groom lifting his bride in front of a lit tower at dusk",
  },
  dsc05818: {
    title: "Bracelet",
    alt: "Beaded bracelet in an open gift box on a black background",
  },
  dsc06026: {
    title: "Coral set",
    alt: "Coral and pearl necklace with matching earrings arranged on a white straw hat",
  },
  dsc06077: {
    title: "Green stones",
    alt: "Green beaded necklace and earrings on a white hat resting in the grass",
  },
  dsc01180: {
    title: "Under the dome",
    alt: "Youth soccer players chasing the ball across turf inside an indoor dome",
  },
  dsc01323: {
    title: "Footwork",
    alt: "Low angle on players' cleats and socks on artificial turf",
  },
  imgl0009: {
    title: "Between plays",
    alt: "Soccer player in a navy kit standing on a turf field",
  },
  dsc00548: {
    title: "Mast",
    alt: "Pole hung with flags rising above a striped circus tent into a deep blue sky",
  },
  dsc00625: {
    title: "Ice cold",
    alt: "Cook in a cap and dark glasses working behind a food stand counter",
  },
  dsc00703: {
    title: "Union",
    place: "Toronto",
    alt: "Plush toy in the foreground of a train platform at Union Station",
  },
};

/** Homepage curation. */
export const featured = {
  /** Two images beside the intro. First is the large one. */
  hero: ["dsc04277", "dsc08483-enhanced-nr"],
  /** Selected work, in reading order. Layout is defined in app/page.tsx. */
  selected: [
    "dsc07323",
    "dsc00910",
    "cat-in-nyc",
    "dsc06026",
    "dsc00703",
    "dsc05339-2",
    "imgl0009",
    "dsc00548",
  ],
};
