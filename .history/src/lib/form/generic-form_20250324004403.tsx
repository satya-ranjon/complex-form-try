import {
  useForm,
  FieldValues,
  DefaultValues,
  FormProvider,
  Resolver,
  Mode,
} from "react-hook-form";
import { cn } from "@/lib/utils";
import { GenericFormContext } from "./customContext";
import { Loader2 } from "lucide-react";

type GenericFormProps<TFormData extends FieldValues> = {
  children: React.ReactNode;
  onSubmit: (data: TFormData) => void | Promise<void>;
  defaultValues?: DefaultValues<TFormData>;
  className?: string;
  formClassName?: string;
  isLoading?: boolean;
  submitButtonText?: string;
  showSubmitButton?: boolean;
  resolver?: Resolver<TFormData>;
  mode?: Mode;
  buttonClassName?: string;
  onError?: (error: unknown) => void;
};

export function GenericFormProvider<TFormData extends FieldValues>({
  children,
  onSubmit,
  defaultValues,
  className,
  formClassName,
  isLoading = false,
  submitButtonText = "Submit",
  showSubmitButton = true,
  resolver,
  mode = "onBlur",
  buttonClassName,
  onError,
}: GenericFormProps<TFormData>) {
  const form = useForm<TFormData>({
    defaultValues,
    resolver,
    mode,
  });

  const handleSubmit = async (data: TFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Form submission error:", error);
      onError?.(error);
    }
  };

  return (
    <GenericFormContext.Provider
      value={
        { control: form.control, form } as GenericFormContext<FieldValues>
      }>
      <FormProvider {...form}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className={cn("space-y-4", className)}>
            <div className={cn("space-y-4", formClassName)}>{children}</div>
            {showSubmitButton && (
              <Button
                type="submit"
                disabled={isLoading}
                className={cn("w-full", buttonClassName)}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  submitButtonText
                )}
              </Button>
            )}
          </form>
        </Form>
      </FormProvider>
    </GenericFormContext.Provider>
  );
}

GenericFormProvider.displayName = "GenericFormProvider";
