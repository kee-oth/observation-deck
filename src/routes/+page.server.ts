import type { Observation } from "@keeoth/observatory";
// import * as db from '$lib/server/database';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  // TODO: get observations from database
	return {
		observations: Promise.resolve<Observation<unknown, unknown, unknown>[]>([
      {
        event: {
          some: "Some event",
          arbitrary: 123,
          data: [1, 3, 4]
        },
        id: 3,
        timestamp: new Date(),
        level: "INFO"
      }
    ])
	};
}