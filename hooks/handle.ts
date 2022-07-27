import type { Handle } from '@sveltejs/kit'

import type Locals from '$lib/locals'
import getCookie from '$lib/cookie/get'

const handle: Handle = ({ event, resolve }) => {
	;(event.locals as Locals).password = getCookie(
		event.request.headers.get('cookie') ?? '',
		'password'
	)

	return resolve(event)
}

export default handle
