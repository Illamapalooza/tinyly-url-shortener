import { Button } from "@/components/ui/button";
import { Copy, ExternalLink } from "lucide-react";
import { useCopyToClipboard } from "../../../hooks/use-copy-to-clipboard";
import { ShortUrlDisplayProps } from "../types";
import { HoverText } from "@/components/shared/HoverText";

export function ShortUrlDisplay({ shortUrl }: ShortUrlDisplayProps) {
  const { copyToClipboard } = useCopyToClipboard();

  const handleCopy = () => {
    copyToClipboard(shortUrl);
  };

  return (
    <div className="flex items-center justify-between bg-white/70 rounded-lg mt-7 px-4 py-3 shadow transition-all animate-fade-in">
      <a
        href={shortUrl}
        className="font-mono underline flex items-center gap-2 text-sm text-blue-800 truncate max-w-[75%] hover:opacity-90"
        target="_blank"
        rel="noopener noreferrer"
        title="Click to open in new tab"
      >
        {shortUrl}
        <ExternalLink className="size-4" />
      </a>
      <HoverText
        text="Copy to clipboard"
        trigger={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className="ml-2"
            aria-label="Copy"
          >
            <Copy className="size-5" />
          </Button>
        }
      />
    </div>
  );
}
