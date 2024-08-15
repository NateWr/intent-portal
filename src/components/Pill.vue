<script setup lang="ts">
defineProps({
  selected: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <button class="pill" :class="selected ? 'pill-selected' : ''">
    <slot />
  </button>
</template>

<style>
.pill {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text);
  background: var(--bg);
  border-radius: var(--border-rounded);
  text-align: initial;

  &:hover {
    background: var(--highlight-soft);
  }

  &:focus-visible {
    outline: 2px solid var(--highlight);
    outline-offset: -2px;
  }
}

.pill-selected {
  color: var(--text-highlight);
  background: var(--bg-highlight);

  &:hover {
    background: var(--bg-highlight-hover);
  }

  &:focus-visible {
    outline-color: var(--text-highlight);
    outline-offset: -4px;
  }
}
</style>