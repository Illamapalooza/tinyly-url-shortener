import { Link } from "react-router-dom";
import { ArrowLeft, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFullUrl } from "@/lib/utils";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

type AnalyticsHeaderProps = {
  shortCode: string;
};

export function AnalyticsHeader({ shortCode }: AnalyticsHeaderProps) {
  const shortUrl = getFullUrl(shortCode);
  const { copyToClipboard } = useCopyToClipboard();

  return (
    <div className="mb-8">
      <div className="mb-4">
        <Link to="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold break-all">{shortUrl}</h1>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(shortUrl)}
          >
            <Copy className="mr-2 h-4 w-4" /> Copy
          </Button>

          <a href={shortUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm">
              <ExternalLink className="mr-2 h-4 w-4" /> Open
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
