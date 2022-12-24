import { Context } from 'koa';
import { MessageResponse } from '../../types';

export type ExpenseType = {
  id: number;
  value: number;
  description: string;
  date: Date;
  categoryId: number;
};

// Zero utc dates string in iso 8601 (date like 2022-12-21T00:00:00.000Z)
export type GetExpensesQueryType = {
  startDate?: string;
  endDate?: string;
};

export type CreateExpenseRequestType = {
  description?: ExpenseType['description'];
  value: number;
  date: string;
  categoryId: ExpenseType['categoryId'];
};

export type DeleteExpenseRequestType = Pick<ExpenseType, 'id'>;

export interface IExpensesRequestContext extends Context {
  body:
    | MessageResponse
    | {
        expenses: ExpenseType[];
      };
}

export interface IExpenseRequestContext extends Context {
  body:
    | MessageResponse
    | {
        expense: ExpenseType;
      };
}
