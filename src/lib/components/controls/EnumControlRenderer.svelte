<script lang="ts">
	import ControlWrapper from "./ControlWrapper.svelte"
	import type {ControlElementRendererProps} from "../../types.js"
	import {getContext, onDestroy, onMount, untrack} from "svelte"
	import {type JsonFormsSubStates, type Dispatch, type CoreActions, mapStateToEnumControlProps} from "@jsonforms/core"
	import {createId, isControl, mapDispatchToControlProps, removeId, mapStateToOneOfEnumControlProps} from "@jsonforms/core"
	import {JsonFormsSubStatesContextKey, JsonFormsDispatchContextKey} from "@keenmate/jsonforms-svelte"
	import {createEmptyStyles, defaultStyles} from "../../styles/index.js"
	import merge from "lodash/merge"
	import cloneDeep from "lodash/cloneDeep"

	let allProps: ControlElementRendererProps = $props()
	let {
		    schema,
		    uischema,
		    path,
		    enabled,
		    renderers,
		    cells,
		    config
	    } = allProps

	const jsonFormsSubStates = getContext<JsonFormsSubStates>(JsonFormsSubStatesContextKey)
	const dispatch           = getContext<Dispatch<CoreActions>>(JsonFormsDispatchContextKey)
	const parentUserStyles = getContext("styles") || defaultStyles

	if (!jsonFormsSubStates || !dispatch) {
		throw new Error(
			"'jsonforms' or 'dispatch' couldn't be injected. Are you within JSON Forms?"
		)
	}

	const dispatchMethods = mapDispatchToControlProps?.(dispatch)
	let isFocused = $state(false)
	let id = $state(undefined)

	$effect(() => {
		console.log("Enum control data", {
			allProps,
			mapStateToEnumControlProps: mapStateToEnumControlProps({ jsonforms: jsonFormsSubStates }, allProps)
		})
	})
	let control = $derived({
		...allProps,
		...mapStateToEnumControlProps({ jsonforms: jsonFormsSubStates }, allProps),
		id: id,
	})
	let input = $derived({
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

	let controlWrapper = $derived({
		id: control.id,
		description: control.description,
		errors: control.errors,
		label: control.label,
		visible: control.visible,
		required: control.required
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
		input.handleChange(control.path, event.target.selectedIndex === 0 ? undefined : event.target.value)
	}
</script>

<ControlWrapper
	{...controlWrapper}
	{styles}
	{isFocused}
	{appliedOptions}
>
	<select
		id={control.id + "-input"}
		class={styles.control.select}
		value={control.data}
		disabled={!control.enabled}
		autofocus={appliedOptions.focus}
		onchange={onChange}
		onfocus={() => isFocused = true}
		onblur={() => isFocused = false}
	>
		<option value="" class={styles.control.option}></option>

		{#each control.options as item (item.value)}
			<option
				value={item.value}
				label={item.label}
				class={styles.control.option}
			/>
		{/each}
	</select>
</ControlWrapper>
