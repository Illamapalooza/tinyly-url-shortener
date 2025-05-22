import { useEffect } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { LoadingSpinner } from "../../../components/shared/LoadingSpinner";
import { EmptyUrlState } from "./EmptyUrlState";
import { UrlCard } from "./UrlCard";
import { UrlSheetHeader } from "./UrlSheetHeader";
import { useRecentUrls } from "../hooks/use-recent-urls";

type RecentUrlsSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function RecentUrlsSheet({
  open,
  onOpenChange,
}: RecentUrlsSheetProps) {
  const { recentUrls, isLoading, fetchRecentUrls, clearRecentUrls, removeUrl } =
    useRecentUrls();

  useEffect(() => {
    if (open) {
      fetchRecentUrls();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (recentUrls.length === 0) {
      return <EmptyUrlState />;
    }

    return (
      <div className="grid gap-4 py-4">
        {recentUrls.map((url) => (
          <UrlCard key={url.shortCode} url={url} onRemove={removeUrl} />
        ))}
      </div>
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-1/2 overflow-y-auto">
        <UrlSheetHeader
          onClearHistory={clearRecentUrls}
          hasUrls={recentUrls.length > 0}
        />
        {renderContent()}
      </SheetContent>
    </Sheet>
  );
}
