<script setup lang="ts">
import { computed, onMounted, ref, type PropType } from 'vue'
import PageHeader from './PageHeader.vue'
import StatementPanel from './StatementPanel.vue'
import FilterGroup from './FilterGroup.vue'
import Autocomplete from './Autocomplete.vue'
import OrderBy from './OrderBy.vue'
import Toolbar from './Toolbar.vue'
import IconSearch from './icons/IconSearch.vue'
import { useI18N } from '../utilities/useI18N'
import { useFilters } from '../utilities/useFilters'
import { useStatements } from '../utilities/useStatements'
import { useUrlParams } from '../utilities/useUrlParams'
import type { I18N } from '../types/i18n'
import type { Statement } from '../types/statement'

const props = defineProps({
  i18n: {
    type: Object as PropType<I18N>,
    required: true,
  },
  spreadsheetId: {
    type: String,
    required: true,
  }
})

const { getI18N, setI18N } = useI18N()
setI18N(props.i18n)
const i18n = getI18N()

const { isLoading, statements } = useStatements()

const {
  persons,
  sectors,
  themes,
  selectedPersons,
  selectedPersonSlugs,
  selectedSectors,
  selectedSectorSlugs,
  selectedThemes,
  selectedThemeSlugs,
  searchPhrase,
  debouncedSearchPhrase,
  orderBy,
  selectedStatements,
  togglePerson,
  clearTheme,
  toggleTheme,
  clearSector,
  toggleSector,
  setOrderBy,
  clearFilters
} = useFilters(i18n, statements)

useUrlParams(
  statements,
  persons,
  sectors,
  themes,
  selectedPersons,
  selectedSectors,
  selectedThemes,
  selectedPersonSlugs,
  selectedSectorSlugs,
  selectedThemeSlugs,
  searchPhrase,
  debouncedSearchPhrase,
  orderBy,
)

const downloadOrView = computed(() => {
  return i18n.value.downloadOrView
    ?.replace('{dataUrl}', `https://docs.google.com/spreadsheets/d/${props.spreadsheetId}/export?format=csv`)
    ?.replace('{spreadsheetUrl}', `https://docs.google.com/spreadsheets/d/${props.spreadsheetId}`)
    ?.replaceAll('<a ', '<a class="link" ')
})
</script>

<template>
  <PageHeader logoUrl="/img/logo.png">
    <h2 class="sr-only">{{ i18n.searchAndFilter }}</h2>
    <div class="leading-relaxed">
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
        <div class="text-sm font-medium">{{ i18n.findPersons }}</div>
        <Autocomplete
          name="search-persons"
          :placeholder="i18n.searchByName"
          :options="persons"
          :selectedOptions="selectedPersons"
          :selectedOptionSlugs="selectedPersonSlugs"
          @toggle="togglePerson"
        />
      </div>
      <div class="mobile-only flex flex-col gap-2">
        <h3 class="text-sm font-extrabold uppercase tracking-widest">
          {{ i18n.orderBy }}
        </h3>
        <OrderBy
          :current="orderBy"
          :oldest="i18n.oldest"
          :newest="i18n.newest"
          @order-by="setOrderBy"
        />
      </div>
      <form class="mobile-only flex flex-col gap-2">
        <h3 class="text-sm font-extrabold uppercase tracking-widest">
          {{ i18n.search }}
        </h3>
        <div class="input-wrapper">
          <IconSearch aria-hidden="true" />
          <label class="sr-only">{{ i18n.search }}</label>
          <input
            type="search"
            name="search"
            class="input"
            v-model="searchPhrase"
            :placeholder="i18n.searchStatements"
          >
        </div>
      </form>
      <div v-html="downloadOrView" />
    </div>
  </PageHeader>
  <Toolbar>
    <h2 class="sr-only">{{ i18n.searchAndFilter }}</h2>
    <div class="count-showing" role="alert">
      <span>
        <strong>{{ selectedStatements.length }} of {{ statements.length }}</strong> entries
      </span>
      <button
        v-if="selectedStatements.length < statements.length"
        class="link"
        @click="clearFilters"
      >
        {{ i18n.showAll }}
      </button>
    </div>
    <div class="desktop-only flex items-center">
      <h3 class="sr-only">
        {{ i18n.orderBy }}
      </h3>
      <OrderBy
        :current="orderBy"
        :oldest="i18n.oldest"
        :newest="i18n.newest"
        @order-by="setOrderBy"
      />
    </div>
    <form class="desktop-only flex items-center">
      <label for="search-toolbar" class="sr-only">{{ i18n.search }}</label>
      <div class="input-wrapper">
        <IconSearch aria-hidden="true" />
        <input
          type="search"
          name="search"
          id="search-toolbar"
          class="input"
          v-model="searchPhrase"
          :placeholder="i18n.searchStatements"
        >
      </div>
    </form>
  </Toolbar>
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

.count-showing {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 1rem;
  font-size: 0.875rem;
  background: var(--bg-highlight);
  color: var(--text-highlight);
  border-radius: var(--border-rounded);
  white-space: nowrap;

  & .link {
    color: var(--text-highlight);
  }
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

  body {
    --sidebar-width: 24rem;
  }

  .main {
    --gap: 1.5rem;
    margin-top: 0;
    margin-left: var(--sidebar-width);
    padding: var(--gap);
    padding-top: 6rem;
  }

  .count-showing {
    color: black;
    background: transparent;

    & .link {
      color: var(--highlight);
    }
  }
}
</style>
