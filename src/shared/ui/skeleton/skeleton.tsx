import { cn } from "@/shared/lib/utils"; // Проверь путь к cn!

function Skeleton({
className,
...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-gray-200", className)}
            {...props}
        />
    )
}

export { Skeleton }
