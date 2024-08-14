import { onMounted, ref } from "vue";
import { useI18N } from '../utilities/useI18N'
import type { Statement } from "../types/statement";

export const useStatements = () => {
  const isLoading = ref<boolean>(true)
  const statements = ref<Statement[]>([])

  const { getI18N } = useI18N()
  const i18n = getI18N()

  const getDateNumber = (date: string) => {
    return date.trim()
      ? parseInt(
          date
            .split('/')
            .map(str => str.padStart(2, '0'))
            .reverse()
            .join('')
        )
      : Number.MAX_SAFE_INTEGER
  }

  const getFormattedDate = (date: string) => {
    if (!date) {
      return ''
    }
    const dateParts = date.split('/')
    return new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`)
      .toLocaleDateString(i18n.value.locale, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
  }

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
        statements.value = data
          .map((statement: Statement) => {
            return {
              ...statement,
              dateNumber: getDateNumber(statement.date),
              dateFormatted: getFormattedDate(statement.date),
            }
          })
      })
      .finally(() => {
        isLoading.value = false
      })
  })

  return {
    isLoading,
    statements,
  }
}