import {
	// arrayRenderers,
	controlRenderers,
	layoutRenderers,
	complexRenderers,
	// labelRenderers
} from "./components/index.js"

export const vanillaRenderers = [
	...controlRenderers,
	...layoutRenderers,
	...complexRenderers,
	// ...arrayRenderers,
	// ...labelRenderers,
]
