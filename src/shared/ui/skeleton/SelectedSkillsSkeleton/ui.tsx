import { cn } from "@/shared/lib";
import { Skeleton } from "@/shared/ui/skeleton/skeleton";

export const SelectedSkillsSkeleton = ({ className }: { className?: string }) => {
    return (
        <div
            className={cn(
                "w-full min-h-[58px] flex items-center gap-2 py-3.5 px-3.5 rounded-xl border border-gray-100 bg-white",
                className
            )}
        >
            <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
            <Skeleton className="h-[20px] w-3/4 rounded-md" />
        </div>
    );
};
