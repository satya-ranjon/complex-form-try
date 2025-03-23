import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FormFieldWithBlurProps<T extends Record<string, any>> {
  name: keyof T;
  label: string;
  type: string;
  placeholder: string;
  showPasswordToggle?: boolean;
  required?: boolean;
}

export function FormFieldWithBlur<T extends Record<string, any>>({
  name,
  label,
  type,
  placeholder,
  showPasswordToggle,
  required = true,
}: FormFieldWithBlurProps<T>) {
  const {
    formState: { touchedFields, errors },
  } = useFormContext<T>();
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
}
