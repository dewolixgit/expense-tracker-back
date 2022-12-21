import { Context } from 'koa';
import { MessageResponse } from '../../types';

export type AuthRequestType = {
  email: string;
  password: string;
};

export interface IRegistrationRequestContext extends Context {
  body: MessageResponse;
}

export interface IAuthenticationRequestContext extends Context {
  body:
    | MessageResponse
    | {
        token: string;
        userId: number;
      };
}
