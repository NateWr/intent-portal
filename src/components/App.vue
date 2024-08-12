<script setup lang="ts">
import { onMounted, ref, type PropType } from 'vue'
import HeaderMobile from './HeaderMobile.vue'
import HeaderDesktop from './HeaderDesktop.vue'
import { useI18N } from '../utilities/useI18N'
import type { I18N } from '../types/i18n'
import type { Statement } from '../types/statement'

const props = defineProps({
  i18n: {
    type: Object as PropType<I18N>,
    required: true,
  },
})

const isLoading = ref<boolean>(true)
const statements = ref<Statement[]>([])

const { setI18N } = useI18N()
setI18N(props.i18n)

onMounted(() => {
  fetch('/statements.json')
    .then(r => {
      if (!r.ok) {
        throw new Error()
      }
      return r
    })
    .then(r => r.json())
    .then(data => {
      statements.value = data
    })
    .finally(() => {
      isLoading.value = false
    })
})
</script>

<template>
  <header>
    <img alt="" class="logo" src="/img/logo.png" width="514" height="64" />
    <h1 class="sr-only">{{ i18n.title }}</h1>
    <HeaderMobile class="header-mobile" />
    <HeaderDesktop class="header-desktop" />
  </header>
  <main>
    <h1>Some text</h1>
    <p v-if="isLoading">Loading...</p>
    <pre v-else v-html="JSON.stringify(statements, null, 2)" />
  </main>
</template>

<style>
.header-desktop {
  display: none;
}

@media (min-width: 1280px) {
  .header-mobile {
    display: none;
  }

  .header-desktop {
    display: block;
  }
}
</style>../utilities/useI18N