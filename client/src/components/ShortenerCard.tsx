import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import axios, { AxiosError } from "axios";
import BASE_URL from "@/configs/baseUrl";
import { CreateUrlRequestDto, ShortUrlResponseDto } from "@/types/url";

function isValidUrl(value: string) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export default function ShortenerCard() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [error, setError] = useState("");

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidUrl(longUrl)) {
      setError("Please enter a valid URL.");
      setShortUrl("");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const requestData: CreateUrlRequestDto = {
        originalUrl: longUrl,
      };

      const response = await axios.post<ShortUrlResponseDto>(
        `${BASE_URL}/api/urls`,
        requestData
      );

      if (response.status !== 200) {
        throw new Error("Failed to create short URL");
      }

      const data = response.data;
      const fullShortUrl = `${BASE_URL}/api/urls/${data.shortCode}`;
      setShortUrl(fullShortUrl);
    } catch (err) {
      console.error("Error shortening URL:", err);
      const errorMessage =
        err instanceof AxiosError && err.response?.data?.error
          ? err.response.data.error
          : "Failed to shorten URL";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!shortUrl) return;
    navigator.clipboard.writeText(shortUrl);
    toast({
      title: "Link copied!",
      description: "Your shortened URL is now in your clipboard.",
    });
  };

  return (
    <div className="glass-card max-w-lg w-full px-8 py-10 mx-auto animate-in-up">
      <h1 className="text-2xl font-semibold mb-3 text-gray-900">
        URL Shortener
      </h1>
      <p className="mb-6 text-gray-600">
        Paste a long URL to get a short link.
      </p>
      <form onSubmit={handleShorten} className="flex flex-col gap-4">
        <Input
          type="url"
          placeholder="https://your-long-url.com"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          className="text-base py-6 placeholder:text-gray-400 font-medium"
          required
        />
        {error && <span className="text-red-500 text-xs">{error}</span>}

        <Button
          className="w-full mt-2 font-semibold text-base"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Shortening…" : "Shorten URL"}
        </Button>
      </form>

      {shortUrl && (
        <div className="flex items-center justify-between bg-white/70 rounded-lg mt-7 px-4 py-3 shadow transition-all animate-fade-in">
          <a
            href={shortUrl}
            className="font-mono underline text-sm text-blue-800 truncate max-w-[75%] hover:opacity-90"
            target="_blank"
            rel="noopener noreferrer"
          >
            {shortUrl}
          </a>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className="ml-2"
            aria-label="Copy"
          >
            <Copy className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
