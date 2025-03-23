"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { GenericFormProvider } from "@/lib/form/generic-form";
import { useGenericForm } from "@/lib/form/customContext";
import { FormFieldWithBlur } from "@/components/form/form-field";
import { multiStepSchema, type MultiStepFormData } from "@/lib/form/schemas";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const steps = [
  { id: "personal", title: "Personal Info" },
  { id: "contact", title: "Contact Info" },
  { id: "account", title: "Account Info" },
] as const;

type Step = (typeof steps)[number]["id"];

const PersonalInfoStep = () => {
  const form = useGenericForm<MultiStepFormData>();

  console.log(form);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormFieldWithBlur<MultiStepFormData>
          name="firstName"
          label="First Name"
          type="text"
          placeholder="Enter your first name"
        />
        <FormFieldWithBlur<MultiStepFormData>
          name="lastName"
          label="Last Name"
          type="text"
          placeholder="Enter your last name"
        />
      </div>

      <FormField
        name="dateOfBirth"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Date of Birth</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}>
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="gender"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gender</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <label htmlFor="male">Male</label>
                  <RadioGroupItem value="female" id="female" />
                  <label htmlFor="female">Female</label>
                  <RadioGroupItem value="other" id="other" />
                  <label htmlFor="other">Other</label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

const ContactInfoStep = () => {
  const form = useGenericForm<MultiStepFormData>();

  return (
    <div className="space-y-4">
      <FormFieldWithBlur<MultiStepFormData>
        name="email"
        label="Email"
        type="email"
        placeholder="Enter your email"
      />

      <FormFieldWithBlur<MultiStepFormData>
        name="phone"
        label="Phone"
        type="tel"
        placeholder="Enter your phone number"
      />

      <FormFieldWithBlur<MultiStepFormData>
        name="address"
        label="Address"
        type="text"
        placeholder="Enter your address"
      />

      <div className="grid grid-cols-2 gap-4">
        <FormFieldWithBlur<MultiStepFormData>
          name="city"
          label="City"
          type="text"
          placeholder="Enter your city"
        />
        <FormField
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="au">Australia</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

const AccountInfoStep = () => {
  const form = useGenericForm<MultiStepFormData>();

  return (
    <div className="space-y-4">
      <FormFieldWithBlur<MultiStepFormData>
        name="username"
        label="Username"
        type="text"
        placeholder="Choose a username"
      />

      <FormFieldWithBlur<MultiStepFormData>
        name="password"
        label="Password"
        type="password"
        placeholder="Create a password"
        showPasswordToggle
      />

      <FormFieldWithBlur<MultiStepFormData>
        name="confirmPassword"
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        showPasswordToggle
      />
    </div>
  );
};

const FormContent = () => {
  const [currentStep, setCurrentStep] = useState<Step>("personal");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useGenericForm<MultiStepFormData>();

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  const handleNext = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      setCurrentStep(steps[currentStepIndex + 1].id);
    }
  };

  const handleBack = () => {
    setCurrentStep(steps[currentStepIndex - 1].id);
  };

  const handleReset = () => {
    form.reset();
    setCurrentStep("personal");
    setIsSuccess(false);
    setError(null);
  };

  const handleSubmit = async (data: MultiStepFormData) => {
    setIsLoading(true);
    setIsSuccess(false);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Form submitted:", data);
      setIsSuccess(true);
      form.reset();
      setCurrentStep("personal");
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
        <h1 className="text-2xl font-bold">Multi-Step Registration Form</h1>
        <p className="text-sm text-muted-foreground">
          Step {currentStepIndex + 1} of {steps.length}
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
        {currentStep === "personal" && <PersonalInfoStep />}
        {currentStep === "contact" && <ContactInfoStep />}
        {currentStep === "account" && <AccountInfoStep />}

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={isFirstStep || isLoading}>
            Back
          </Button>
          <div className="flex gap-2">
            {!isLastStep ? (
              <Button type="button" onClick={handleNext} disabled={isLoading}>
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading}>
                Submit
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={isLoading}>
              Reset
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

const Page = () => {
  return (
    <div className="container max-w-2xl mx-auto mt-10">
      <GenericFormProvider<MultiStepFormData>
        onSubmit={async (data) => {
          console.log("Form submitted:", data);
        }}
        defaultValues={{
          firstName: "",
          lastName: "",
          dateOfBirth: new Date(),
          gender: "male",
          email: "",
          phone: "",
          address: "",
          city: "",
          country: "",
          username: "",
          password: "",
          confirmPassword: "",
        }}
        resolver={zodResolver(multiStepSchema)}
        mode="onBlur"
        onError={(error) => {
          console.error("Form validation error:", error);
        }}>
        <FormContent />
      </GenericFormProvider>
    </div>
  );
};

export default Page;
