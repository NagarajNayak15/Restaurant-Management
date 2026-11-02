"use client";

import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const EmptyState = ({
  className,
  title = "No data found",
  description = "There is no data to display at the moment.",
  icon = <AlertTriangle className="h-8 w-8 text-muted-foreground" />,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center",
        "bg-background text-foreground",
        className
      )}
      {...props}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="mb-2 text-lg font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export { EmptyState };