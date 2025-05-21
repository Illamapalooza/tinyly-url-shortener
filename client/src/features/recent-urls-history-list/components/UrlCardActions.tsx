import { Copy, ExternalLink, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { useVisitUrl } from "../hooks/use-visit-url";

import { HoverText } from "@/components/shared/HoverText";

type UrlCardActionsProps = {
  shortCode: string;
  onRemove: (shortCode: string) => Promise<void>;
};

export function UrlCardActions({ shortCode, onRemove }: UrlCardActionsProps) {
  const { copyToClipboard } = useCopyToClipboard();
  const { visitUrl } = useVisitUrl();

  const handleRemove = async () => {
    await onRemove(shortCode);
  };

  return (
    <div className="flex flex-wrap gap-2 mt-3 justify-start">
      <HoverText
        text="Copy to clipboard"
        trigger={
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(shortCode)}
          >
            <Copy className="size-4" />
          </Button>
        }
      />

      <HoverText
        text="Visit URL"
        trigger={
          <Button
            variant="default"
            size="sm"
            onClick={() => visitUrl(shortCode)}
          >
            <ExternalLink className="size-4" />
          </Button>
        }
      />

      <HoverText
        text="Delete URL"
        trigger={
          <Button variant="destructive" size="sm" onClick={handleRemove}>
            <Trash className="size-4" />
          </Button>
        }
      />
    </div>
  );
}
