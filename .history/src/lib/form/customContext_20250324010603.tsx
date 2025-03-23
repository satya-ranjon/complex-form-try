import { createContext, useContext } from "react";
import { Control, UseFormReturn, FieldValues } from "react-hook-form";

export type GenericFormContext<TFormData extends FieldValues> = {
  control: Control<TFormData>;
  form: UseFormReturn<TFormData>;
};

export const GenericFormContext =
  createContext<GenericFormContext<FieldValues> | null>(null);

export function useGenericFormContext<TFormData extends FieldValues>() {
  const context = useContext(GenericFormContext);
  if (!context) {
    throw new Error(
      "useGenericFormContext must be used within a GenericFormProvider"
    );
  }

  return context as GenericFormContext<TFormData>;
}

export function useGenericForm<TFormData extends FieldValues>() {
  const context = useGenericFormContext<TFormData>();
  return context.form;
}
