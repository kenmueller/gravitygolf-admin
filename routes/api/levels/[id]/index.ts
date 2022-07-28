import type { RequestHandler } from '@sveltejs/kit'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

import type Locals from '$lib/locals'
import admin from '$lib/firebase/admin'
import verifyPassword from '$lib/password/verify'
import invalidPassword from '$lib/password/invalid'
import exists from '$lib/snapshot/exists'
import get from '$lib/snapshot/get'
import HttpError from '$lib/error/http'
import ErrorCode from '$lib/error/code'
import errorFromValue from '$lib/error/from/value'

const firestore = getFirestore(admin)

export const DELETE: RequestHandler = async ({ params: { id }, locals }) => {
	try {
		if (!(await verifyPassword((locals as Locals).password)))
			throw invalidPassword

		const snapshot = await firestore.doc(`levels/${id}`).get()

		if (!exists(snapshot))
			throw new HttpError(ErrorCode.NotFound, 'Level does not exist')

		const index = get<number, null>(snapshot, 'index', 'number', null)
		if (index === null) throw new HttpError(ErrorCode.Internal, 'Missing index')

		const { docs: snapshotsAfter } = await firestore
			.collection('levels')
			.where('index', '>', index)
			.get()

		await Promise.all([
			snapshot.ref.delete(),
			...snapshotsAfter.map(({ ref }) =>
				ref.update({ index: FieldValue.increment(-1) })
			)
		])

		return { body: '' }
	} catch (value) {
		const { code, message } = errorFromValue(value)
		return { status: code, body: message }
	}
}
