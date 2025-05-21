import { z } from "zod";

export const urlFormSchema = z.object({
  longUrl: z.string().url("Please enter a valid URL"),
});

export type UrlFormValues = z.infer<typeof urlFormSchema>;

export type UrlShorteningFormProps = {
  onShorten: (
    values: UrlFormValues
  ) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
};

export type ShortUrlDisplayProps = {
  shortUrl: string;
};
