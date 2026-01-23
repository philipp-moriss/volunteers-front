import {Button} from "@/shared/ui";
import {SelectSubcategoryListItems} from "@/features/select-subcategory-list/ui";
import {useState} from "react";
import {Icon} from "@/shared/ui/Icon";

export const CategorySkillsView = ({ onNext }: { onNext: (skills: string[]) => void }) => {    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

    const handleToggleSkill = (skillId: string) => {
        setSelectedSkills(prev => {
            if (prev.includes(skillId)) {
                return prev.filter(id => id !== skillId);
            } else {
                return [...prev, skillId];
            }
        });
    };
    const handleFindVolunteer = () => {
        onNext(selectedSkills)
    };

    return (
        <div className="pt-[170px] pb-[240px] px-[20px]">
            <SelectSubcategoryListItems
                className={"mt-3"}
                selectedIds={selectedSkills}
                onToggle={handleToggleSkill}
            />
            <div className="fixed z-[1000] bottom-[71px] left-0 right-0 w-full max-w-[395px] mx-auto px-5 py-4 bg-white">
                <div className="pointer-events-auto bg-white">
                    <Button
                        className={"py-4 border border-[#162A43] shadow-[1px_1px_0_0_#162A43,3px_3px_0_0_#162A43] text-[20px]"}
                        variant="primary"
                        fullWidth
                        onClick={handleFindVolunteer}
                        disabled={selectedSkills.length === 0}
                    >
                        Find a volunteer
                    </Button>
                    <div className="flex  mt-3">
                    <div className="mr-2">
                        <Icon iconId={"icon-lock"} size={20}/>
                    </div>
                    <p className={"text-[14px] font-normal text-[#5B5B5B]"}>Your details remain confidential. Volunteers only access the task description.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}