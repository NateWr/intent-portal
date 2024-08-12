import { computed, ref, type Ref } from "vue";
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

  return {
    persons,
    sectors,
    themes,
  }
}
