import {CreateTaskForm} from "@/features/create-task-form/ui";

type TaskDetailsType = {
    skillsIds: string[];
    onBack: () => void;
    onNextTab: () => void;
    onNext: () => void;
    categoryId: string;
}

export const TaskDetails = ({ skillsIds, onBack, onNextTab, onNext, categoryId }: TaskDetailsType) => {

    const handleSuccess = () => {
        onNextTab();
        onNext();
    };

    return (
        <CreateTaskForm
            skillsIds={skillsIds}
            categoryId={categoryId}
            onBack={onBack}
            onSuccess={handleSuccess}
        />
    )
}
