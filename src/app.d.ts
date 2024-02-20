// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module 'sse.js' {
	export type SSEOptions = EventSourceInit & {
		headers?: Record<string, string>,
		payload?: string,
		method?: string
	}

	export class SSE extends EventSource {
		constructor(url: string | URL, sseOptions?: SSEOptions)
		stream(): void
	}
}

export {};
