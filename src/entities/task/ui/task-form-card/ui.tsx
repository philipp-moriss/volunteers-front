import { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Controller } from "react-hook-form";
import {Input, Switch, Textarea} from "@/shared/ui";
import {CreateTaskDto} from "@/entities/task";


type TaskFormCardType = {
    register: UseFormRegister<CreateTaskDto>;
    control: Control<CreateTaskDto>;
    errors: FieldErrors<CreateTaskDto>;
}

export const TaskFormCard = ({ register, control, errors }: TaskFormCardType) => {
    const { t } = useTranslation();

    return (
        <div className="w-full h-[340px] flex flex-col justify-end rounded-2xl mb-5 border border-[#162A43] shadow-[1px_1px_0_0_#162A43,2px_2px_0_0_#162A43] p-4 gap-4">
            <div>
                <Input
                    label="Title"
                    {...register("title", { required: true })}
                    error={errors.title ? "true" : undefined}
                />
            </div>

            <div className="flex justify-between items-center w-full">
                <span className="text-[16px] font-normal text-[#5B5B5B] mt-8">
                    {t("taskDetails.checkboxMarkUrgent")}
                </span>
                <div className="flex flex-col items-center gap-1">
                    <Controller
                        name="firstResponseMode"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <>
                                <div className={`text-[16px] font-normal text-[#393939] bg-[#FFFCF2] transition-opacity duration-200 ${value ? 'opacity-100' : 'opacity-0'}`}>
                                    {t("taskDetails.tagUrgent")}
                                </div>
                                <Switch checked={!!value} onChange={onChange} />
                            </>
                        )}
                    />
                </div>
            </div>

            <div className="flex justify-between items-center w-full">
                <span className={"text-[16px] font-normal text-[#5B5B5B]"}>
                    {t("taskDetails.labelAddTime")}
                </span>
                <div className={"flex gap-2 "}>
                    {[t("taskDetails.labelDate"), t("taskDetails.labelTime")].map(item => (
                        <button
                            key={item}
                            type="button"
                            className={"py-2 px-4 bg-[#EBF7FF] rounded-3xl text-[#373737] text-[16px] font-normal"}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <Textarea
                    label="Description"
                    {...register("description", { required: true })}
                    error={errors.title ? "true" : undefined}
                />
            </div>
        </div>
    );
};
