import { computed, watch, type Ref } from "vue";

type Params = {
  o?: string,
  p?: string,
  q?: string,
  s?: string,
  t?: string,
}

const SEPARATOR = '|'

export const useUrlParams = (
  selectedThemeSlugs: Ref<string[]>,
  selectedSectorSlugs: Ref<string[]>,
  selectedPersonSlugs: Ref<string[]>,
  searchPhrase: Ref<string>,
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
    if (searchPhrase.value.trim().length) {
      params.q = searchPhrase.value.trim()
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

  return {
    queryString
  }
}