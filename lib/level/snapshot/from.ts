import type Snapshot from '$lib/snapshot'
import type Level from '..'
import type RawLevel from '../raw'
import exists from '$lib/snapshot/exists'
import get from '$lib/snapshot/get'

const levelFromSnapshot = (snapshot: Snapshot) => {
	if (!exists(snapshot)) return null

	const data = get<string, null>(snapshot, 'data', 'string', null)
	if (!data) return null

	return {
		id: snapshot.id,
		message: get(snapshot, 'message', 'string', null),
		data: JSON.parse(data) as RawLevel
	} as Level
}

export default levelFromSnapshot
