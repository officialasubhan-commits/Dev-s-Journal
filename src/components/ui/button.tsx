"use client";

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { motion, HTMLMotionProps } from "framer-motion"
import { Loader2, Check } from "lucide-react"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-[var(--primary)] text-white shadow-sm hover:bg-[var(--primary)]/90 border border-[var(--primary)]/10",
        destructive: "bg-[var(--danger)] text-white shadow-sm hover:bg-[var(--danger)]/90",
        outline: "border border-[var(--border-color)] bg-transparent text-[var(--text-main)] hover:bg-[var(--secondary-bg)] hover:border-[var(--primary)]/20",
        secondary: "bg-[var(--secondary-bg)] text-[var(--text-main)] hover:bg-[var(--border-color)] border border-[var(--border-color)] shadow-sm",
        ghost: "hover:bg-[var(--secondary-bg)] text-[var(--text-main)]",
        link: "text-[var(--primary)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-full px-4 text-xs",
        lg: "h-14 rounded-full px-10 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "ref">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  isSuccess?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading, isSuccess, children, ...props }, ref) => {
    
    // We cannot easily use motion with Slot (asChild), so we conditionally render
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }), "active:scale-95")}
          ref={ref}
          {...props}
        >
          {children}
        </Slot>
      )
    }

    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading || isSuccess || props.disabled}
        {...(props as HTMLMotionProps<"button">)}
      >
        <span className={cn("flex items-center justify-center transition-all duration-300", (isLoading || isSuccess) ? "opacity-0 scale-90" : "opacity-100 scale-100")}>
          {children}
        </span>

        {(isLoading || isSuccess) && (
          <span className="absolute inset-0 flex items-center justify-center">
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                <Loader2 className="w-5 h-5 animate-spin" />
              </motion.div>
            )}
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                <Check className="w-5 h-5 text-green-500" />
              </motion.div>
            )}
          </span>
        )}
      </motion.button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
