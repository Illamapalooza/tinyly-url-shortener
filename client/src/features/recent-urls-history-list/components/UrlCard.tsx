import { formatDistanceToNow } from "date-fns";
import { RecentUrl } from "@/types/url";
import { UrlCardActions } from "./UrlCardActions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import BASE_URL from "@/configs/baseUrl";

type UrlCardProps = {
  url: RecentUrl;
  onRemove: (shortCode: string) => Promise<void>;
};

export function UrlCard({ url, onRemove }: UrlCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base truncate">{url.originalUrl}</CardTitle>
        <CardDescription>
          Created {formatDistanceToNow(new Date(url.createdAt))} ago
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="font-mono text-sm bg-muted p-2 rounded-md">
          {`${BASE_URL}/${url.shortCode}`}
        </div>
      </CardContent>
      <CardFooter>
        <UrlCardActions shortCode={url.shortCode} onRemove={onRemove} />
      </CardFooter>
    </Card>
  );
}
