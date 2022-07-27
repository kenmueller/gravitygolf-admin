import type { RequestHandler } from '@sveltejs/kit'

import verifyPassword from '$lib/password/verify'
import invalidPassword from '$lib/password/invalid'
import setCookie from '$lib/cookie/set'
import errorFromValue from '$lib/error/from/value'

export const POST: RequestHandler = async ({ request }) => {
	try {
		const password = await request.text()
		if (!(await verifyPassword(password))) throw invalidPassword

		return {
			headers: { 'set-cookie': setCookie('password', password) },
			body: ''
		}
	} catch (value) {
		const { code, message } = errorFromValue(value)
		return { status: code, body: message }
	}
}
