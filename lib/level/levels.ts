import { readable } from 'svelte/store'
import {
	getFirestore,
	collection,
	query,
	orderBy,
	onSnapshot
} from 'firebase/firestore'

import { browser } from '$app/env'

import type Level from '.'
import app from '../firebase'
import levelFromSnapshot from './snapshot/from'

const firestore = getFirestore(app)

const levels = readable<Level[] | null>(null, set => {
	if (!browser) return set(null)

	return onSnapshot(
		query(collection(firestore, 'levels'), orderBy('index', 'asc')),
		({ docs }) => {
			set(docs.map(levelFromSnapshot).filter(Boolean) as Level[])
		},
		console.error
	)
})

export default levels
