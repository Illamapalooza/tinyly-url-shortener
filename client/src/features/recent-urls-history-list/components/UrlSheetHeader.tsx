import { Button } from "@/components/ui/button";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";

type UrlSheetHeaderProps = {
  onClearHistory: () => Promise<void>;
  hasUrls: boolean;
};

export function UrlSheetHeader({
  onClearHistory,
  hasUrls,
}: UrlSheetHeaderProps) {
  return (
    <SheetHeader className="pb-2 flex flex-row justify-between items-center pt-4">
      <SheetTitle className="text-xl">Recent URLs</SheetTitle>
      <Button
        variant="link"
        className="text-destructive"
        onClick={onClearHistory}
        disabled={!hasUrls}
      >
        Clear
      </Button>
    </SheetHeader>
  );
}
