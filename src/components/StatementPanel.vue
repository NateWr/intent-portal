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
  searchPhrase: {
    type: Object as PropType<string>,
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

const regex = computed(() => new RegExp(`(${props.searchPhrase})`, 'gi'))

const searchMatch = (str: string) => {
  if (!props.searchPhrase) {
    return str
  }
  return str.replaceAll(regex.value, "<mark class=\"statement-searched-phrase\">$1</mark>")
}

const detailsSearchMatch = computed(() => searchMatch(props.statement?.details ?? ''))
const notesSearchMatch = computed(() => searchMatch(props.statement?.notes ?? ''))
const personSearchMatch = computed(() => searchMatch(props.statement?.person ?? ''))
const positionSearchMatch = computed(() => searchMatch(props.statement?.position ?? ''))
</script>
<template>
  <li class="statement flex flex-col gap-6">
    <h3 class="sr-only">{{ statement.dateFormatted }}, {{ statement.person }}, {{ statement.position }}</h3>
    <div class="flex flex-start items-center justify-between">
      <div class="font-light uppercase">
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
      v-html="detailsSearchMatch"
    />
    <div class="flex flex-col gap-1">
      <div
        v-if="personSearchMatch"
        class="text-xl font-extrabold leading-snug"
        v-html="personSearchMatch"
      />
      <div
        v-if="positionSearchMatch"
        class="text-sm leading-normal"
        v-html="positionSearchMatch"
      />
    </div>
    <div
      v-if="tags.length"
      class="flex flex-wrap items-center gap-2"
    >
      <span v-for="(tag, i) in tags" :key="i" class="statement-tag">
        {{ tag }}
      </span>
    </div>
    <div v-if="notesSearchMatch" class="statement-notes text-sm leading-relaxed break-words">
      <strong>{{ i18n.note }}</strong>
      <span v-html="notesSearchMatch" />
    </div>
  </li>
</template>

<style>
.statement {
  background: var(--bg);
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
  color: var(--link);
  border-color: var(--link);

  &:hover {
    color: var(--link-hover);
    border-color: var(--link-hover);
  }

  &:focus-visible {
    outline: 1px solid var(--link);
    color: var(--link);
    border-color: var(--link);
  }
}

.statement-tag {
  padding: 0.25rem 0.75rem;
  border: 1px solid var(--text-light-2x);
  border-radius: var(--border-rounded);
  font-weight: 500;
  white-space: nowrap;
}

.statement-searched-phrase {
  background: var(--bg-searched-phrase);
  color: var(--text-searched-phrase);
}

.statement-notes {
  padding: 1.5rem;
  background: var(--bg-shaded);
}
</style>