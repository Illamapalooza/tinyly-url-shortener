import { useState } from "react";
import { useUrlShortener } from "../hooks/use-url-shortener";
import { UrlShorteningForm } from "./UrlShorteningForm";
import { ShortUrlDisplay } from "./ShortUrlDisplay";
import { ShortenerHeader } from "./ShortenerHeader";
import { Button } from "@/components/ui/button";
import { UrlFormValues } from "../types";

export default function ShortenerCard() {
  const { shortUrl, isLoading, shortenUrl } = useUrlShortener();
  const [showSuccessView, setShowSuccessView] = useState(false);
  const [longUrl, setLongUrl] = useState("");

  const handleShortenUrl = async (values: UrlFormValues) => {
    setLongUrl(values.longUrl);
    const result = await shortenUrl(values);
    if (result.success) {
      setShowSuccessView(true);
    }
    return result;
  };

  const handleShortenAnother = () => {
    setShowSuccessView(false);
  };

  return (
    <div className="glass-card max-w-lg w-full px-8 py-10 mx-auto animate-in-up">
      <ShortenerHeader />

      {showSuccessView ? (
        <div className="flex flex-col items-center gap-6 mt-4">
          <h2 className="text-xl font-semibold text-green-600">
            URL Shortened Successfully!
          </h2>

          <div className="w-full">
            <div className="mb-4 p-3 border rounded-md bg-slate-50">
              <h3 className="text-sm font-medium text-slate-500 mb-1">
                Original URL
              </h3>
              <p className="text-sm break-all font-medium">{longUrl}</p>
            </div>

            {shortUrl && <ShortUrlDisplay shortUrl={shortUrl} />}
          </div>

          <Button
            onClick={handleShortenAnother}
            variant="outline"
            className="mt-2 w-full font-medium"
          >
            Shorten Another URL
          </Button>
        </div>
      ) : (
        <UrlShorteningForm onShorten={handleShortenUrl} isLoading={isLoading} />
      )}
    </div>
  );
}
