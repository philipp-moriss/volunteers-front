import {Button} from "@/shared/ui";
import {useState} from "react";
import {CategorySelector} from "@/features/select-categories/ui";
import {useTranslation} from "react-i18next";
import {TaskScroll} from "@/features/task-scroll/ui";

export const CategoriesPage = () => {
    const [activeTab, setActiveTab] = useState<'tasks' | 'help'>('help');
    const { t } = useTranslation();

    // const TASKS = [
    //     { id: 1, title: 'Transportation' },
    //     { id: 2, title: 'Private Lessons' },
    //     { id: 3, title: 'Electrician' },
    //     { id: 4, title: 'Plumbing' },
    //     { id: 5, title: 'Shopping' },
    // ];
    const MOSTPOPULAR = [
        { id: 1, title: 'Babysitting', place: 1 },
        { id: 2, title: 'Private lessons', place: 2 },
        { id: 3, title: 'Cleanings', place: 3 },
        { id: 4, title: 'Shopping', place: 4 },
        { id: 5, title: 'Support', place: 5 },
    ];
    return (
        <div className="w-full max-w-[393px] min-h-screen m-auto">
            {/*Хедер*/}
            <div className="fixed top-0 left-0 right-0 z-[50] max-w-[393px] mx-auto bg-gradient-to-b from-blue-50 to-white pt-16 pb-2 px-[20px]">
                <h1 className="text-[28px] text-[#004573] font-medium">
                    {t("categoriesNeedy.headerTitle")}
                </h1>
            </div>
            <div className="pt-[120px] pb-[150px]">

            {/*инпут с ИИ + текст*/}
<div className={"flex flex-col justify-center items-center px-[20px]"}>
            <div className="relative w-full max-w-[353px]">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 6.62646L15.2411 15.3854L24 18.6265L15.2411 21.8676L12 30.6265L8.75891 21.8676L0 18.6265L8.75891 15.3854L12 6.62646Z" fill="#DDF1FF"/>
                        <path d="M24 0L25.6205 4.37946L30 6L25.6205 7.62054L24 12L22.3795 7.62054L18 6L22.3795 4.37946L24 0Z" fill="#DDF1FF"/>
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder={t("categoriesNeedy.searchPlaceholder")}
                    className="
      w-full h-[48px] pl-12 pr-4 rounded-2xl ring-1 ring-gray-200 text-gray-600
      placeholder:text-[#C4C4C4] placeholder:font-normal placeholder:text-[18px]
      focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 shadow-sm text-base
    "/>
            </div>
    <span className={"max-w-[353px] text-[#5B5B5B] text-[16px] font-normal mt-4 leading-[22px]"}>
        {t("categoriesNeedy.aiPrompt")}
    </span>
</div>

            {/*Таски*/}
            <h2 className={"text-[20px] font-normal mt-6 px-[20px]"}>
                {t("categoriesNeedy.recentTasksTitle")}
            </h2>
                <TaskScroll />

            {/*Категории*/}
            <h2 className={"text-[20px] font-normal mt-6 px-[20px]"}>
                {t("categoriesNeedy.categoriesTitle")}
            </h2>
                <CategorySelector />

            {/*Выбор комьюнити*/}
            <h2 className={"text-[20px] font-normal mt-6 px-[20px]"}>
                {t("categoriesNeedy.mostRequestedTitle")}
            </h2>
            <div
                dir="rtl"
                className="flex gap-2.5 overflow-x-auto px-[20px] pb-4 mt-3">
                {MOSTPOPULAR.map((mostPopular) => (
                    <button
                        key={mostPopular.id}
                        className="flex flex-col items-center gap-3"
                    >
                        <div className="relative w-[110px] h-[110px] bg-white rounded-3xl border border-gray-300 flex items-center justify-center overflow-hidden">
                            <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300">
                                Img
                                 </div>
                            {/* <img src={mostPopular.image} alt={mostPopular.title} className="w-full h-full object-cover" /> */}
                            <span className="
        absolute top-2 right-3 z-10 text-[32px] font-black leading-none text-white font-sans"
                                style={{
                                    WebkitTextStroke: '6px #0C3B5E',
                                    paintOrder: 'stroke fill',
                                }}
                            >
    {mostPopular.place}
</span>
                        </div>
                        <span className="text-[#5B5B5B] text-[16px] font-normal text-center whitespace-nowrap">
              {mostPopular.title}
            </span>
                    </button>
                ))}
            </div>

                {/*Футер*/}
                <div className="fixed z-[1000] bottom-0 left-0 w-full bg-white border-t border-blue-50">
                <div className="px-5 pb-4 pt-2">
                    <Button className={"py-4 border border-[#162A43] shadow-[1px_1px_0_0_#162A43,3px_3px_0_0_#162A43]"} variant="primary" fullWidth>
                        {t("categoriesNeedy.nextButton")}
                    </Button>
                </div>
                <div className="flex items-center justify-between px-16 pb-4 pt-2 border-t-[1px] border-indigo-400/50">
                    <button className="flex flex-col items-center gap-1 group" onClick={() => setActiveTab('tasks')}>
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
                    <button className="flex flex-col items-center gap-1" onClick={() => setActiveTab('help')}>
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
            </div>
        </div>
    )
}
