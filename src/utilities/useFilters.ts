import { computed, ref, watch, type ComputedRef, type Ref } from "vue";
import type { I18N } from "../types/i18n";
import type { Filter } from "../types/filter";
import type { Statement } from "../types/statement";
import debounce from "debounce";
import slugify from "@sindresorhus/slugify";

export const useFilters = (i18n: Ref<I18N>, statements: Ref<Statement[]>) => {

  const themes = ref<Filter[]>([
    {
      slug: 'civilian-harm',
      title: i18n.value?.civilianHarm ?? '',
    },
    {
      slug: 'starvation',
      title: i18n.value?.starvation ?? '',
    },
    {
      slug: 'infrastructure',
      title: i18n.value?.destructionInfrastructure ?? '',
    },
    {
      slug: 'forced-displacement',
      title: i18n.value?.annexationDisplacement ?? '',
    }
  ])

  const sectors = ref<Filter[]>([
    {
      slug: 'armed-forces',
      title: i18n.value?.armedForces ?? '',
    },
    {
      slug: 'decision-makers',
      title: i18n.value?.decisionMakers ?? '',
    },
    {
      slug: 'legislators',
      title: i18n.value?.legislators ?? '',
    },
    {
      slug: 'public-figures',
      title: i18n.value?.publicFigures ?? '',
    },
    {
      slug: 'former-government',
      title: i18n.value?.formerGovernment ?? '',
    },
    {
      slug: 'media',
      title: i18n.value?.media ?? '',
    },
    {
      slug: 'other',
      title: i18n.value?.other ?? '',
    },
  ])

  const persons = computed(() => {
    return [
      ...new Set(
        statements.value.map(statement => statement.person)
      )
    ]
    .map(name => {
      const count = statements.value.filter(s => s.person === name).length
      return {
        slug: slugify(name),
        title: `${name} (${count})`,
        count,
      }
    })
    .sort((a, b) => b.count - a.count)
  })

  const selectedThemes = ref<Filter[]>([])
  const selectedThemeSlugs = computed(() => selectedThemes.value.map(filter => filter.slug))
  const selectedSectors = ref<Filter[]>([])
  const selectedSectorSlugs = computed(() => selectedSectors.value.map(filter => filter.slug))
  const selectedPersons = ref<Filter[]>([])
  const selectedPersonSlugs = computed(() => selectedPersons.value.map(filter => filter.slug))
  const selectedPersonTitles = computed(() => selectedPersons.value.map(filter => filter.title.replaceAll(/\s\([0-9]*\)*$/gi, '')))
  const searchPhrase = ref('')
  const debouncedSearchPhrase = ref('')
  const orderBy = ref('')

  const clearFilter = (selectedFilters: Ref<Filter[]>) => selectedFilters.value = []
  const toggleFilter = (filter: Filter, selectedFilters: Ref<Filter[]>, selectedFilterSlugs: ComputedRef<string[]>) => {
    if (selectedFilterSlugs.value.includes(filter.slug)) {
      selectedFilters.value = selectedFilters.value.filter(f => f.slug !== filter.slug)
    } else {
      selectedFilters.value.push(filter)
    }
  }

  const clearPerson = () => clearFilter(selectedPersons)
  const togglePerson = (person: Filter) => toggleFilter(person, selectedPersons, selectedPersonSlugs)
  const clearTheme = () => clearFilter(selectedThemes)
  const toggleTheme = (theme: Filter) => toggleFilter(theme, selectedThemes, selectedThemeSlugs)
  const clearSector = () => clearFilter(selectedSectors)
  const toggleSector = (sector: Filter) => toggleFilter(sector, selectedSectors, selectedSectorSlugs)
  const setOrderBy = (order: string) => orderBy.value = order

  const selectedStatements = computed(() => {
    return statements.value
      .filter(statement => {
        if (selectedSectors.value.length && !selectedSectorSlugs.value.includes(statement.sector)) {
          return false
        }
        if (selectedThemes.value.length && !selectedThemeSlugs.value.find((t) => statement.themes.includes(t))) {
          return false
        }
        if (selectedPersonTitles.value.length && !selectedPersonTitles.value.includes(statement.person)) {
          return false
        }
        if (debouncedSearchPhrase.value && !statement.details.includes(debouncedSearchPhrase.value)) {
          return false
        }
        return true
      })
      .sort((a, b) => {
        if (orderBy.value === 'new') {
          return b.dateNumber - a.dateNumber
        }
        return a.dateNumber - b.dateNumber
      })
  })

  watch(searchPhrase, debounce(() => debouncedSearchPhrase.value = searchPhrase.value.trim(), 250))

  return {
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
    clearPerson,
    togglePerson,
    clearTheme,
    toggleTheme,
    clearSector,
    toggleSector,
    setOrderBy,
  }
}
