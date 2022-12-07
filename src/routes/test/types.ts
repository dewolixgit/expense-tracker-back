import { Context } from 'koa';

export type HelloRequestType = {
  message: string;
};

export type HelloResponseType = {
  message: string;
};

export interface IHelloRequestContext extends Context {
  body: HelloResponseType;
}
