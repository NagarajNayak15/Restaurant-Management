"use client";

import { cn } from "@/lib/utils";

const Badge = ({ children, className, variant = "default", ...props }) => {
  const baseStyles = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    preparing: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    paid: "bg-green-100 text-green-800 hover:bg-green-200",
  };

  return (
    <div className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </div>
  );
};

export { Badge };