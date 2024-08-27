<script setup lang="ts">
defineProps({
  selected: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <button class="button">
    <slot />
  </button>
</template>

<style>
.button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--link);
  background: var(--bg);
  border: 2px solid var(--link);
  border-radius: var(--border-rounded);
  text-align: initial;

  &:hover {
    background: var(--bg-highlight);
    color: var(--text-highlight);
  }

  &:focus-visible {
    outline: 2px solid var(--link);
    outline-offset: 2px;
  }
}
</style>