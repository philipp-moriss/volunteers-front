import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/shared/ui";
import { SelectSkills } from "@/entities/skills/ui/select-skills";
import { TaskFormCard } from "@/entities/task/ui/task-form-card";
import { taskApi } from "@/entities/task/api";
import { CreateTaskDto } from "@/entities/task/model/types";
import {useGetMe} from "@/entities/user";

type CreateTaskFormProps = {
    skillsIds: string[];
    categoryId: string;
    onBack: () => void;
    onSuccess: () => void;
};

export const CreateTaskForm = ({ skillsIds, categoryId, onBack, onSuccess }: CreateTaskFormProps) => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const { data: user } = useGetMe()
    const { mutate, isPending } = useMutation({
        mutationFn: (data: CreateTaskDto) => taskApi.createTask(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            queryClient.invalidateQueries({ queryKey: ['my-tasks'] });
            onSuccess();
        },
        onError: (error) => {
            console.error("Failed to create task:", error);
        }
    });

    const { register, control, handleSubmit, formState: { errors } } = useForm<CreateTaskDto>({
        mode: "onChange",
        defaultValues: {
            title: "",
            description: "",
            firstResponseMode: false,
            skillIds: skillsIds,
            categoryId: categoryId,
        }
    });
    const onSubmit = (data: CreateTaskDto) => {
        const payload: CreateTaskDto = {
            programId: "32a8ae3b-d7df-4d37-bb0c-ee2ad7824499",
            needyId: user?.id || "",
            type: data.title,
            title: data.title,
            description: data.description,
            details: "",
            skillIds: skillsIds,
            categoryId: categoryId,
            firstResponseMode: data.firstResponseMode,
        };
        mutate(payload);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="h-full pt-[180px] pb-[190px] px-[20px]">
            <TaskFormCard
                register={register}
                control={control}
                errors={errors}
            />

            <h2 className={"text-[20px] font-normal mt-6 mb-3"}>
                {t("taskDetails.selectedSkills")}
            </h2>
            <SelectSkills ids={skillsIds}/>

            <div className="fixed z-[1000] bottom-0 left-0 right-0 w-full max-w-[398px] mx-auto bg-white border-t border-blue-50 px-[20px]">
                <div className="pointer-events-auto bg-white mt-5">
                    <Button
                        className={"py-4 border border-[#162A43] shadow-[1px_1px_0_0_#162A43,3px_3px_0_0_#162A43] text-[20px] mb-2"}
                        variant="primary"
                        fullWidth
                        type="submit"
                        disabled={isPending}
                    >
                        {t("taskDetails.buttonGoToTasks")}
                    </Button>

                    <Button
                        className={"py-4 text-[20px] border-none mb-[20px] active:bg-transparent focus:bg-transparent"}
                        variant="text"
                        fullWidth
                        type="button"
                        onClick={onBack}
                    >
                    {t("taskDetails.labelAnythingElse")}
                    </Button>
                </div>
            </div>
        </form>
    );
};
