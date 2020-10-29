import { ParameterizedContext } from "koa";
import { IRouterParamContext } from "koa-router";

export interface BaseContext {
	send(data?: any, statusCode?: number): void
}

interface KoaContext<BaseState> extends ParameterizedContext<BaseState, BaseContext & IRouterParamContext<BaseState, BaseContext>> {
}


export type Context = KoaContext<{}>
