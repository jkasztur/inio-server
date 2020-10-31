import { Context } from '../types'

export default () => {

	return async (ctx: Context, next) => {
		ctx.set('Access-Control-Allow-Origin', '*')
		ctx.set('Access-Control-Allow-Methods', 'POST, OPTIONS, GET, PATCH')
		ctx.set('Access-Control-Allow-Headers', '*')
		await next()
	}

}
