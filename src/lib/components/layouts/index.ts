import {
	and,
	isLayout,
	type JsonFormsRendererRegistryEntry,
	rankWith,
	uiTypeIs
} from "@jsonforms/core"

import LayoutRenderer from "./LayoutRenderer.svelte"
// import CategorizationStepperRenderer from "./CategorizationStepperRenderer.svelte"
// import CategorizationRenderer from "./CategorizationRenderer.svelte"
import GroupRenderer from "./GroupRenderer.svelte"

const layoutRendererEntry: JsonFormsRendererRegistryEntry        = {
	renderer: LayoutRenderer,
	tester: rankWith(1, isLayout),
}

const groupRendererEntry: JsonFormsRendererRegistryEntry         = {
	renderer: GroupRenderer,
	tester:   rankWith(2, and(isLayout, uiTypeIs('Group'))),
}
// const categorizationEntry: JsonFormsRendererRegistryEntry        = {
// 	renderer: CategorizationRenderer,
// 	tester:   rankWith(2, and(isCategorization, categorizationHasCategory)),
// }
// const categorizationStepperEntry: JsonFormsRendererRegistryEntry = {
// 	renderer: CategorizationStepperRenderer,
// 	tester:   rankWith(
// 		3,
// 		and(
// 			isCategorization,
// 			categorizationHasCategory,
// 			optionIs("variant", "stepper")
// 		)
// 	),
// }

export const layoutRenderers = [
	layoutRendererEntry,
	groupRendererEntry,
	// categorizationEntry,
	// categorizationStepperEntry,
]

export {
	LayoutRenderer,
	// CategorizationStepperRenderer,
	// CategorizationRenderer,
	GroupRenderer
}
