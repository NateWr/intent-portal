<script setup lang="ts">
import { type PropType } from 'vue'
import Pill from './Pill.vue'
import IconMinus from './icons/IconMinus.vue'
import IconPlus from './icons/IconPlus.vue'
import type { Filter } from '../types/filter'

const props = defineProps({
  filters: {
    type: Object as PropType<Filter[]>,
    required: true,
  },
  selected: {
    type: Object as PropType<Filter[]>,
    required: true,
  },
  selectedSlugs: {
    type: Array as PropType<string[]>,
    required: true,
  },
  clearLabel: String,
})

defineEmits<{
  (e: 'toggle', theme: Filter): void
  (e: 'clear'): void
}>()
</script>

<template>
  <div class="flex flex-col gap-2">
    <h3 class="text-sm font-extrabold uppercase tracking-widest">
      <slot />
    </h3>
    <ul class="flex flex-col gap-px">
      <li class="flex">
        <Pill
          class="flex"
          :selected="!selected.length"
          @click="$emit('clear')"
        >
          <IconPlus v-if="selected.length" class="-ml-2" aria-hidden="true" />
          <IconMinus v-else class="-ml-2" aria-hidden="true" />
          {{ clearLabel }}
        </Pill>
      </li>
      <li
        v-for="filter in filters"
        :key="filter.slug"
      >
        <Pill
          class="flex"
          :selected="selectedSlugs.includes(filter.slug)"
          @click="$emit('toggle', filter)"
        >
          <IconPlus v-if="!selectedSlugs.includes(filter.slug)" class="-ml-2" aria-hidden="true" />
          <IconMinus v-else class="-ml-2" aria-hidden="true" />
          {{ filter.title }}
        </Pill>
      </li>
    </ul>
  </div>
</template>
