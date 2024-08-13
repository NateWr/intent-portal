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
        <button class="flex" @click="$emit('clear')">
          <Pill :selected="!selected.length">
            <IconPlus v-if="selected.length" class="-ml-2" aria-hidden="true" />
            <IconMinus v-else class="-ml-2" aria-hidden="true" />
            {{ clearLabel }}
          </Pill>
        </button>
      </li>
      <li
        v-for="filter in filters"
        :key="filter.slug"
      >
        <button class="flex" @click="$emit('toggle', filter)">
          <Pill :selected="selectedSlugs.includes(filter.slug)">
            <IconPlus v-if="!selectedSlugs.includes(filter.slug)" class="-ml-2" aria-hidden="true" />
            <IconMinus v-else class="-ml-2" aria-hidden="true" />
            {{ filter.title }}
          </Pill>
        </button>
      </li>
    </ul>
  </div>
</template>
