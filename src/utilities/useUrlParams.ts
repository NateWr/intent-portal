import { computed, onMounted, watch, type Ref } from "vue";
import type { Filter } from "../types/filter";

type Params = {
  o?: string,
  p?: string,
  q?: string,
  s?: string,
  t?: string,
}

const SEPARATOR = '|'

export const useUrlParams = (
  persons: Ref<Filter[]>,
  sectors: Ref<Filter[]>,
  themes: Ref<Filter[]>,
  selectedPersons: Ref<Filter[]>,
  selectedSectors: Ref<Filter[]>,
  selectedThemes: Ref<Filter[]>,
  selectedPersonSlugs: Ref<string[]>,
  selectedSectorSlugs: Ref<string[]>,
  selectedThemeSlugs: Ref<string[]>,
  searchPhrase: Ref<string>,
  debouncedSearchPhrase: Ref<string>,
  orderBy: Ref<string>
) => {


  const urlParams = computed(() => {
    let params : Params = {}
    if (selectedThemeSlugs.value.length) {
      params.t = selectedThemeSlugs.value.join(SEPARATOR)
    }
    if (selectedSectorSlugs.value.length) {
      params.s = selectedSectorSlugs.value.join(SEPARATOR)
    }
    if (selectedPersonSlugs.value.length) {
      params.p = selectedPersonSlugs.value.join(SEPARATOR)
    }
    if (debouncedSearchPhrase.value.trim().length) {
      params.q = debouncedSearchPhrase.value.trim()
    }
    if (orderBy.value === 'new') {
      params.o = orderBy.value
    }
    return params
  })

  const queryString = computed(() => {
    return new URLSearchParams(urlParams.value).toString()
  })

  watch(urlParams, () => {
    const urlRoot = window.location.toString().split('?')[0]

    history.pushState(
      urlParams.value,
      '',
      queryString.value.length
        ? [urlRoot, queryString.value].join('?')
        : urlRoot
    )
  })

  const getSelectedFrom = (selected: string, filterSource: Filter[]) => {
    return selected
      .split(SEPARATOR)
      .map(slug => filterSource.find(t => t.slug === slug))
      .filter((v): v is Filter => !!v)
  }

  /**
   * Persons list is not populated until after the statements
   * have been fetched. This code watches for the first load
   * of the persons and applies the selected list once.
   */
  let personsQuery = ''
  watch(persons, (newValue) => {
    if (newValue.length && personsQuery) {
      selectedPersons.value = getSelectedFrom(personsQuery, newValue)
    }
  }, {once: true})

  onMounted(() => {
    const params = new URLSearchParams(window.location.search)
    if (!params.size) {
      return
    }
    params.forEach((value, key) => {
      if (!value.trim().length) {
        return
      }
      if (key === 'o') {
        orderBy.value = value
      } else if (key === 'p') {
        personsQuery = value
      } else if (key === 'q') {
        const unencoded = value.replace('+', ' ')
        searchPhrase.value = unencoded
        debouncedSearchPhrase.value = unencoded
      } else if (key === 's') {
        selectedSectors.value = getSelectedFrom(value, sectors.value)
      } else if (key === 't') {
        selectedThemes.value = getSelectedFrom(value, themes.value)
      }
    })
  })

  return {
    queryString
  }
}