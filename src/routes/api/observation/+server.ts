import type { Observation } from '@keeoth/observatory';
import { json } from '@sveltejs/kit';
import { Tail } from 'tail';
import { appendFile, writeFile } from 'fs/promises';

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
	// if no Observations Log file, create one
	await writeFile('./observations-log.txt', '', {
		flag: 'a' // create the file if it does not exist
	});
	const file = await new Tail('./observations-log.txt');

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
							// enqueing with a delimiter because multiple
							// events can be sent in one read and we need
							// a way to separate them back out.
							controller.enqueue(`${newLine}:::`);
						}
					} catch (error) {
						cleanUp();
					}
				});
				file.on('error', (error: Error) => {
					console.log('File read error', error);
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
		console.log('GET /api/observation error', error);
		return new Response('Something went wrong', {
			status: 500
		});
	}
}
