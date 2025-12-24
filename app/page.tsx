"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import RecommendationCard from "@/components/RecommendationCard";

export default function Home() {
  const recommendations = useQuery(api.recommendations.get);

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
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </header>

      {/* Content */}
      <section className="w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-zinc-200">
          Latest Hype
        </h2>

        {recommendations === undefined ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : recommendations.length === 0 ? (
          <p className="text-zinc-500 text-center">No recommendations yet.</p>
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
