import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[14px] text-[15px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-75",
  {
    variants: {
      variant: {
        default: "bg-[#2563EB] text-white shadow-sm hover:bg-[#1D4ED8] disabled:bg-[#93C5FD]",
        secondary: "bg-blue-50 text-blue-900 hover:bg-blue-100",
        outline: "border border-[#D7E0EA] bg-white text-slate-900 hover:bg-slate-50",
        ghost: "text-slate-900 hover:bg-slate-100",
        destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
      },
      size: {
        default: "h-[44px] px-5 py-2.5",
        sm: "h-9 rounded-md px-3 text-sm",
        lg: "h-12 rounded-[14px] px-8 text-base",
        icon: "h-[44px] w-[44px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
