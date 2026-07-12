import * as React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  isSuccess?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, isSuccess, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {label && (
          <label className={cn(
            "block text-sm font-medium mb-1.5 transition-colors",
            error ? "text-[var(--danger)]" : "text-[var(--text-main)]"
          )}>
            {label}
          </label>
        )}
        <div className="relative group">
          <input
            type={type}
            className={cn(
              "flex h-12 w-full rounded-xl border-2 bg-[var(--secondary-bg)] px-4 py-2 text-sm text-[var(--text-main)] transition-all",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium",
              "placeholder:text-[var(--text-muted)]",
              "focus-visible:outline-none focus-visible:ring-0",
              error 
                ? "border-[var(--danger)] focus:border-[var(--danger)] focus:shadow-[0_0_15px_rgba(239,68,68,0.2)]" 
                : isSuccess 
                  ? "border-[var(--success)] focus:border-[var(--success)] focus:shadow-[0_0_15px_rgba(34,197,94,0.2)]"
                  : "border-[var(--border-color)] hover:border-[var(--primary)]/50 focus:border-[var(--primary)] focus:bg-white focus:shadow-[0_0_20px_rgba(249,115,22,0.15)]",
              "disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            ref={ref}
            {...props}
          />
          {/* Animated focus glow border overlay */}
          <div className="absolute inset-0 rounded-xl pointer-events-none transition-opacity opacity-0 group-focus-within:opacity-100" />
        </div>
        
        {/* Animated Error Message */}
        <motion.div
          initial={{ opacity: 0, y: -5, height: 0 }}
          animate={{ opacity: error ? 1 : 0, y: error ? 0 : -5, height: error ? "auto" : 0 }}
          className="overflow-hidden"
        >
          {error && (
            <p className="text-sm text-[var(--danger)] mt-1.5 font-medium">{error}</p>
          )}
        </motion.div>
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
