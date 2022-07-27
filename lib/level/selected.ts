import { writable } from 'svelte/store'

const selectedLevel = writable<string | null>(null)

export default selectedLevel
