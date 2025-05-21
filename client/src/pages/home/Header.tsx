import { Button } from "@/components/ui/button";
import { History } from "lucide-react";

type HeaderProps = {
  onOpenRecentUrls: () => void;
};

export default function Header({ onOpenRecentUrls }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/70 backdrop-blur-sm border-b border-gray-100 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-black bg-gradient-to-r from-green-600 to-yellow-500 bg-clip-text text-transparent">
              TINYLY
            </h1>
          </div>
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenRecentUrls}
              className="flex items-center gap-1"
            >
              <History className="h-4 w-4" />
              <span>My Recent URLs</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
