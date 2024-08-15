<script setup lang="ts">
import { computed, ref, watch, type PropType } from 'vue'
import Pill from './Pill.vue'
import IconMinus from './icons/IconMinus.vue'
import IconPlus from './icons/IconPlus.vue'
import IconSearch from './icons/IconSearch.vue'
import { useI18N } from '../utilities/useI18N'
import type { Filter } from '../types/filter'

const MAX_OPTIONS = 10

const props = defineProps({
  name: String,
  options: {
    type: Object as PropType<Filter[]>,
    required: true,
  },
  placeholder: String,
  selectedOptions: {
    type: Object as PropType<Filter[]>,
    required: true,
  },
  selectedOptionSlugs: {
    type: Array as PropType<String[]>,
    required: true,
  }
})

const emits = defineEmits<{
  (e: 'toggle', option: Filter): void
}>()

const listboxId = computed(() => `${props.name}-autocomplete-listbox`)
const instructionsId = computed(() => `${props.name}-autocomplete-instructions`)

const { getI18N } = useI18N()
const i18n = getI18N()

const searchPhrase = ref('')
const matchingOptions = computed(() => {
  if (!searchPhrase.value.trim()) {
    return []
  }
  return props.options
    .filter(o => {
      return !props.selectedOptionSlugs.includes(o.slug)
        && o.title.toLowerCase().includes(searchPhrase.value.toLowerCase())
    })
    .slice(0, MAX_OPTIONS)
})

const input = ref<HTMLInputElement|null>(null)
const focusedOption = ref(0)
const listBox = ref<HTMLElement|null>(null)

const reset = () => {
  searchPhrase.value = ''
  focusedOption.value = 0
  input.value?.focus()
}

const toggleFirst = () => {
  if (matchingOptions.value.length > 0) {
    toggle(matchingOptions.value[0])
  }
}

const toggle = (option: Filter) => {
  emits('toggle', option)
  reset()
}

const keyDown = (e: Event) => {
  focusedOption.value = Math.min(matchingOptions.value.length, focusedOption.value + 1)
}

const keyUp = (e: Event) => {
  focusedOption.value = Math.max(0, focusedOption.value - 1)
}

watch(focusedOption, (newVal) => {
  const $option : HTMLButtonElement | null | undefined = listBox.value?.querySelector(`[aria-posinset="${newVal}"]`)
  $option?.focus()
})

watch(matchingOptions, () => focusedOption.value = 0)
</script>

<template>
  <div @keyup.down="keyDown" @keyup.up="keyUp">
    <div class="sr-only" role="status" aria-atomic="true" aria-live="polite" v-html="i18n.autocompletePrompt" />
    <div class="input-wrapper">
      <IconSearch aria-hidden="true" />
      <input
        :aria-expanded="matchingOptions.length > 0"
        :aria-owns="listboxId"
        aria-autocomplete="both"
        :aria-described-by="instructionsId"
        autocomplete="off"
        class="input"
        :name="name"
        :placeholder="placeholder"
        ref="input"
        role="combobox"
        type="text"
        v-model="searchPhrase"
        @keyup.enter="toggleFirst"
      >
      <div
        class="autocomplete-listbox flex flex-col items-start gap-px"
        :class="matchingOptions.length > 0 ? 'autocomplete-listbox-open' : ''"
        :id="listboxId"
        ref="listBox"
        role="listbox"
      >
        <Pill
          v-for="(option, i) in matchingOptions"
          :key="option.slug"
          class="autocomplete-option"
          role="option"
          tabindex="-1"
          :aria-posinset="i + 1"
          :aria-setsize="matchingOptions.length"
          :aria-selected="focusedOption === i ? true : null"
          @click="toggle(option)"
        >
          <IconPlus class="-ml-2" aria-hidden="true" />
          {{ option.title }}
        </Pill>
      </div>
    </div>
    <span class="sr-only" :id="instructionsId" v-html="i18n.autocompleteInstructions" />
    <ul class="flex flex-wrap gap-1 mt-2" :aria-label="i18n.selected">
      <li
        v-for="option in selectedOptions"
        :key="option.slug"
      >
        <Pill
          :selected="true"
          @click="toggle(option)"
        >
          <IconMinus class="-ml-2" aria-hidden="true" />
          {{ option.title }}
          <span class="sr-only">{{  i18n.autocompleteUnselect }}</span>
        </Pill>
      </li>
    </ul>
  </div>
</template>

<style>
.autocomplete-listbox {
  position: absolute;
  top: calc(100% - 1px);
  left: 1rem;
  right: 1rem;
  padding: 0.5rem;
  background: var(--bg);
  border: 1px solid var(--text);
  z-index: 999;
  transform: scale(0);
  transform-origin: top left;
  transition: all 0.15s;
}

.autocomplete-listbox-open {
  transform: scale(1);
}
</style>