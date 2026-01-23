import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CategoriesView } from "@/pages/needy-categories/ui/categories-view.tsx";
import { CategorySkillsView } from "@/pages/needy-categories/ui/category-skills-view.tsx";
import { TaskDetails } from "@/pages/needy-categories/ui/task-details.tsx";
import { Step } from "../model";
import { Tabs } from "../components/tab";

export const CategoriesPage = () => {
    const [step, setStep] = useState<Step>(Step.Categories);
    const [activeTab, setActiveTab] = useState<'tasks' | 'help'>('help');
    const [selectedSkillsId, setSelectedSkillsId] = useState<string[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

    const { t } = useTranslation();
    const handleSkillsSubmit = (skills: string[]) => {
        setSelectedSkillsId(skills);
        setStep(Step.Details);
    };

    const headerContent = {
        categories: {
            title: t("categoriesNeedy.headerTitle"),
            subtitle: null
        },
        skills: {
            title: t("categorySkillsView.headerTitle"),
            subtitle: t("categorySkillsView.headerSubtitle")
        },
        details: {
            title: t("taskDetails.headerTitle"),
            subtitle: t("taskDetails.headerSubtitle")
        },
        task: {
            title: "My tasks",
            subtitle: "Waiting for volunteers"
        }
    };
    const currentHeader = headerContent[step];

    return (
        <div className="w-full max-w-[393px] min-h-screen m-auto relative bg-white">
            <div className="fixed top-0 left-0 right-0 z-[50] w-[398px] mx-auto bg-gradient-to-b from-blue-50 to-white pt-16 pb-2 px-[20px]">
                <h1 className="text-[28px] text-[#004573] font-medium">
                    {currentHeader.title}
                </h1>
                <p className="mt-2 text-gray-500 text-[18px] font-normal">
                    {currentHeader.subtitle}
                </p>
            </div>
            {activeTab === 'help' ? (
                <>
                    {step === Step.Categories && (
                        <CategoriesView
                            onNext={() => setStep(Step.Skills)}
                            selectedCategoryId={selectedCategoryId}
                            onCategorySelect={setSelectedCategoryId}
                        />
                    )}

                    {step === Step.Skills && (
                        <CategorySkillsView onNext={handleSkillsSubmit} />
                    )}

                    {step === Step.Details && (
                        <TaskDetails
                            skillsIds={selectedSkillsId}
                            onBack={() => setStep(Step.Skills)}
                            onNextTab={() => setActiveTab("tasks")}
                            onNext={() => setStep(Step.Task)}
                            categoryId={selectedCategoryId}
                        />
                    )}
                </>
            ) :
                <>
                    {step === Step.Task && (
                        <div className={"w-full h-full bg-red-600 pt-[150px]"}>
                            Тут будет второй флоу с тасками!
                        </div>
                    )}
                </>
            }
            <Tabs step={step} activeTab={activeTab} setActiveTab={setActiveTab} setStep={setStep} />
        </div>
    )
}