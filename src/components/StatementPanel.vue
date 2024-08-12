<script setup lang="ts">
import { type PropType } from 'vue'
import type { Statement } from '../types/statement'

const props = defineProps({
  statement: Object as PropType<Statement>,
})
</script>

<template>
  <li class="statement">
    <div>{{ statement?.date }}</div>
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