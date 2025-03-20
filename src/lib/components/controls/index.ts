import {
	and,
	isEnumControl,
	isIntegerControl,
	isTimeControl,
	isMultiLineControl,
	isStringControl,
	type JsonFormsRendererRegistryEntry,
	rankWith,
	isNumberControl,
	isDateTimeControl, isBooleanControl, isDateControl, isOneOfEnumControl
} from "@jsonforms/core"
export {default as ControlWrapper} from "./ControlWrapper.svelte"
import StringControlRenderer from "./StringControlRenderer.svelte"
import MultiStringControlRenderer from "./MultiStringControlRenderer.svelte"
import NumberControlRenderer from "./NumberControlRenderer.svelte"
import IntegerControlRenderer from "./IntegerControlRenderer.svelte"
import EnumControlRenderer from "./EnumControlRenderer.svelte"
import EnumOneOfControlRenderer from "./EnumOneOfControlRenderer.svelte"
import DateControlRenderer from "./DateControlRenderer.svelte"
import DateTimeControlRenderer from "./DateTimeControlRenderer.svelte"
import TimeControlRenderer from "./TimeControlRenderer.svelte"
import BooleanControlRenderer from "./BooleanControlRenderer.svelte"


const stringControlRendererEntry: JsonFormsRendererRegistryEntry = {
	renderer: StringControlRenderer,
	tester:   rankWith(1, isStringControl),
}

const numberControlRendererEntry: JsonFormsRendererRegistryEntry = {
	renderer: NumberControlRenderer,
	tester:   rankWith(1, isNumberControl),
}

const multiStringControlRendererEntry: JsonFormsRendererRegistryEntry = {
	renderer: MultiStringControlRenderer,
	tester: rankWith(2, and(isStringControl, isMultiLineControl)),
};

const integerControlRendererEntry: JsonFormsRendererRegistryEntry = {
	renderer: IntegerControlRenderer,
	tester: rankWith(1, isIntegerControl),
};

const timeControlRendererEntry: JsonFormsRendererRegistryEntry = {
	renderer: TimeControlRenderer,
	tester:   rankWith(2, isTimeControl),
};

const enumControlRendererEntry: JsonFormsRendererRegistryEntry = {
	renderer: EnumControlRenderer,
	tester: rankWith(2, isEnumControl),
};

const oneOfEnumControlRendererEntry: JsonFormsRendererRegistryEntry = {
	renderer: EnumOneOfControlRenderer,
	tester: rankWith(2, isOneOfEnumControl),
};

const dateControlRendererEntry: JsonFormsRendererRegistryEntry = {
	renderer: DateControlRenderer,
	tester: rankWith(2, isDateControl),
};

const dateTimeControlRendererEntry: JsonFormsRendererRegistryEntry = {
	renderer: DateTimeControlRenderer,
	tester: rankWith(2, isDateTimeControl),
};

const booleanControlRendererEntry: JsonFormsRendererRegistryEntry = {
	renderer: BooleanControlRenderer,
	tester: rankWith(1, isBooleanControl),
};

export const controlRenderers = [
	stringControlRendererEntry,
	multiStringControlRendererEntry,
	numberControlRendererEntry,
	integerControlRendererEntry,
	enumControlRendererEntry,
	oneOfEnumControlRendererEntry,
	dateControlRendererEntry,
	dateTimeControlRendererEntry,
	timeControlRendererEntry,
	booleanControlRendererEntry,
]

export {
	StringControlRenderer,
	MultiStringControlRenderer,
	NumberControlRenderer,
	IntegerControlRenderer,
	EnumControlRenderer,
	EnumOneOfControlRenderer,
	DateControlRenderer,
	DateTimeControlRenderer,
	TimeControlRenderer,
	BooleanControlRenderer
}
