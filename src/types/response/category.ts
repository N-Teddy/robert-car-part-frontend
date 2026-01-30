import type { Category, CategoryWithChildren, CategoryWithParent } from '../request/category';

export interface CategoryTreeNode extends CategoryWithChildren {
    productsCount?: number;
    parentId?: string;
    children: CategoryTreeNode[];
}

export interface SingleCategoryResponse {
    message: string;
    data: CategoryWithParent;
}

export interface CategoryListResponse {
    message: string;
    data: {
        items: Category[];
        meta: ResponseMeta;
    };
}

export interface CategoryTreeResponse {
    message: string;
    data: {
        items: CategoryTreeNode[];
        meta: ResponseMeta;
    };
}

export interface CategoryChildrenResponse {
    message: string;
    data: CategoryTreeNode[];
}

export interface ResponseMeta {
    total: number;
    page: string;
    limit: string;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export interface CategoryFilterDto {
    search?: string;
    parentId?: string;
    hasChildren?: boolean;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    page?: number;
    limit?: number;
}
