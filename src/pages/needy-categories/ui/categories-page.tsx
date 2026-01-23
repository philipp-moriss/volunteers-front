import { useState } from "react";
import {useTranslation} from "react-i18next";
import {CategoriesView} from "@/pages/needy-categories/ui/categories-view.tsx";
import {CategorySkillsView} from "@/pages/needy-categories/ui/category-skills-view.tsx";
import {TaskDetails} from "@/pages/needy-categories/ui/task-details.tsx";

export const CategoriesPage = () => {
    const [step, setStep] = useState<'categories' | 'skills' | 'details' | `task`>('categories');
    const [activeTab, setActiveTab] = useState<'tasks' | 'help'>('help');
    const [selectedSkillsId, setSelectedSkillsId] = useState<string[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

    const { t } = useTranslation();
    const handleSkillsSubmit = (skills: string[]) => {
        setSelectedSkillsId(skills);
        setStep('details');
    };

    const headerContent = {
        categories: {
            title: t("categoriesNeedy.headerTitle"),
            subtitle: null
        },
        skills: {
            title:  t("categorySkillsView.headerTitle"),
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
                    {step === 'categories' && (
                        <CategoriesView
                            onNext={() => setStep('skills')}
                            selectedCategoryId={selectedCategoryId}
                            onCategorySelect={setSelectedCategoryId}
                        />
                    )}

                    {step === 'skills' && (
                        <CategorySkillsView onNext={handleSkillsSubmit} />
                    )}

                    {step === 'details' && (
                        <TaskDetails
                            skillsIds={selectedSkillsId}
                            onBack={() => setStep("skills")}
                            onNextTab={() => setActiveTab("tasks")}
                            onNext={()=> setStep("task")}
                            categoryId={selectedCategoryId}
                        />
                    )}
                </>
            ) :
                <>
                    {step === 'task' && (
                        <div className={"w-full h-full bg-red-600 pt-[150px]"}>
                            Тут будет второй флоу с тасками!
                        </div>
                    )}
                </>
            }
            {step !== "details" &&
                (
                    <div className="fixed z-[1000] bottom-0 left-0 right-0 w-full max-w-[398px] mx-auto bg-white border-t border-blue-50">
                        <div className="flex items-center justify-between px-16 pb-4 pt-2">
                            <button className="flex flex-col items-center gap-1 group" onClick={() => {
                                setActiveTab('tasks');
                                setStep('task');
                            }}>
                                <div className={activeTab === 'tasks' ? "text-[#004573]" : "text-white"}>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18.05 8.70041L17.2333 12.1837C16.5333 15.1921 15.15 16.4087 12.55 16.1587C12.1333 16.1254 11.6833 16.0504 11.2 15.9337L9.79999 15.6004C6.32499 14.7754 5.24999 13.0587 6.06665 9.57541L6.88332 6.08375C7.04999 5.37541 7.24999 4.75875 7.49999 4.25041C8.47499 2.23375 10.1333 1.69208 12.9167 2.35041L14.3083 2.67541C17.8 3.49208 18.8667 5.21708 18.05 8.70041Z" stroke={activeTab === 'tasks' ? "white" : "#5B5B5B"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M12.55 16.1583C12.0334 16.5083 11.3834 16.8 10.5917 17.0583L9.27504 17.4917C5.96671 18.5583 4.22504 17.6667 3.15004 14.3583L2.08337 11.0667C1.01671 7.75833 1.90004 6.00833 5.20837 4.94167L6.52504 4.50833C6.86671 4.4 7.19171 4.30833 7.50004 4.25C7.25004 4.75833 7.05004 5.375 6.88337 6.08333L6.06671 9.575C5.25004 13.0583 6.32504 14.775 9.80004 15.6L11.2 15.9333C11.6834 16.05 12.1334 16.125 12.55 16.1583Z" stroke={activeTab === 'tasks' ? "white" : "#5B5B5B"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M10.5334 7.1084L14.5751 8.1334" stroke={activeTab === 'tasks' ? "white" : "#5B5B5B"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M9.71655 10.333L12.1332 10.9497" stroke={activeTab === 'tasks' ? "white" : "#5B5B5B"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                                <span className={`text-[16px] font-normal ${
                                    activeTab === 'tasks'
                                        ? 'text-[#004573]'
                                        : 'text-[#5B5B5B] group-hover:text-gray-600'
                                }`}>
               {t("categoriesNeedy.tabMyTasks")}
          </span>
                            </button>

                            <button className="flex flex-col items-center gap-1" onClick={() => {
                                setActiveTab('help');
                                setStep('categories');
                            }}>
                                <div className={activeTab === 'help' ? "text-[#004573]" : "text-white"}>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14.1667 15.3588H10.8333L7.12498 17.8254C6.57498 18.1921 5.83332 17.8004 5.83332 17.1338V15.3588C3.33332 15.3588 1.66666 13.6921 1.66666 11.1921V6.19206C1.66666 3.69206 3.33332 2.02539 5.83332 2.02539H14.1667C16.6667 2.02539 18.3333 3.69206 18.3333 6.19206V11.1921C18.3333 13.6921 16.6667 15.3588 14.1667 15.3588Z" stroke={activeTab === 'help' ? "white" : "#5B5B5B"} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M10 9.4668V9.29183C10 8.72516 10.35 8.42515 10.7 8.18348C11.0417 7.95015 11.3833 7.65016 11.3833 7.10016C11.3833 6.33349 10.7667 5.7168 10 5.7168C9.23334 5.7168 8.6167 6.33349 8.6167 7.10016" stroke={activeTab === 'help' ? "white" : "#5B5B5B"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M9.99626 11.4587H10.0038" stroke={activeTab === 'help' ? "white" : "#5B5B5B"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                                <span className={`text-[16px] font-normal ${
                                    activeTab === 'help'
                                        ? 'text-[#004573]'
                                        : 'text-[#5B5B5B]'
                                }`}>
            {t("categoriesNeedy.tabRequestHelp")}
          </span>
                            </button>
                        </div>
                    </div>
                )}
        </div>
    )
}