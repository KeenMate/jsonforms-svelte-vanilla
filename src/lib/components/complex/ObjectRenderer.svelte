<script lang="ts">

	import {findUISchema, Generate, type GroupLayout} from "@jsonforms/core"
	import isEmpty from "lodash/isEmpty.js"
	import {
		type CoreActions,
		createId,
		type Dispatch,
		isControl,
		type JsonFormsSubStates, mapDispatchToControlProps,
		mapStateToLayoutProps,
		removeId
	} from "@jsonforms/core"
	import type {ControlElementRendererProps} from "../../types.js"
	import {getContext, onDestroy, onMount, untrack} from "svelte"
	import {DispatchContextKey, DispatchRenderer, JsonFormsSubStatesContextKey} from "@keenmate/jsonforms-svelte"
	import {createEmptyStyles, defaultStyles} from "../../styles/index.js"
	import merge from "lodash/merge"
	import {mapStateToControlWithDetailProps} from "@jsonforms/core"

	let allProps: ControlElementRendererProps = $props()
	let {
		    schema,
		    uischema,
		    path,
		    enabled,
		    renderers,
		    cells,
		    config,
		    ...restProps
	    } = allProps

	const jsonFormsSubStates = getContext<JsonFormsSubStates>(JsonFormsSubStatesContextKey)
	const dispatch           = getContext<Dispatch<CoreActions>>(DispatchContextKey)
	const parentUserStyles   = getContext("styles") || defaultStyles

	if (!jsonFormsSubStates || !dispatch) {
		throw new Error(
			"'jsonforms' or 'dispatch' couldn't be injected. Are you within JSON Forms?"
		)
	}

	const dispatchMethods = mapDispatchToControlProps(allProps)
	let id                = $state(undefined)

	let control  = $derived({
		...restProps,
		...mapStateToControlWithDetailProps?.({jsonforms: jsonFormsSubStates}, allProps),
		id: id,
	})
	const styles = $derived.by(() => {
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
	// let layoutClassObject = $derived(layout.direction === "row"
	// 	? styles.horizontalLayout
	// 	: styles.verticalLayout
	// )
	let detailUiSchema = $derived.by(() => {
		const uiSchemaGenerator = () => {
			const uiSchema = Generate.uiSchema(
				control.schema,
				'Group',
				undefined,
				control.rootSchema
			);
			if (isEmpty(control.path)) {
				uiSchema.type = 'VerticalLayout';
			} else {
				(uiSchema as GroupLayout).label = control.label;
			}
			return uiSchema;
		};

		return findUISchema(
			control.uischemas,
			control.schema,
			control.uischema.scope,
			control.path,
			uiSchemaGenerator,
			control.uischema,
			control.rootSchema
		);
	})

	// const appliedOptions = $derived(() =>
	// 	merge(
	// 		{},
	// 		cloneDeep(layout.config),
	// 		cloneDeep(layout.uischema.options)
	// 	)
	// )

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
</script>

{#if control.visible}
	<DispatchRenderer
		visible={control.visible}
		enabled={control.enabled}
		schema={control.schema}
		uischema={detailUiSchema}
		path={control.path}
		renderers={control.renderers}
		cells={control.cells}
	/>
{/if}
