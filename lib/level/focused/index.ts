import { derived } from 'svelte/store'
import initialFocused from './initial'
import selected from '../selected'

const focusedLevel = derived(
	[initialFocused, selected],
	([$initialFocused, $selected]) => $selected ?? $initialFocused
)

export default focusedLevel
