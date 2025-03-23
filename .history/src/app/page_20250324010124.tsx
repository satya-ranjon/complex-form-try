"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormContext } from "react-hook-form";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GenericFormProvider } from "@/lib/form/generic-form";
import { useGenericForm } from "@/lib/form/customContext";

const simpleSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase, and number"
    ),
});

type SimpleFormData = z.infer<typeof simpleSchema>;

const FormFieldWithBlur = ({
  name,
  label,
  type,
  placeholder,
  showPasswordToggle,
  required = true,
}: {
  name: keyof SimpleFormData;
  label: string;
  type: string;
  placeholder: string;
  showPasswordToggle?: boolean;
  required?: boolean;
}) => {
  const {
    formState: { touchedFields, errors },
  } = useFormContext<SimpleFormData>();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                {...field}
                type={showPasswordToggle && showPassword ? "text" : type}
                placeholder={placeholder}
                className={cn(
                  touchedFields[name] && !errors[name] && "border-green-500",
                  touchedFields[name] && errors[name] && "border-red-500"
                )}
              />
              {showPasswordToggle && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const FormContent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const form = useGenericForm<SimpleFormData>();

  const handleReset = () => {
    form.reset();
    setIsSuccess(false);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Simple Registration Form</h1>
        <p className="text-sm text-muted-foreground">
          Fill out the required information below
        </p>
      </div>

      {isSuccess && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-700">Form submitted successfully!</p>
        </div>
      )}

      <form
        onSubmit={form.handleSubmit(async (data) => {
          setIsLoading(true);
          setIsSuccess(false);
          try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log("Form submitted:", data);
            setIsSuccess(true);
            form.reset();
          } catch (error) {
            console.error("Form error:", error);
          } finally {
            setIsLoading(false);
          }
        })}
        className="space-y-4">
        <FormFieldWithBlur
          name="name"
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
        />

        <FormFieldWithBlur
          name="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
        />

        <FormFieldWithBlur
          name="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          showPasswordToggle
        />

        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isLoading}>
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
};

const Page = () => {
  return (
    <div className="container max-w-md mx-auto mt-10">
      <GenericFormProvider<SimpleFormData>
        onSubmit={async (data) => {
          console.log("Form submitted:", data);
        }}
        defaultValues={{
          name: "",
          email: "",
          password: "",
        }}
        resolver={zodResolver(simpleSchema)}
        mode="onBlur"
        submitButtonText="Submit Registration"
        onError={(error) => {
          console.error("Form validation error:", error);
        }}>
        <FormContent />
      </GenericFormProvider>
    </div>
  );
};

export default Page;
