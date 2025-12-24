"use client";

import { useState } from "react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Film } from "lucide-react";
import CreateRecommendation from "@/components/recommendation/CreateRecommendation";
import GenreFilter from "@/components/recommendation/GenreFilter";
import RecommendationFeed from "@/components/recommendation/RecommendationFeed";
import { Button } from "@/components/ui/Button";

export default function Home() {
  const [selectedGenre, setSelectedGenre] = useState("All");

  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-12 bg-zinc-950 text-white selection:bg-blue-500/30">
      <header className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
              HypeShelf
            </span>
          </h1>
          <p className="text-zinc-400 mt-3 text-lg font-light flex items-center justify-center md:justify-start gap-2">
            Collect and share the stuff you're hyped about.
          </p>
        </div>

        <div>
          <SignedOut>
            <SignInButton mode="modal">
              <Button className="py-3 px-8 rounded-full shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.5)] bg-white text-zinc-950 hover:bg-zinc-200">
                Sign in to add yours
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center gap-5">
              <CreateRecommendation />
              <div className="h-8 w-[1px] bg-zinc-800"></div>
              <UserButton afterSignOutUrl="/" appearance={{
                elements: {
                  avatarBox: "w-10 h-10 border-2 border-zinc-800 hover:border-zinc-600 transition-colors"
                }
              }} />
            </div>
          </SignedIn>
        </div>
      </header>

      <section className="w-full max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <h2 className="text-2xl font-bold text-zinc-200 flex items-center gap-2">
            <Film className="text-zinc-500" />
            Latest hype
          </h2>

          <GenreFilter
            selectedGenre={selectedGenre}
            onSelect={setSelectedGenre}
          />
        </div>

        <RecommendationFeed
          selectedGenre={selectedGenre}
          onClearFilter={() => setSelectedGenre("All")}
        />
      </section>
    </main>
  );
}
