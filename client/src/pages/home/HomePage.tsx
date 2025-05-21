import { useState } from "react";
import ShortenerCard from "@/features/url-shortener/components/ShortenerCard";
import RecentUrlsSheet from "@/features/recent-urls-history-list/components/RecentUrlsSheet";
import Header from "@/pages/home/Header";

function HomePage() {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <Header onOpenRecentUrls={() => setSheetOpen(true)} />
      <div className="min-h-screen pt-16 bg-main-gradient flex flex-col items-center justify-center">
        <div className="max-w-lg w-full mb-6 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to Tinyly
          </h1>
          <p className="text-lg text-gray-700">
            The simplest way to shorten your long URLs and share them easily.
          </p>
        </div>
        <div className="max-w-lg w-full">
          <ShortenerCard />
        </div>
      </div>
      <RecentUrlsSheet open={sheetOpen} onOpenChange={setSheetOpen} />
    </>
  );
}

export default HomePage;
