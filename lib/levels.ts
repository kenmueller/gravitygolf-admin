import { readable } from 'svelte/store'

import type Level from './level'

const levels = readable<Level[] | null>(null)

export default levels
