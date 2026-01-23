export type Skill = {
    id: string;
    name: string;
    iconSvg: string;
    categoryId:string;
    createdAt: string;
    updatedAt: string;
}

export type Category = {
    id: string;
    name: string;
    iconSvg: string;
    createdAt: string;
    updatedAt: string;
    skills: Skill[];
}