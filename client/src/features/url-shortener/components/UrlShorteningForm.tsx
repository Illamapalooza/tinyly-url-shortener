import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { urlFormSchema, UrlFormValues, UrlShorteningFormProps } from "../types";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export function UrlShorteningForm({
  onShorten,
  isLoading,
}: UrlShorteningFormProps) {
  const form = useForm<UrlFormValues>({
    resolver: zodResolver(urlFormSchema),
    defaultValues: {
      longUrl: "",
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
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="w-full mt-2 font-semibold text-base"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? <LoadingSpinner /> : "Shorten URL"}
        </Button>
      </form>
    </Form>
  );
}
