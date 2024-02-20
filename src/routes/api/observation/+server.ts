import type { Observation } from '@keeoth/observatory';
import { json } from '@sveltejs/kit';
import * as tail from 'tail';
import { appendFile } from 'fs/promises';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
		const observations: Observation<unknown, unknown, unknown>[] = await request.json();
		const observationPromises = observations.map((observation) => () => {
			return appendFile('./observations-log.txt', JSON.stringify(observation) + '\n');
		});

		const result = await Promise.all(observationPromises);

		result.forEach(async (addObservation) => {
			await addObservation();
		});

		return json({
			message: 'Observation added successfully.'
		});
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';

		return json({
			message: 'Something went wrong.',
			error: errorMessage
		});
	}
}

const createFileStream = async () => {
	const aboutController = new AbortController();
	const file = await new tail.Tail('./observations-log.txt');

	const cleanUp = () => {
		aboutController.abort();
		file.unwatch();
	};

	return new ReadableStream({
		start: async (controller) => {
			try {
				file.on('line', (newLine: string) => {
					try {
						if (newLine) {
							controller.enqueue(newLine);
						}
					} catch (error) {
						cleanUp();
					}
				});
				file.on('error', (error: Error) => {
					console.log('error', error);
				});
			} catch (error) {
				cleanUp();
			}
		},
		cancel() {
			cleanUp();
		}
	});
};

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	try {
		const stream = await createFileStream();

		return new Response(stream, {
			headers: {
				'Content-Type': 'text/event-stream'
			}
		});
	} catch (error) {
		return new Response('Something went wrong', {
			status: 500
		});
	}
}
