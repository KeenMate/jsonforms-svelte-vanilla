import type {
	JsonFormsCellRendererRegistryEntry,
	JsonFormsRendererRegistryEntry,
	JsonSchema,
	UISchemaElement
} from "@jsonforms/core"
import type {Options} from "./util/index.js"
import type {Styles} from "./styles/index.js"

export type RendererProps<U = UISchemaElement> = {
	schema: JsonSchema
	uischema: U
	path: string
	enabled?: boolean
	renderers?: JsonFormsRendererRegistryEntry[]
	cells?: JsonFormsCellRendererRegistryEntry[]
	config?: object
}

export type ControlWrapperProps = {
	id: string | undefined,
	description?: string,
	errors?: string,
	label?: string,
	appliedOptions?: Options,
	visible?: Boolean,
	required?: Boolean,
	isFocused?: Boolean,
	styles: Styles,
	children: unknown
}

export type ControlElementRendererProps<U = UISchemaElement> = {
	schema: JsonSchema
	uischema: U
	path: string
	enabled?: boolean
	renderers?: JsonFormsRendererRegistryEntry[]
	cells?: JsonFormsCellRendererRegistryEntry[]
	config?: object
}
