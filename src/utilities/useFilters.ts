import { computed, ref, type ComputedRef, type Ref } from "vue";
import type { I18N } from "../types/i18n";
import type { Filter } from "../types/filter";
import type { Statement } from "../types/statement";

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
      slug: 'displacement',
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
    .sort()
    .map(name => {
      return {
        slug: name,
        title: name,
      }
    })
  })

  const selectedThemes = ref<Filter[]>([])
  const selectedThemeSlugs = computed(() => selectedThemes.value.map(filter => filter.slug))
  const selectedSectors = ref<Filter[]>([])
  const selectedSectorSlugs = computed(() => selectedSectors.value.map(filter => filter.slug))
  const searchPhrase = ref<string>('')
  const personSearchPhrase = ref<string>('')

  const clearFilter = (selectedFilters: Ref<Filter[]>) => selectedFilters.value = []
  const toggleFilter = (filter: Filter, selectedFilters: Ref<Filter[]>, selectedFilterSlugs: ComputedRef<string[]>) => {
    if (selectedFilterSlugs.value.includes(filter.slug)) {
      selectedFilters.value = selectedFilters.value.filter(f => f.slug !== filter.slug)
    } else {
      selectedFilters.value.push(filter)
    }
  }

  const clearTheme = () => clearFilter(selectedThemes)
  const toggleTheme = (theme: Filter) => toggleFilter(theme, selectedThemes, selectedThemeSlugs)
  const clearSector = () => clearFilter(selectedSectors)
  const toggleSector = (sector: Filter) => toggleFilter(sector, selectedSectors, selectedSectorSlugs)

  return {
    persons,
    sectors,
    themes,
    selectedSectors,
    selectedSectorSlugs,
    selectedThemes,
    selectedThemeSlugs,
    clearTheme,
    toggleTheme,
    clearSector,
    toggleSector,
    searchPhrase,
    personSearchPhrase,
  }
}
