import { computed, watch, type Ref } from "vue";

type Params = {
  t?: string,
  s?: string,
  q?: string,
}

export const useUrlParams = (
  selectedThemeSlugs: Ref<string[]>,
  selectedSectorSlugs: Ref<string[]>,
  searchPhrase: Ref<string>,
) => {

  const urlParams = computed(() => {
    let params : Params = {}
    if (selectedThemeSlugs.value.length) {
      params.t = selectedThemeSlugs.value.join(',')
    }
    if (selectedSectorSlugs.value.length) {
      params.s = selectedSectorSlugs.value.join(',')
    }
    if (searchPhrase.value.trim().length) {
      params.q = searchPhrase.value.trim()
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