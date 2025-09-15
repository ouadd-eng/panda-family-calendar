
import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyRadioItemProps extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  color: string;
}

export const PropertyRadioItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  PropertyRadioItemProps
>(({ className, color, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-5 w-5 rounded-sm text-white ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      style={{ backgroundColor: color }}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Check className="h-3.5 w-3.5 text-white" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});

PropertyRadioItem.displayName = "PropertyRadioItem";
