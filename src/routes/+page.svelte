<script lang="ts">
	import type { Observation } from '@keeoth/observatory';
	import { onMount } from 'svelte';

	let observations = $state<Observation<string, unknown, unknown>[]>([]);

	onMount(() => {
		async function startObservationsStream() {
			try {
				const response = await fetch('/api/observation');
				const reader = response?.body?.pipeThrough(new TextDecoderStream()).getReader();

				if (reader) {
					while (true) {
						const { value, done } = await reader.read();
						if (done) {
							break;
						}

						// `value` may represent more than one observation
						//  so we need to split on the delimiter
						const preparedObservations = value
							.split(':::')
							.filter((item) => item) // get rid of empty strings
							.map((observationAsString: string) => {
								const parsedObservation = JSON.parse(observationAsString) as Observation<
									unknown,
									unknown,
									unknown
								>;
								return {
									...parsedObservation,
									event:
										typeof parsedObservation.event === 'string'
											? parsedObservation.event
											: JSON.stringify(parsedObservation.event, null, 2)
								};
							});

						observations = [...preparedObservations, ...observations];
					}
				}
			} catch (error) {
				console.error(error);
			}
		}

		startObservationsStream();
	});
</script>

<h1>Welcome to Observation Deck 🔭</h1>
<p>Observation Deck is a platform for viewing log activity locally.</p>
<p>
	This is still very much a work-in-progress and there's nothing much to see here yet. Please check
	back later to see our progress!
</p>
<p>Thank you for stopping by!</p>

<h2>Observations</h2>
<table>
	<thead>
		<tr>
			<th>Level</th>
			<th>Timestamp</th>
			<th>Event</th>
			<th>ID</th>
		</tr>
	</thead>
	{#each observations as observation}
		<tbody>
			<tr>
				<td>{observation.level}</td>
				<td>{observation.timestamp}</td>
				<td><pre>{observation.event}</pre></td>
				<td>{observation.id}</td>
			</tr>
		</tbody>
	{/each}
</table>
