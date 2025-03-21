<script lang="ts">
	import {
		composePaths,
		type ControlElement,
		type CoreActions,
		createId,
		type Dispatch,
		findUISchema,
		getFirstPrimitiveProp,
		isControl,
		type JsonFormsSubStates,
		mapDispatchToMultiEnumProps,
		mapStateToMultiEnumControlProps,
		removeId, Resolve,
	} from "@jsonforms/core"
	import {getContext, onDestroy, onMount, untrack} from "svelte"
	import {JsonFormsDispatchContextKey, JsonFormsSubStatesContextKey} from "@keenmate/jsonforms-svelte"
	import type {ControlElementRendererProps} from "../../types.js"
	import merge from "lodash/merge.js"
	import cloneDeep from "lodash/cloneDeep.js"
	import {createEmptyStyles} from "$lib/styles/index.js"
	import {defaultStyles} from "$lib/styles/defaultStyles.js"

	let allProps: ControlElementRendererProps<ControlElement> = $props()

	const jsonforms        = getContext<JsonFormsSubStates>(JsonFormsSubStatesContextKey)
	const dispatch         = getContext<Dispatch<CoreActions>>(JsonFormsDispatchContextKey)
	const parentUserStyles = getContext("styles") || defaultStyles

	if (!jsonforms || !dispatch) {
		throw new Error(
			"'jsonforms' or 'dispatch' not in the context. Are you within JSON Forms?"
		)
	}

	const {addItem, removeItem} = mapDispatchToMultiEnumProps(dispatch)

	let isFocused              = $state(false)
	let id: string | undefined = $state(undefined)

	let control         = $derived({
		...allProps,
		...mapStateToMultiEnumControlProps({jsonforms}, allProps),
		id,
	})
	let appliedOptions  = $derived(
		merge(
			{},
			cloneDeep(control.config),
			cloneDeep(control.uischema.options)
		)
	)
	let styles          = $derived.by(() => {
		const element = control.uischema
		if (!element?.options?.styles) {
			return parentUserStyles
		}
		const resultStyles = createEmptyStyles()
		if (parentUserStyles) {
			merge(resultStyles, parentUserStyles)
		} else {
			merge(resultStyles, defaultStyles)
		}
		if (element?.options?.styles) {
			merge(resultStyles, element.options.styles)
		}
		return resultStyles
	})
	// const childUiSchema = $derived.by(() =>
	// 	findUISchema(
	// 		control.uischemas,
	// 		control.schema,
	// 		control.uischema.scope,
	// 		control.path,
	// 		undefined,
	// 		control.uischema,
	// 		control.rootSchema
	// 	)
	// )

	$effect(() => {
		void (allProps.schema)
		const controlUISchema = untrack(() => control.uischema)
		const id_             = untrack(() => id)
		if (isControl(controlUISchema)) {
			if (id_) {
				removeId(id_)
			}
			id = createId(controlUISchema.scope)
		}
	})

	onMount(() => {
		if (control.uischema.scope) {
			id = createId(control.uischema.scope)
		}
	})

	onDestroy(() => {
		if (id) {
			removeId(id)
			id = undefined
		}
	})

	function dataHasEnum(value: any): boolean {
		return !!control.data?.includes(value)
	}

	function toggle(value: any, checked: boolean) {
		if (checked) {
			addItem(control.path, value)
		} else {
			removeItem?.(control.path, value)
		}
	}

	// function childLabelForIndex(index: number) {
	// 	const childLabelProp =
	// 		      control.uischema.options?.childLabelProp ??
	// 		      getFirstPrimitiveProp(control.schema)
	// 	if (!childLabelProp) {
	// 		return index.toString()
	// 	}
	// 	const labelValue = Resolve.data(
	// 		control.data,
	// 		composePaths(index.toString(), childLabelProp)
	// 	)
	// 	if (
	// 		labelValue === undefined ||
	// 		labelValue === null ||
	// 		Number.isNaN(labelValue)
	// 	) {
	// 		return ""
	// 	}
	// 	return labelValue.toString()
	// }
</script>

{#each control.options || [] as checkElement, index}
	{@const inputId = `${control.id}-input-${index}`}
	<div>
		<input
			id={inputId}
			type="checkbox"
			class={styles.control.input}
			value={checkElement}
			checked={dataHasEnum(checkElement)}
			disabled={!control.enabled}
			placeholder={appliedOptions?.placeholder}
			onchange={ev => toggle(checkElement, ev.target.checked)}
		/>
		<label for={inputId}>
			{checkElement.label}
		</label>
	</div>
{/each}
