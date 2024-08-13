<script setup lang="ts">
defineProps({
  selected: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <span class="pill" :class="selected ? 'pill-selected' : ''">
    <slot />
  </span>
</template>

<style>
.pill {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 1rem;
  font-size: 0.875rem;
  color: var(--text);
  background: var(--bg);
  border-radius: var(--border-rounded);
  text-align: initial;
}

.pill-selected {
  color: var(--text-highlight);
  background: var(--bg-highlight);
}
</style>