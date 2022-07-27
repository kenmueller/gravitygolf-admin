import type { RequestHandler } from '@sveltejs/kit'
import { getFirestore } from 'firebase-admin/firestore'

import type Locals from '$lib/locals'
import admin from '$lib/firebase/admin'
import verifyPassword from '$lib/password/verify'
import invalidPassword from '$lib/password/invalid'
import errorFromValue from '$lib/error/from/value'

const firestore = getFirestore(admin)

export const DELETE: RequestHandler = async ({ params: { id }, locals }) => {
	try {
		if (!(await verifyPassword((locals as Locals).password)))
			throw invalidPassword

		await firestore.doc(`levels/${id}`).delete()

		return { body: '' }
	} catch (value) {
		const { code, message } = errorFromValue(value)
		return { status: code, body: message }
	}
}
