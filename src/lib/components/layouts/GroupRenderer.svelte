<script lang="ts">
	import type {ControlElementRendererProps} from "../../types.js"
	import {getContext, onDestroy, onMount, untrack} from "svelte"
	import {
		type CoreActions,
		createId,
		type Dispatch,
		isControl,
		type JsonFormsSubStates,
		mapDispatchToControlProps,
		mapStateToLayoutProps,
		removeId
	} from "@jsonforms/core"
	import {DispatchRenderer, JsonFormsDispatchContextKey, JsonFormsSubStatesContextKey} from "@keenmate/jsonforms-svelte"
	import {createEmptyStyles, defaultStyles} from "../../styles/index.js"
	import merge from "lodash/merge"

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
	const parentUserStyles   = getContext("styles") || defaultStyles

	if (!jsonFormsSubStates || !dispatch) {
		throw new Error(
			"'jsonforms' or 'dispatch' couldn't be injected. Are you within JSON Forms?"
		)
	}

	const dispatchMethods = mapDispatchToControlProps?.(dispatch)
	let isFocused         = $state(false)
	let id                = $state(undefined)

	let layout            = $derived({
		...restProps,
		...mapStateToLayoutProps({jsonforms: jsonFormsSubStates}, restProps),
		id: id,
	})
	const styles          = $derived.by(() => {
		const element = layout.uischema
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
	let layoutClassObject = $derived(layout.direction === "row"
		? styles.horizontalLayout
		: styles.verticalLayout
	)

	// const appliedOptions = $derived(() =>
	// 	merge(
	// 		{},
	// 		cloneDeep(layout.config),
	// 		cloneDeep(layout.uischema.options)
	// 	)
	// )

	$effect(() => {
		const uiSchema = untrack(() => layout.uischema)

		if (schema && isControl(uiSchema)) {
			if (id) {
				removeId(id)
			}
			id = createId(uiSchema.scope)
		}
	})

	onMount(() => {
		if (layout.uischema.scope) {
			id = createId(layout.uischema.scope)
		}
	})

	onDestroy(() => {
		if (id) {
			removeId(id)
			id = undefined
		}
	})
</script>

{#if layout.visible}
	<fieldset class={styles.group.root}>
		{#if layout.label}
			<legend class={styles.group.label}>
				{layout.label}
			</legend>
		{/if}
		{#each layout.uischema.elements || [] as element (element.id)}
			<div class={styles.group.item}>
				<DispatchRenderer
					schema={layout.schema}
					uischema={element}
					path={layout.path}
					enabled={layout.enabled}
					renderers={layout.renderers}
					cells={layout.cells}
				/>
			</div>
		{/each}
	</fieldset>
{/if}
