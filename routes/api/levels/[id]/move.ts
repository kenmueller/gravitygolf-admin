import type { RequestHandler } from '@sveltejs/kit'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

import type Locals from '$lib/locals'
import admin from '$lib/firebase/admin'
import verifyPassword from '$lib/password/verify'
import invalidPassword from '$lib/password/invalid'
import HttpError from '$lib/error/http'
import ErrorCode from '$lib/error/code'
import errorFromValue from '$lib/error/from/value'

const firestore = getFirestore(admin)

export const POST: RequestHandler = async ({
	request,
	params: { id },
	locals
}) => {
	try {
		if (!(await verifyPassword((locals as Locals).password)))
			throw invalidPassword

		if (request.headers.get('content-type') !== 'application/json')
			throw new HttpError(ErrorCode.BadRequest, 'Must be JSON')

		const offset = (await request.json()) as -1 | 1

		if (!(offset === -1 || offset === 1))
			throw new HttpError(ErrorCode.BadRequest, 'Invalid offset')

		const snapshot = await firestore.doc(`levels/${id}`).get()

		if (!snapshot.exists)
			throw new HttpError(ErrorCode.NotFound, 'Level does not exist')

		const index = snapshot.get('index') as number

		switch (offset) {
			case -1: {
				const { docs } = await firestore
					.collection('levels')
					.where('index', '==', index - 1)
					.limit(1)
					.get()

				const snapshotBefore = docs[0]

				if (!snapshotBefore)
					throw new HttpError(ErrorCode.Internal, 'No level before')

				await Promise.all([
					snapshot.ref.update({ index: FieldValue.increment(-1) }),
					snapshotBefore.ref.update({ index: FieldValue.increment(1) })
				])

				break
			}
			case 1: {
				const { docs } = await firestore
					.collection('levels')
					.where('index', '==', index + 1)
					.limit(1)
					.get()

				const snapshotAfter = docs[0]

				if (!snapshotAfter)
					throw new HttpError(ErrorCode.Internal, 'No level after')

				await Promise.all([
					snapshot.ref.update({ index: FieldValue.increment(1) }),
					snapshotAfter.ref.update({ index: FieldValue.increment(-1) })
				])

				break
			}
		}

		return { body: '' }
	} catch (value) {
		const { code, message } = errorFromValue(value)
		return { status: code, body: message }
	}
}
