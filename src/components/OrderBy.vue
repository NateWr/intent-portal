<script setup lang="ts">
import Pill from './Pill.vue'

defineProps({
  current: String,
  oldest: String,
  newest: String,
})

const emits = defineEmits<{
  (e: 'order-by', order: string): void
}>()
</script>

<template>

  <div class="flex gap-2">
    <Pill :selected="current === ''" @click="$emit('order-by', '')">{{ oldest }}</Pill>
    <Pill :selected="current === 'new'" @click="$emit('order-by', 'new')">{{ newest }}</Pill>
  </div>
</template>