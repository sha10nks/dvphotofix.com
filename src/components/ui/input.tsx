import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-[44px] w-full rounded-[14px] border border-[#D7E0EA] bg-[#F8FAFC] px-4 py-2 text-[15px] text-[#0F172A] placeholder:text-[#94A3B8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-75",
        className
      )}
      {...props}
    />
  )
}

export { Input }
