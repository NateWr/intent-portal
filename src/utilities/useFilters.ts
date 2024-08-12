import { ref, type Ref } from "vue";
import type { I18N } from "../types/i18n";
import type { Filter } from "../types/filter";

export const useFilters = (i18n: Ref<I18N>) => {

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

  return {
    sectors,
    themes,
  }
}
