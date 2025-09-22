export interface CategoryImage {
    id: string;
    url: string;
    publicId: string;
    format: string;
}

export interface Category {
    id: string;
    name: string;
    description?: string;
    image: CategoryImage | null;
    createdAt: string;
    updatedAt: string;
}

export interface CategoryWithParent extends Category {
    parentId?: string;
}

export interface CategoryWithChildren extends Category {
    children: CategoryWithChildren[];
}

export interface CreateCategoryRequest {
    image?: File | Blob | any;
    name: string;
    description?: string;
    parentId?: string;
}

export type UpdateCategoryRequest = Partial<CreateCategoryRequest>;
