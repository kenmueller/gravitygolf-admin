import type { RequestHandler } from '@sveltejs/kit'
import { getFirestore } from 'firebase-admin/firestore'

import type Locals from '$lib/locals'
import admin from '$lib/firebase/admin'
import levelFromSnapshot from '$lib/level/snapshot/from'
import verifyPassword from '$lib/password/verify'
import invalidPassword from '$lib/password/invalid'
import get from '$lib/snapshot/get'
import initialLevelData from '$lib/level/data/initial'
import replaceWithRounded from '$lib/replaceWithRounded'
import errorFromValue from '$lib/error/from/value'

const firestore = getFirestore(admin)

export const GET: RequestHandler = async () => {
	try {
		const { docs } = await firestore
			.collection('levels')
			.orderBy('index', 'asc')
			.get()

		return {
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(docs.map(levelFromSnapshot).filter(Boolean))
		}
	} catch (value) {
		const { code, message } = errorFromValue(value)
		return { status: code, body: message }
	}
}

export const POST: RequestHandler = async ({ locals }) => {
	try {
		if (!(await verifyPassword((locals as Locals).password)))
			throw invalidPassword

		const { docs } = await firestore
			.collection('levels')
			.orderBy('index', 'desc')
			.limit(1)
			.get()

		const { id } = await firestore.collection('levels').add({
			index: get<number, -1>(docs[0], 'index', 'number', -1) + 1,
			message: null,
			data: JSON.stringify(initialLevelData, replaceWithRounded(2))
		})

		return { body: id }
	} catch (value) {
		const { code, message } = errorFromValue(value)
		return { status: code, body: message }
	}
}
