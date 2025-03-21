<script lang="ts">
	import type {ControlElementRendererProps} from "../../types.js"
	import ControlWrapper from "./ControlWrapper.svelte"
	import {getContext, onDestroy, onMount, untrack} from "svelte"
	import type {CoreActions, JsonFormsSubStates, Dispatch} from "@jsonforms/core"
	import {createId, isControl, mapDispatchToControlProps, removeId, mapStateToControlProps} from "@jsonforms/core"
	import {JsonFormsSubStatesContextKey, JsonFormsDispatchContextKey} from "@keenmate/jsonforms-svelte"
	import {createEmptyStyles, defaultStyles} from "../../styles/index.js"
	import merge from "lodash/merge"
	import cloneDeep from "lodash/cloneDeep"

	let {
		    schema,
		    uischema,
		    path,
		    enabled,
		    renderers,
		    cells,
		    config,
		    ...restProps
	    }: ControlElementRendererProps = $props()

	const jsonFormsSubStates = getContext<JsonFormsSubStates>(JsonFormsSubStatesContextKey)
	const dispatch           = getContext<Dispatch<CoreActions>>(JsonFormsDispatchContextKey)
	const parentUserStyles = getContext("styles") || defaultStyles

	if (!jsonFormsSubStates || !dispatch) {
		throw new Error(
			"'jsonforms' or 'dispatch' couldn't be injected. Are you within JSON Forms?"
		)
	}

	const dispatchMethods = mapDispatchToControlProps?.(dispatch)
	let isFocused         = $state(false)
	let id                = $state(undefined)

	let control = $derived({
		...restProps,
		...mapStateToControlProps({jsonforms: jsonFormsSubStates}, restProps),
		id: id,
	})
	let input   = $derived({
		control: control,
		...dispatchMethods,
	})
	let styles = $derived.by(() => {
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

	let appliedOptions = $derived(merge(
		{},
		cloneDeep(control.config),
		cloneDeep(control.uischema.options)
	))
	let step = $derived(appliedOptions.step ?? 0.1)

	let controlWrapper = $derived({
		id:          control.id,
		description: control.description,
		errors:      control.errors,
		label:       control.label,
		visible:     control.visible,
		required:    control.required
	})

	$effect(() => {
		const uiSchema = untrack(() => control.uischema)

		if (schema && isControl(uiSchema)) {
			if (id) {
				removeId(id)
			}
			id = createId(uiSchema.scope)
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

	function onChange(event: Event) {
		input.handleChange(control.path, event.target.value === "" ? undefined : Number(event.target.value))
	}
</script>

<ControlWrapper
	{...controlWrapper}
	{styles}
	{isFocused}
	{appliedOptions}
>
	<input
		id="{control.id}-input"
		type="number"
		{step}
		class={styles.control.input}
		value={control.data}
		disabled={!control.enabled}
		autofocus={appliedOptions.focus}
		placeholder={appliedOptions.placeholder}
		onchange={onChange}
		onfocus={() => isFocused = true}
		onblur={() => isFocused = false}
	/>
</ControlWrapper>
