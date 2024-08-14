<script setup lang="ts">
import { computed, type PropType } from 'vue'
import { useI18N } from '../utilities/useI18N'
import type { Statement } from '../types/statement'

const props = defineProps({
  statement: {
    type: Object as PropType<Statement>,
    required: true,
  },
})

const { getI18N } = useI18N()
const i18n = getI18N()

const dateFormatted = computed(() => {
  if (!props.statement.date) {
    return ''
  }
  const dateParts = props.statement.date.split('/')
  return new Date(`${dateParts[1]}-${dateParts[0]}-${dateParts[2]}`)
    .toLocaleDateString(i18n.value.locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
})
</script>

<template>
  <li class="statement">
    <div>{{ dateFormatted }}</div>
    <div class="statement-details">{{ statement?.details }}</div>
    <div>{{ statement?.person }}</div>
    <div>{{ statement?.position }}</div>
    <div>
      <a v-for="source in statement?.sources" :key="source" :href="source" class="break-all">
        {{ source }}
      </a>
    </div>
  </li>
</template>

<style>
.statement {
  background: white;
  padding: 1rem;
}

.statement-details {
  word-wrap: break-word;
}
</style>