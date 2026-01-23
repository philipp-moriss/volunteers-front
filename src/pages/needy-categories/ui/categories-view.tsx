import { TaskScroll } from "@/features/task-scroll/ui";
import {useTranslation} from "react-i18next";
import {CategorySelector} from "@/features/select-categories/ui";
import {PopularTaskScroll} from "@/features/popular-task-scroll/ui";
import {Button} from "@/shared/ui";

type CategoriesViewType = {
    onNext: () => void;
    selectedCategoryId: string;
    onCategorySelect: (id: string) => void;
}

export const CategoriesView = ({
onNext,
selectedCategoryId,
onCategorySelect
}: CategoriesViewType) => {
    const { t } = useTranslation();
    return (
        <div className="pt-[120px] pb-[150px]">
            {/* Инпут с ИИ + текст */}
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
            "
                    />
                </div>
                <span className={"max-w-[353px] text-[#5B5B5B] text-[16px] font-normal mt-4 leading-[22px]"}>
                    {t("categoriesNeedy.aiPrompt")}
                </span>
            </div>

            {/* Таски */}
            <h2 className={"text-[20px] font-normal mt-6 px-[20px]"}>
                {t("categoriesNeedy.recentTasksTitle")}
            </h2>
            <TaskScroll />

            {/* Категории */}
            <h2 className={"text-[20px] font-normal mt-6 px-[20px]"}>
                {t("categoriesNeedy.categoriesTitle")}
            </h2>
            <CategorySelector
                selectedId={selectedCategoryId}
                onSelect={onCategorySelect}
            />

            {/* Выбор комьюнити */}
            <h2 className={"text-[20px] font-normal mt-6 px-[20px]"}>
                {t("categoriesNeedy.mostRequestedTitle")}
            </h2>
            <PopularTaskScroll />

            <div className="fixed z-[1000] bottom-[72px] left-0 right-0 w-full py-4 max-w-[395px] mx-auto bg-white">
                    <Button
                        className={"py-4 border border-[#162A43] shadow-[1px_1px_0_0_#162A43,3px_3px_0_0_#162A43]"}
                        variant="primary"
                        fullWidth
                        onClick={onNext}
                        disabled={!selectedCategoryId}
                    >
                        {t("categoriesNeedy.nextButton")}
                    </Button>
            </div>
        </div>
    );
};