import { Context } from 'koa';

export type MessageResponse = {
  message: string;
};

export interface IMessageRequestContext extends Context {
  body: MessageResponse;
}
