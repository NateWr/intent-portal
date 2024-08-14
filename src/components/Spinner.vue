<template>
	<span class="spinner">
    <slot />
  </span>
</template>

<style>
.spinner {
  display: flex;
  align-items: center;
  gap: 1em;
  font-size: 1rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;


	&:before {
		display: inline-block;
		position: relative;
		width: 1.25rem;
		height: 1.25rem;
		vertical-align: middle;
		animation: anim_spinner 0.6s linear infinite;
		border-radius: 100%;
		border-top: 2px solid currentColor;
		border-bottom: 2px solid transparent;
		border-left: 2px solid currentColor;
		border-right: 2px solid transparent;
		content: '';
		opacity: 1;
	}
}

@keyframes anim_spinner {
	0% {
		transform: rotateZ(-360deg);
	}
	100% {
		transform: rotateZ(0deg);
	}
}
</style>
