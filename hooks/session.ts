import type { GetSession } from '@sveltejs/kit'

import type Session from '$lib/session'
import type Locals from '$lib/locals'

const getSession: GetSession = ({ locals }): Session => ({
	password: Boolean((locals as Locals).password)
})

export default getSession
