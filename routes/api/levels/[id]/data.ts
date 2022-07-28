import type { RequestHandler } from '@sveltejs/kit'
import { getFirestore } from 'firebase-admin/firestore'

import type Locals from '$lib/locals'
import admin from '$lib/firebase/admin'
import verifyPassword from '$lib/password/verify'
import invalidPassword from '$lib/password/invalid'
import HttpError from '$lib/error/http'
import ErrorCode from '$lib/error/code'
import errorFromValue from '$lib/error/from/value'
import type RawLevel from '$lib/level/raw'
import replaceWithRounded from '$lib/replaceWithRounded'

const firestore = getFirestore(admin)

export const GET: RequestHandler = async ({ url, params: { id }, locals }) => {
	try {
		if (!(await verifyPassword((locals as Locals).password)))
			throw invalidPassword

		const data = JSON.parse(
			url.searchParams.get('value') || 'null'
		) as RawLevel | null

		if (!data) throw new HttpError(ErrorCode.BadRequest, 'Invalid data')

		await firestore.doc(`levels/${id}`).update({
			data: JSON.stringify(data, replaceWithRounded(2))
		})

		return {
			status: ErrorCode.TemporaryRedirect,
			headers: { location: `/levels#${encodeURIComponent(id)}` }
		}
	} catch (value) {
		const { code, message } = errorFromValue(value)
		return { status: code, body: message }
	}
}
