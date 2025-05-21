import { useToast } from "@/hooks/use-toast";

export function useCopyToClipboard() {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    if (!text) return;

    navigator.clipboard.writeText(text);
    toast({
      title: "Link copied!",
      description: "Your shortened URL is now in your clipboard.",
    });
  };

  return { copyToClipboard };
}
