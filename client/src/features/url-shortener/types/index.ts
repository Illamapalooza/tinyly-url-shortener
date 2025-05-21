import { z } from "zod";

export const urlFormSchema = z.object({
  longUrl: z.string().url("Please enter a valid URL"),
  customSlug: z.string().optional(),
  expiration: z.number().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
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
