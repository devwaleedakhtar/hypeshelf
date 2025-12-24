"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import RecommendationCard from "@/components/RecommendationCard";
import CreateRecommendation from "@/components/CreateRecommendation";
import { useState } from "react";

const GENRES = ["All", "Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Animation", "Documentary", "Other"];

export default function Home() {
  const [selectedGenre, setSelectedGenre] = useState("All");

  // Pass genre to query if it's not "All"
  const queryArgs = selectedGenre === "All" ? {} : { genre: selectedGenre };
  const recommendations = useQuery(api.recommendations.get, queryArgs);

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-zinc-950 text-white">
      {/* Header */}
      <header className="w-full max-w-4xl flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            HypeShelf
          </h1>
          <p className="text-zinc-400 mt-2">
            Collect and share the stuff you’re hyped about.
          </p>
        </div>
        <div>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-white text-zinc-900 font-semibold py-2 px-6 rounded-full hover:bg-zinc-200 transition-colors">
                Sign In to Add Yours
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center gap-4">
              <CreateRecommendation />
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </div>
      </header>

      {/* Content */}
      <section className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-zinc-200">
            Latest Hype
          </h2>
          {/* Genre Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 max-w-[50%] no-scrollbar">
            {GENRES.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${selectedGenre === g
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                  }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {recommendations === undefined ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-500 mb-2">No recommendations found.</p>
            {selectedGenre !== "All" && (
              <button
                onClick={() => setSelectedGenre("All")}
                className="text-blue-400 hover:underline text-sm"
              >
                Clear filter
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((rec) => (
              <RecommendationCard key={rec._id} rec={rec} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
