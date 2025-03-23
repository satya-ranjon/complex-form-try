"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { GenericFormProvider } from "@/lib/form/generic-form";
import { useGenericForm } from "@/lib/form/customContext";
import { FormFieldWithBlur } from "@/components/form/form-field";
import { simpleSchema, type SimpleFormData } from "@/lib/form/schemas";

const FormContent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useGenericForm<SimpleFormData>();

  const handleReset = () => {
    form.reset();
    setIsSuccess(false);
    setError(null);
  };

  const handleSubmit = async (data: SimpleFormData) => {
    setIsLoading(true);
    setIsSuccess(false);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Here you would typically make your API call
      console.log("Form submitted:", data);

      setIsSuccess(true);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      console.error("Form error:", err);
    } finally {
      setIsLoading(false);
    }
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

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormFieldWithBlur<SimpleFormData>
          name="name"
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
        />

        <FormFieldWithBlur<SimpleFormData>
          name="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
        />

        <FormFieldWithBlur<SimpleFormData>
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
          // This is just a placeholder - actual submission is handled in FormContent
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
