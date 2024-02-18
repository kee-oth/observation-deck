<script lang="ts">
  import type { Observation } from "@keeoth/observatory";
	import { onMount } from "svelte";

  /** @type {import('./$types').PageData} */
  const { data } = $props()

  let observations = $state<Observation<unknown, unknown, unknown>[]>([])

  $effect(() => {
    data.observations.then((value) => {
      observations = value
    }).catch((error) => {
      console.log('err!', error)
    })
  })
  

</script>


<h1>Welcome to Observation Deck 🔭</h1>
<p>Observation Deck is a platform for viewing log activity locally.</p>
<p>This is still very much a work-in-progress and there's nothing to see here yet. Please check back later to see our progress!</p>
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
      <td>{JSON.stringify(observation.event)}</td> <!-- if object, enumeration -->
      <td>{observation.id}</td>
    </tr>
  </tbody>
  {/each}
</table>
