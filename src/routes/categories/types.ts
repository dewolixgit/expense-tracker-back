import { Context } from 'koa';
import { MessageResponse } from '../../types';

export type CategoryType = {
  id: number;
  name: string;
  color: string;
};

export type CreateCategoryRequestType = Pick<CategoryType, 'name' | 'color'>;

export type EditCategoryRequestType = Pick<CategoryType, 'id'> &
  Partial<Omit<CategoryType, 'id'>>;

export type DeleteCategoryRequestType = Pick<CategoryType, 'id'>;

export interface ICategoriesRequestContext extends Context {
  body:
    | MessageResponse
    | {
        categories: CategoryType[];
      };
}

export interface ICategoryRequestContext extends Context {
  body:
    | MessageResponse
    | {
        category: CategoryType;
      };
}
