import type { Observation } from '@keeoth/observatory';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
		// const { observation }: { observation: Observation<unknown, unknown, unknown> } = await request.json();
		// TODO: add observation to database

		return json({
			message: "Observation added successfully.",
		})
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : "Unknown error"

		return json({
			message: "Something went wrong.",
			error: errorMessage,
		})
	}
}
