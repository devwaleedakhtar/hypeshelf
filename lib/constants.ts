export const GENRES = [
    "Action",
    "Comedy",
    "Drama",
    "Horror",
    "Sci-Fi",
    "Animation",
    "Documentary",
    "Other",
] as const;

export const GENRES_WITH_ALL = ["All", ...GENRES] as const;
