import type { DocumentSnapshot } from 'firebase-admin/firestore'

import type Level from '..'
import type RawLevel from '../raw'

const levelFromSnapshot = (snapshot: DocumentSnapshot) => {
	if (!snapshot.exists) return null

	return {
		id: snapshot.id,
		message: snapshot.get('message') as string | null,
		data: JSON.parse(snapshot.get('data') as string) as RawLevel
	} as Level
}

export default levelFromSnapshot
