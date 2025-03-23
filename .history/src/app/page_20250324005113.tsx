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
import { Eye, EyeOff, CalendarIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { GenericFormProvider } from "@/lib/form/generic-form";
import { useGenericForm } from "@/lib/form/customContext";

const complexSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    confirmPassword: z.string(),
    bio: z.string().min(10, "Bio must be at least 10 characters"),
    dateOfBirth: z.date(),
    gender: z.enum(["male", "female", "other"]),
    interests: z.array(z.string()).min(1, "Select at least one interest"),
    newsletter: z.boolean(),
    phone: z
      .string()
      .regex(
        /^\+?[1-9]\d{1,14}$/,
        "Please enter a valid phone number (e.g., +1234567890)"
      ),
    country: z.string().min(1, "Please select a country"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ComplexFormData = z.infer<typeof complexSchema>;

const FormFieldWithBlur = ({
  name,
  label,
  type,
  placeholder,
  showPasswordToggle,
  required = true,
}: {
  name: keyof ComplexFormData;
  label: string;
  type: string;
  placeholder: string;
  showPasswordToggle?: boolean;
  required?: boolean;
}) => {
  const {
    formState: { touchedFields, errors },
  } = useFormContext<ComplexFormData>();
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

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const form = useGenericForm<ComplexFormData>();

  const handleSubmit = async (data: ComplexFormData) => {
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
  };

  const handleReset = () => {
    form.reset();
    setIsSuccess(false);
  };

  return (
    <div className="container max-w-2xl mx-auto mt-10">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Complex Registration Form</h1>
          <p className="text-sm text-muted-foreground">
            Fill out all the required information below
          </p>
        </div>

        {isSuccess && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-700">Form submitted successfully!</p>
          </div>
        )}

        <GenericFormProvider<ComplexFormData>
          onSubmit={handleSubmit}
          defaultValues={{
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            bio: "",
            dateOfBirth: new Date(),
            gender: "male",
            interests: [],
            newsletter: false,
            phone: "",
            country: "",
          }}
          isLoading={isLoading}
          submitButtonText="Submit Registration"
          className="space-y-4"
          resolver={zodResolver(complexSchema)}
          mode="onBlur"
          onError={(error) => {
            console.error("Form validation error:", error);
          }}>
          <div className="grid grid-cols-2 gap-4">
            <FormFieldWithBlur
              name="firstName"
              label="First Name"
              type="text"
              placeholder="Enter your first name"
            />
            <FormFieldWithBlur
              name="lastName"
              label="Last Name"
              type="text"
              placeholder="Enter your last name"
            />
          </div>

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

          <FormFieldWithBlur
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            showPasswordToggle
          />

          <FormField
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Tell us about yourself"
                    className="min-h-[100px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <FormField
            name="interests"
            render={() => (
              <FormItem>
                <FormLabel>Interests</FormLabel>
                <div className="grid grid-cols-2 gap-4">
                  {["Technology", "Sports", "Music", "Art"].map((interest) => (
                    <FormField
                      key={interest}
                      name="interests"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={interest}
                            className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(interest)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, interest])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value: string) => value !== interest
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {interest}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="newsletter"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Subscribe to newsletter</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormFieldWithBlur
            name="phone"
            label="Phone Number"
            type="tel"
            placeholder="Enter your phone number"
          />

          <FormField
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
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

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Registration"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={isLoading}>
              Reset
            </Button>
          </div>
        </GenericFormProvider>
      </div>
    </div>
  );
};

export default Page;
