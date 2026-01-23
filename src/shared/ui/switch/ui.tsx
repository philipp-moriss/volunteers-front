import { cn } from "@/shared/lib/utils";

type SwitchType = {
    checked: boolean;
    onChange: (checked: boolean) => void;
    className?: string;
};

export const Switch = ({ checked, onChange, className }: SwitchType) => {
    return (
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className={cn(
                "relative inline-flex h-[24px] w-[36px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#162A43] focus-visible:ring-offset-2",
                checked ? "bg-[#004573]" : "bg-[#E5E7EB]",
                className
            )}
        >
            <span
                aria-hidden="true"
                className={cn(
                    "pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
                    checked ? "translate-x-[12px]" : "translate-x-0"
                )}
            />
        </button>
    );
};
