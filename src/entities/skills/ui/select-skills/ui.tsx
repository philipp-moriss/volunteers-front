import {useGetSkillById} from "@/entities/skills/hook/useGetSkillById.tsx";
import {SelectedSkills} from "@/features/selected-skills/ui";
import {SelectedSkillsSkeleton} from "@/shared/ui/skeleton/SelectedSkillsSkeleton";

export const SelectSkills = ({ ids }: { ids: string[] }) => {
    const skillsResults = useGetSkillById(ids);

    return (
        <div className="flex flex-col gap-3">
            {skillsResults.map((result, index) => {
                if (result.isLoading) {
                    return (
                        <SelectedSkillsSkeleton key={index} />
                    );
                }

                const skill = result.data;
                if (!skill) return null;

                return <SelectedSkills key={skill.id} skill={skill} />;
            })}
        </div>
    );
};