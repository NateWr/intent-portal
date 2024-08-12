import { ref } from 'vue'
import type { I18N } from '../types/i18n'

const i18n = ref<I18N>({})

export const useI18N = () => {

  const setI18N = (newData: I18N) => {
    i18n.value = newData
  }

  const getI18N = () => i18n

  return {
    getI18N,
    setI18N,
  }
}