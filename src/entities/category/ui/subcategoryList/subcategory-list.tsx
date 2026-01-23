import {Skill} from "@/entities/category/model";
import {cn} from "@/shared/lib";

type SubcategoryListType = {
    categoryName: string;
    skills: Skill[];
    selectedSkillIds: string[];
    onSkillClick: (id: string) => void;
    onMissingClick?: () => void;
};

export const SubcategoryList = ({
categoryName,
skills,
selectedSkillIds,
onSkillClick,
onMissingClick
            }: SubcategoryListType) => {
    return (
        <div className="w-full">
            <h2 className="text-[20px] font-medium mb-4">
                {categoryName}
            </h2>

            <div className="flex flex-col gap-3">
                {skills.map((skill) => {
                    const isSelected = selectedSkillIds.includes(skill.id);

                    return (
                    <button
                        key={skill.id}
                        onClick={() => onSkillClick(skill.id)}
                        className={cn(
                            "w-full min-h-[58px] flex items-center gap-2 py-2 px-3.5 rounded-xl text-left transition-all duration-200",
                            "bg-white border shadow-[1px_1px_0_0_#F2F2F2,2px_2px_0_0_#F2F2F2]",
                            isSelected
                                ? "border-[#162A43] shadow-[1px_1px_0_0_#162A43,2px_2px_0_0_#162A43]"
                                : "border-[#F2F2F2]"
                        )}
                    >
                        <div
                            className="w-10 h-10 flex items-center justify-center bg-[#EBF7FF] rounded-xl [&>svg]:w-6 [&>svg]:h-6"
                            dangerouslySetInnerHTML={{ __html: skill.iconSvg }}
                        />

                        <span className="text-[18px] font-normal text-[#5B5B5B]">
              {skill.name}
            </span>
                    </button>
                )})}
                <button
                    onClick={onMissingClick}
                    className="w-full min-h-[58px] flex items-center gap-3 py-2 px-4 rounded-xl bg-white border border-[#F2F2F2] shadow-[1px_1px_0_0_#F2F2F2,2px_2px_0_0_#F2F2F2] text-left text-[18px] font-normal text-[#5B5B5B]"
                >
                    Got a request not listed? Tell us!
                </button>
            </div>
        </div>
    );
};
