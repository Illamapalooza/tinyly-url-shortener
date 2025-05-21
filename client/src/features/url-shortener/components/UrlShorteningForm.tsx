import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { urlFormSchema, UrlFormValues, UrlShorteningFormProps } from "../types";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function UrlShorteningForm({
  onShorten,
  isLoading,
}: UrlShorteningFormProps) {
  const form = useForm<UrlFormValues>({
    resolver: zodResolver(urlFormSchema),
    defaultValues: {
      longUrl: "",
      customSlug: "",
      expiration: undefined,
      utmSource: "",
      utmMedium: "",
      utmCampaign: "",
    },
  });

  const handleSubmit: SubmitHandler<UrlFormValues> = async (values) => {
    const result = await onShorten(values);

    if (!result.success && result.error) {
      form.setError("longUrl", {
        message: result.error,
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="longUrl"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="https://your-long-url.com"
                  className="text-base py-6 placeholder:text-gray-400 font-medium"
                  required
                  type="url"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="custom-options" className="border-b-0">
            <AccordionTrigger className="py-2 text-sm">
              Custom Options
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-4 p-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="customSlug"
                    render={({ field }) => (
                      <FormItem className="max-w-sm">
                        <FormLabel className="text-sm">Your Alias</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="your-custom-slug"
                            className="text-sm placeholder:text-gray-400"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="expiration"
                    render={({ field }) => (
                      <FormItem className="max-w-xs">
                        <FormLabel className="text-sm">
                          Expiration (days)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            placeholder="30"
                            className="text-sm placeholder:text-gray-400"
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value
                                ? parseInt(e.target.value, 10)
                                : undefined;
                              field.onChange(value);
                            }}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-3 rounded-md border p-3">
                  <h3 className="text-xs font-medium mb-2">UTM Parameters</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <FormField
                      control={form.control}
                      name="utmSource"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Source</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="facebook"
                              className="text-sm h-8 placeholder:text-gray-400"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="utmMedium"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Medium</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="social"
                              className="text-sm h-8 placeholder:text-gray-400"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="utmCampaign"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Campaign</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="summer_sale"
                              className="text-sm h-8 placeholder:text-gray-400"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Button
          className="w-full mt-2 font-semibold text-base"
          type="submit"
          disabled={isLoading || !form.formState.isValid}
        >
          {isLoading ? <LoadingSpinner /> : "Shorten URL"}
        </Button>
      </form>
    </Form>
  );
}
