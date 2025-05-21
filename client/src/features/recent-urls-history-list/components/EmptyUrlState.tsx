import { History } from "lucide-react";

export function EmptyUrlState() {
  return (
    <div className="text-center py-10 text-muted-foreground">
      <History className="mx-auto h-12 w-12 opacity-20 mb-2" />
      <p>No recent URLs found</p>
    </div>
  );
}
