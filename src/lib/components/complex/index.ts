import {
	and,
	hasType,
	isObjectControl,
	type JsonFormsRendererRegistryEntry,
	type JsonSchema,
	rankWith,
	schemaMatches,
	schemaSubPathMatches,
	uiTypeIs
} from "@jsonforms/core"

import ObjectRenderer from "./ObjectRenderer.svelte"
import EnumArrayRenderer from "./EnumArrayRenderer.svelte"
// import OneOfRenderer from "./OneOfRenderer.svelte"

const objectRendererEntry: JsonFormsRendererRegistryEntry = {
	renderer: ObjectRenderer,
	tester:   rankWith(2, isObjectControl),
}


const hasOneOfItems = (schema: JsonSchema): boolean =>
	schema.oneOf !== undefined &&
	schema.oneOf.length > 0 &&
	(schema.oneOf as JsonSchema[]).every((entry: JsonSchema) => {
		return entry.const !== undefined
	})

const hasEnumItems                                           = (schema: JsonSchema): boolean =>
	schema.type === "string" && schema.enum !== undefined
const enumArrayRendererEntry: JsonFormsRendererRegistryEntry = {
	renderer: EnumArrayRenderer,
	tester:   rankWith(
		5,
		and(
			uiTypeIs("Control"),
			and(
				schemaMatches(
					(schema) =>
						hasType(schema, "array") &&
						!Array.isArray(schema.items) &&
						schema.uniqueItems === true
				),
				schemaSubPathMatches("items", (schema) => {
					return hasOneOfItems(schema) || hasEnumItems(schema)
				})
			)
		)
	),
}

export const complexRenderers = [
	objectRendererEntry,
	// oneOfRendererEntry,
	enumArrayRendererEntry,
]

export {
	ObjectRenderer,
	EnumArrayRenderer
}
