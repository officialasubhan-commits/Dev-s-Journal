"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

import { motion, HTMLMotionProps } from "framer-motion";

type CardProps = HTMLMotionProps<'div'> & { className?: string };

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <motion.div
      ref={ref}
      className={cn("glass-card text-[var(--text-main)]", className)}
      whileHover={{ scale: 1.02, rotate: 0.5 }}
      transition={{ type: "spring", stiffness: 300 }}
      {...props}
    />
  )
);
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  )
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight font-heading", className)} {...props} />
  )
)
CardTitle.displayName = "CardTitle"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
)
CardContent.displayName = "CardContent"

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-[var(--text-secondary)]", className)} {...props} />
  )
)
CardDescription.displayName = "CardDescription"

export { Card, CardHeader, CardTitle, CardContent, CardDescription }
