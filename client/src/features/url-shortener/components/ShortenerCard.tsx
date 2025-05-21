import { useUrlShortener } from "../hooks/use-url-shortener";
import { UrlShorteningForm } from "./UrlShorteningForm";
import { ShortUrlDisplay } from "./ShortUrlDisplay";
import { ShortenerHeader } from "./ShortenerHeader";

export default function ShortenerCard() {
  const { shortUrl, isLoading, shortenUrl } = useUrlShortener();

  return (
    <div className="glass-card max-w-lg w-full px-8 py-10 mx-auto animate-in-up">
      <ShortenerHeader />
      <UrlShorteningForm onShorten={shortenUrl} isLoading={isLoading} />
      {shortUrl && <ShortUrlDisplay shortUrl={shortUrl} />}
    </div>
  );
}
