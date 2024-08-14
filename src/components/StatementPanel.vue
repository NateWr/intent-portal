<script setup lang="ts">
import { computed, type PropType } from 'vue'
import IconLock from './icons/IconLock.vue'
import IconOutwardArrow from './icons/IconOutwardArrow.vue'
import { useI18N } from '../utilities/useI18N'
import type { Filter } from '../types/filter'
import type { Statement } from '../types/statement'

const props = defineProps({
  statement: {
    type: Object as PropType<Statement>,
    required: true,
  },
  sectors: {
    type: Object as PropType<Filter[]>,
    required: true,
  },
  themes: {
    type: Object as PropType<Filter[]>,
    required: true,
  },
})

const { getI18N } = useI18N()
const i18n = getI18N()

const fontSize = computed(() => {
  if (props.statement.details.length < 72 ) {
    return 'text-[2rem] leading-tight'
  } else if (props.statement.details.length < 220) {
    return 'text-xl leading-normal'
  } else if (props.statement.details.length < 350) {
    return 'leading-relaxed'
  }
  return 'text-sm leading-loose'
})

const tags = computed(() => {
  const sector = props.sectors.find(s => s.slug === props.statement?.sector)?.title
  const themes = props.themes.filter(t => props.statement.themes.includes(t.slug)).map(t => t.title)
  return [
    sector,
    ...themes
  ].filter(v => v)
})
</script>
<template>
  <li class="statement flex flex-col gap-6">
    <h3 class="sr-only">{{ statement.dateFormatted }}, {{ statement.person }}, {{ statement.position }}</h3>
    <div class="flex flex-start items-center justify-between">
      <div v-if="statement.dateFormatted" class="font-light uppercase">
        {{ statement.dateFormatted }}
      </div>
      <div v-if="statement.sources.length || statement.permalink" class="flex items-center gap-2">
        <h4 class="sr-only">{{ i18n.sources }}</h4>
        <a
          v-for="(source, i) in statement.sources"
          :key="i"
          class="statement-source"
          :href="source.url"
          target="_blank"
        >
          <IconOutwardArrow aria-hidden="true" />
          <span class="sr-only">{{ source.domain ? source.domain : source.url }}</span>
        </a>
        <a
          class="statement-source statement-source-permalink"
          :href="statement.permalink"
          :title="i18n.permalink"
          target="_blank"
        >
          <IconLock aria-hidden="true" />
          <span class="sr-only">{{ i18n.permalink }}</span>
        </a>
      </div>
    </div>
    <div
      class="font-medium break-words"
      :class="fontSize"
      v-if="statement.details"
      v-html="statement.details"
    />
    <div class="flex flex-col gap-1">
      <div v-if="statement.person" class="text-xl font-extrabold leading-snug">
        {{ statement.person }}
      </div>
      <div v-if="statement.position" class="text-sm leading-normal">
        {{ statement.position }}
      </div>
    </div>
    <div
      v-if="tags.length"
      class="flex flex-wrap items-center gap-2"
    >
      <span v-for="(tag, i) in tags" :key="i" class="statement-tag">
        {{ tag }}
      </span>
    </div>
  </li>
</template>

<style>
.statement {
  background: white;
  padding: 1rem;
}

.statement-source {
  width: 2rem;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--text-light);
  border: 1px solid var(--text-light-2x);

  &:hover {
    color: var(--text);
    border-color: var(--text-light);
  }

  &:focus-visible {
    outline: 1px solid var(--text);
    color: var(--text);
    border-color: var(--text);
  }
}

.statement-source-permalink {
  color: var(--highlight);
  border-color: var(--highlight);

  &:hover {
    color: var(--highlight-hover);
    border-color: var(--highlight-hover);
  }

  &:focus-visible {
    outline: 1px solid var(--highlight);
    color: var(--highlight);
    border-color: var(--highlight);
  }
}

.statement-tag {
  padding: 0.25rem 0.75rem;
  border: 1px solid var(--text-light-2x);
  border-radius: var(--border-rounded);
  font-weight: 500;
  white-space: nowrap;
}
</style>