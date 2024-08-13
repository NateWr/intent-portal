<script setup lang="ts">
import { computed, onMounted, ref, type PropType } from 'vue'
import PageHeader from './PageHeader.vue'
import StatementPanel from './StatementPanel.vue'
import FilterGroup from './FilterGroup.vue'
import { useI18N } from '../utilities/useI18N'
import { useFilters } from '../utilities/useFilters'
import { useUrlParams } from '../utilities/useUrlParams'
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

const {
  sectors,
  themes,
  selectedSectors,
  selectedSectorSlugs,
  selectedThemes,
  selectedThemeSlugs,
  searchPhrase,
  personSearchPhrase,
  clearTheme,
  toggleTheme,
  clearSector,
  toggleSector,
} = useFilters(i18n, statements)

const { queryString } = useUrlParams(
  selectedThemeSlugs,
  selectedSectorSlugs,
  searchPhrase,
)

const selectedStatements = computed(() => {
  return statements.value
    .filter(statement => {
      if (selectedSectors.value.length && !selectedSectors.value.find(s => s.title === statement.sector)) {
        return false
      }
      if (selectedThemes.value.length && !selectedThemes.value.find(t => statement.themes.includes(t.title))) {
        return false
      }
      return true
    })
})

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
      <FilterGroup
        :clearLabel="i18n.allThemes"
        :filters="themes"
        :selected="selectedThemes"
        :selectedSlugs="selectedThemeSlugs"
        @toggle="toggleTheme"
        @clear="clearTheme"
      >
        {{ i18n.themes }}
      </FilterGroup>
      <FilterGroup
        :clearLabel="i18n.allSectors"
        :filters="sectors"
        :selected="selectedSectors"
        :selectedSlugs="selectedSectorSlugs"
        @toggle="toggleSector"
        @clear="clearSector"
      >
        {{ i18n.sectors }}
      </FilterGroup>
      <div class="flex flex-col gap-2">
        <h3 class="text-sm font-extrabold uppercase tracking-widest">
          {{ i18n.persons }}
        </h3>
        <div>{{ i18n.findPersons }}</div>
        <div class="input-wrapper">
          <input
            type="search"
            name="search"
            v-model="personSearchPhrase"
            :placeholder="i18n.searchByName"
          >
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <h3 class="text-sm font-extrabold uppercase tracking-widest">
          {{ i18n.orderBy }}
        </h3>
        <div class="flex gap-2">
          <button>{{ i18n.oldest }}</button>
          <button>{{ i18n.newest }}</button>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <h3 class="text-sm font-extrabold uppercase tracking-widest">
          {{ i18n.search }}
        </h3>
        <div class="input-wrapper">
          <input
            type="search"
            name="search"
            v-model="searchPhrase"
            :placeholder="i18n.searchStatements"
          >
        </div>
      </div>
      <div>
        {{ i18n.downloadOrView }}
      </div>
    </div>
  </PageHeader>
  <section class="toolbar flex item-center gap-8">
    <h2 class="sr-only"></h2>
    <div class="toolbar-count">
      <span><strong>312 of 493</strong> entries</span>
      <button>{{ i18n.showAll }}</button>
    </div>
    <div class="toolbar-order">
      <h3 class="sr-only">
        {{ i18n.orderBy }}
      </h3>
      <div class="flex gap-2">
        <button>{{ i18n.oldest }}</button>
        <button>{{ i18n.newest }}</button>
      </div>
    </div>
    <form class="toolbar-search">
      <label for="search-toolbar" class="sr-only">{{ i18n.search }}</label>
      <div class="input-wrapper">
        <input
          type="search"
          name="search"
          id="search-toolbar"
          v-model="searchPhrase"
          :placeholder="i18n.searchStatements"
        >
      </div>
    </form>
  </section>
  <main class="main">
    <h2 class="sr-only">{{ i18n.statements }}</h2>
    <div v-if="!selectedStatements && !isLoading" class="main-no-statements">
      {{ i18n.noStatementsFound }}
      <button class="link">
        {{ i18n.showAll }}
      </button>
    </div>
    <ul v-else class="main-list">
      <StatementPanel
        v-for="statement in selectedStatements"
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
.toolbar {
  position: fixed;
  top: 3rem;
  left: 50%;
  height: 2rem;
  transform: translateX(-50%);
  z-index: 99;
  margin: 0.5rem 0;
  font-size: 0.875rem;
}

.toolbar-count {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 1rem;
  font-size: 0.875rem;
  background: var(--red);
  color: white;
  border-radius: var(--border-rounded);
  white-space: nowrap;
}

.toolbar-order,
.toolbar-search {
  display: none;
}

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

  .toolbar {
    top: 0.75rem;
    left: auto;
    right: 1rem;
    width: auto;
    height: auto;
    transform: none;
    display: flex;
    align-items: center;
    gap: 2rem;
    padding: 0.75rem 1.5rem;
    background: white;
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: var(--border-rounded);
    font-size: 1rem;
  }

  .toolbar-count {
    color: black;
    background: transparent;
  }

  .toolbar-order,
  .toolbar-search {
    display: flex;
    align-items: center;
  }
}
</style>
