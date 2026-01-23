import { CategoryCard } from "@/entities/category/ui/CategoryCard";
import { useQuery } from "@tanstack/react-query";
import { categoryApi } from "@/entities/category/api";

type CategorySelectorType = {
    selectedId: string
    onSelect: (id: string) => void;
}

export const CategorySelector = ({ selectedId, onSelect }: CategorySelectorType) => {
    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: () => categoryApi.getCategories(),
    });

    if (!categories) return null;

    return (
        <div className="grid grid-cols-2 gap-3 px-5 mt-3">
            {categories.map((cat) => (
                <CategoryCard
                    key={cat.id}
                    category={cat}
                    isSelected={selectedId === cat.id}
                    onClick={() => onSelect(cat.id)}
                />
            ))}
        </div>
    );
};
