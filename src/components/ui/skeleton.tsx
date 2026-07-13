import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-surface-secondary dark:bg-surface-secondary-dark",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
