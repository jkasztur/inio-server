import { Context } from '../types'

export default () => {

	return async (ctx: Context, next) => {
		ctx.set('Access-Control-Allow-Origin', '*')
		//ctx.set('Access-Control-Allow-Credentials', 'true')
		//ctx.set('Access-Control-Allow-Methods', 'POST, OPTIONS, GET, PATCH')
		//ctx.set('Access-Control-Max-Age', '1728000')
		//ctx.set('Access-Control-Allow-Headers', 'X-Request, X-Requested-With, Content-Type, Cookie, Authorization')
		await next()
	}

}
