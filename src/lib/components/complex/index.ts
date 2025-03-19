import {isObjectControl, type JsonFormsRendererRegistryEntry, rankWith} from "@jsonforms/core"

import ObjectRenderer from "./ObjectRenderer.svelte"
// import {entry as oneOfRendererEntry} from "./OneOfRenderer.vue"
// import {entry as enumArrayRendererEntry} from "./EnumArrayRenderer.vue"

// export {default as OneOfRenderer} from "./OneOfRenderer.vue"
// export {default as EnumArrayRenderer} from "./EnumArrayRenderer.vue"

const objectRendererEntry: JsonFormsRendererRegistryEntry = {
	renderer: ObjectRenderer,
	tester:   rankWith(2, isObjectControl),
}

export const complexRenderers = [
	objectRendererEntry,
	// oneOfRendererEntry,
	// enumArrayRendererEntry,
]

export {
	ObjectRenderer
}
