import { createFormHook, useStore } from "@tanstack/react-form";
import { ComponentProps } from "react";
import {
  fieldContext,
  formContext,
  useFieldContext,
  useFormContext,
} from "./form-context";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ZodError } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

type TextFieldProps = {
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  containerClassName?: string;
};

export const FieldError = ({
  errors,
  isTouched,
}: {
  errors: unknown[];
  isTouched: boolean;
}) => {
  if (!errors?.length) return null;
  if (!isTouched) return null;

  const errorMessages = errors
    .map((item) => {
      if (item instanceof ZodError) {
        return item.message;
      }
      if (item && typeof item === "object" && "message" in item) {
        return item.message;
      }
      return String(item);
    })
    .join(", ");

  return (
    <p className="absolute right-0 -bottom-3 left-0 mt-1 line-clamp-1 text-xs text-red-500">
      {errorMessages}
    </p>
  );
};

export function TextField({
  label,
  placeholder,
  required,
  className,
  inputProps,
  containerClassName,
}: TextFieldProps) {
  const field = useFieldContext<string>();

  const isTouched = useStore(field.store, (state) => state.meta.isTouched);
  const errors = useStore(field.store, (state) => state.meta.errors);
  const inputId = field.name;

  return (
    <div className={cn("relative pb-1", containerClassName)}>
      <div className="space-y-2">
        {label && (
          <Label htmlFor={inputId} className="text-sm font-medium">
            {label}
            {required && <span className="text-red-500">*</span>}
          </Label>
        )}

        <Input
          id={inputId}
          value={field.state.value ?? ""}
          onChange={(e) => {
            field.handleChange(e.target.value);
          }}
          onBlur={field.handleBlur}
          placeholder={placeholder}
          required={required}
          className={cn("w-full", className)}
          {...inputProps}
        />
      </div>

      <FieldError isTouched={isTouched} errors={errors} />
    </div>
  );
}

export function TextareaField({
  label,
  placeholder,
  required,
  className,
  inputProps,
}: TextFieldProps) {
  const field = useFieldContext<string>();
  const errors = useStore(field.store, (state) => state.meta.errors);
  const inputId = field.name;
  const isTouched = useStore(field.store, (state) => state.meta.isTouched);

  return (
    <div className="relative pb-1">
      <div className="space-y-2">
        {label && (
          <Label htmlFor={inputId} className="text-sm font-medium">
            {label}
            {required && <span className="text-red-500">*</span>}
          </Label>
        )}

        <Textarea
          id={inputId}
          value={field.state.value ?? ""}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          placeholder={placeholder}
          required={required}
          className={cn("min-h-[120px] w-full", className)}
          {...inputProps}
        />
      </div>

      <FieldError isTouched={isTouched} errors={errors} />
    </div>
  );
}

type SelectFieldProps = {
  label?: string;
  options: Array<{ value: string; label: string }>;
  required?: boolean;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
};

export function SelectField({
  label,
  options,
  required,
  className,
  placeholder = "Select",
  disabled,
}: SelectFieldProps) {
  const field = useFieldContext<string>();
  const errors = useStore(field.store, (state) => state.meta.errors);
  const inputId = field.name;
  const isTouched = useStore(field.store, (state) => state.meta.isTouched);

  return (
    <div className="relative pb-1">
      <div className="space-y-2">
        {label && (
          <Label htmlFor={inputId} className="text-sm font-medium">
            {label}
            {required && <span className="text-red-500">*</span>}
          </Label>
        )}
        <Select
          disabled={disabled}
          defaultValue={field.state.value}
          required={required}
          value={field.state.value ?? ""}
          onValueChange={(value) => field.handleChange(value)}
        >
          <SelectTrigger className={cn("w-full", className)}>
            <SelectValue onBlur={field.handleBlur} placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <FieldError isTouched={isTouched} errors={errors} />
    </div>
  );
}

export function RadioField({
  name,
  label,
  options,
  disabled,
  className,
  required,
}: {
  name: string;
  label: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  options: { label: string; value: string }[];
}) {
  const field = useFieldContext<string>();
  const errors = useStore(field.store, (state) => state.meta.errors);
  const isTouched = useStore(field.store, (state) => state.meta.isTouched);

  return (
    <div className="relative pb-1">
      <div className="space-y-2">
        <Label>{label}</Label>
        <RadioGroup
          value={field.state.value ?? ""}
          onValueChange={(value) => field.handleChange(value)}
          required={required}
          className={cn("grid grid-cols-2 gap-3", className)}
          onBlur={field.handleBlur}
          disabled={disabled}
        >
          {options.map((opt) => (
            <div key={opt.value} className="flex items-center space-x-2">
              <RadioGroupItem id={`${name}_${opt.value}`} value={opt.value} />
              <Label htmlFor={`${name}_${opt.value}`}>{opt.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <FieldError isTouched={isTouched} errors={errors} />
    </div>
  );
}

type SubscribeButtonProps = {
  label: string;
  buttonProps?: ComponentProps<typeof Button>;
};

export function SubscribeButton({ label, buttonProps }: SubscribeButtonProps) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button
          {...buttonProps}
          className={cn(
            "cursor-pointer md:min-w-[200px]",
            buttonProps?.className,
          )}
          onClick={form.handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting && <Spinner className="mr-2" />}
          {label}
        </Button>
      )}
    </form.Subscribe>
  );
}

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    TextField,
    SelectField,
  },
  formComponents: {
    SubscribeButton,
  },
  fieldContext,
  formContext,
});
