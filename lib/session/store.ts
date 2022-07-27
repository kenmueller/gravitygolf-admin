import type { Writable } from 'svelte/store'

import { session as _session } from '$app/stores'

import type Session from '.'

const session = _session as Writable<Session>

export default session
