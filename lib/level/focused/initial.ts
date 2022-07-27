import { derived } from 'svelte/store'

import { page } from '$app/stores'

const initialFocusedLevel = derived(
	page,
	$page => $page.url.hash.replace('#', '') || null
)

export default initialFocusedLevel
