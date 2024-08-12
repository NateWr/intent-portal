<script setup lang="ts">
import { onMounted, ref, type PropType } from 'vue'
import PageHeader from './PageHeader.vue'
import StatementPanel from './StatementPanel.vue'
import { useI18N } from '../utilities/useI18N'
import { useFilters } from '../utilities/useFilters'
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

const { getI18N, setI18N } = useI18N()
setI18N(props.i18n)
const i18n = getI18N()

const { sectors, themes } = useFilters(i18n)

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
      statements.value = data.slice(0, 10)
    })
    .finally(() => {
      isLoading.value = false
    })
})
</script>

<template>
  <PageHeader logoUrl="/img/logo.png">
    <h2 class="sr-only">{{ i18n.searchAndFilter }}</h2>
    <div class="header-description">
      {{ i18n.description }}
      <a href="/about" class="link">
        {{ i18n.learnMore }}
      </a>
    </div>
    <div class="flex flex-col gap-8">
      <div
        v-if="themes.length"
        class="flex flex-col gap-2"
      >
        <h3>
          {{ i18n.themes }}
        </h3>
        <ul>
          <li
            v-for="theme in themes"
            :key="theme.slug"
          >
            {{ theme.title }}
          </li>
        </ul>
      </div>
      <div
        v-if="sectors.length"
        class="flex flex-col gap-2"
      >
        <h3>
          {{ i18n.sectors }}
        </h3>
        <ul>
          <li
            v-for="sector in sectors"
            :key="sector.slug"
          >
            {{ sector.title }}
          </li>
        </ul>
      </div>
    </div>
  </PageHeader>
  <main class="main">
    <h2 class="sr-only">{{ i18n.statements }}</h2>
    <div v-if="!statements && !isLoading" class="main-no-statements">
      {{ i18n.noStatementsFound }}
      <button class="link">
        {{ i18n.showAll }}
      </button>
    </div>
    <ul v-else class="main-list">
      <StatementPanel
        v-for="statement in statements"
        :key="statement.id"
        :statement="statement"
      />
    </ul>
    <template v-if="isLoading">
      <div class="loading-screen" />
      <div class="loading-spinner" role="alert">
        {{ i18n.loading }}
      </div>
    </template>
  </main>
</template>

<style>
.main {
  --gap: 1rem;
  position: relative;
  margin-top: 3rem;
  padding: 3rem 0.5rem;
}

.main-list {
  display: flex;
  flex-direction: column;
  gap: var(--gap);
  max-width: 46rem;
  margin-left: auto;
  margin-right: auto;
}

.loading-screen {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  backdrop-filter: blur(5px);
}

.loading-spinner {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

@media (min-width: 1280px) {
  .main {
    --gap: 1.5rem;
    margin-top: 0;
    margin-left: 20rem;
    padding: var(--gap);
    padding-top: 6rem;
  }
}
</style>
