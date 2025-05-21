import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useCopyToClipboard } from "../../../hooks/use-copy-to-clipboard";
import { ShortUrlDisplayProps } from "../types";

export function ShortUrlDisplay({ shortUrl }: ShortUrlDisplayProps) {
  const { copyToClipboard } = useCopyToClipboard();

  const handleCopy = () => {
    copyToClipboard(shortUrl);
  };

  return (
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
  );
}
