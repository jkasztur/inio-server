import Joi, { ValidationOptions } from '@hapi/joi'

export default (data: IValidationData, options: ValidationOptions = {}) => {
	if (!options.hasOwnProperty('stripUnknown')) {
		options.stripUnknown = true
	}
	if (!options.hasOwnProperty('abortEarly')) {
		options.abortEarly = false
	}

	const schemas = {
		headers: data.headers ? (Joi.isSchema(data.headers) ? data.headers : Joi.object(data.headers)) : null, // eslint-disable-line no-nested-ternary
		body: data.body ? (Joi.isSchema(data.body) ? data.body : Joi.object(data.body)) : null, // eslint-disable-line no-nested-ternary
		query: data.query ? (Joi.isSchema(data.query) ? data.query : Joi.object(data.query)) : null, // eslint-disable-line no-nested-ternary
		params: data.params ? (Joi.isSchema(data.params) ? data.params : Joi.object(data.params)) : null, // eslint-disable-line no-nested-ternary
	}

	return async function validateContext(ctx: any, next) {
		try {
			if (schemas.headers) {
				Object.assign(ctx.request.headers, await schemas.headers.validateAsync(ctx.request.headers, options))
			}
			if (schemas.body) {
				ctx.request.body = await schemas.body.validateAsync(ctx.request.body, options)
			}
			if (schemas.query) {
				const query = await schemas.query.validateAsync(ctx.request.query, options)
				Object.defineProperty(ctx.request, 'query', {
					get() {
						return query
					},
				})
			}
			if (schemas.params) {
				ctx.params = await schemas.params.validateAsync(ctx.params, options)
			}
		} catch (e) {
			ctx.throw(400, e)
		}
		await next()
	}

}

export interface IValidationData {
	headers?: any
	body?: any
	query?: any
	params?: any
}
