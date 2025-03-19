<script lang="ts">
	import {isDescriptionHidden} from "@jsonforms/core"
	import type {ControlWrapperProps} from "../../types.js"

	let {
		    id,
		    visible,
		    description,
		    isFocused,
		    required,
		    appliedOptions,
		    styles,
		    errors,
		    label,
		children
	    }: ControlWrapperProps = $props()

	let showDescription = $derived(!isDescriptionHidden(
		visible,
		description,
		isFocused,
		!!appliedOptions?.showUnfocusedDescription
	))
	let showAsterisk    = $derived(required && !appliedOptions?.hideRequiredAsterisk)
</script>

{#if visible}
	<div {id} class={styles.control.root}>
		<label
			for="{id}-input"
			class={[styles.control.label, ...(required ? styles.control.required : [])].join(" ")}
		>
			{label}
			{#if showAsterisk}
				<span class={styles.control.asterisk}>*</span>
			{/if}
		</label>
		<div class={styles.control.wrapper}>
			{@render children?.()}
		</div>
		<div class={errors ? styles.control.error : styles.control.description}>
			{errors ? errors : showDescription ? description : null}
		</div>
	</div>
{/if}
