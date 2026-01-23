import {cn} from "@/shared/lib";
import {Skill} from "@/entities/category/model";

type SelectedSkillsType = {
    skill: Skill
}

export const SelectedSkills = ({skill}: SelectedSkillsType) => {
    return (
                    <button
                        className={cn(
                            "w-full min-h-[58px] flex items-center gap-2 py-3.5 px-3.5 rounded-xl text-left transition-all duration-200",
                            "border border-[#162A43] shadow-[1px_1px_0_0_#162A43,2px_2px_0_0_#162A43]"

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
    )
}