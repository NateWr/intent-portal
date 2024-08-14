import { onMounted, ref } from "vue";
import type { Statement } from "../types/statement";

export const useStatements = () => {
  const isLoading = ref<boolean>(true)
  const statements = ref<Statement[]>([])

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
              dateNumber: statement.date.trim()
                ? parseInt(
                    statement.date
                      .split('/')
                      .map(str => str.padStart(2, '0'))
                      .reverse()
                      .join('')
                  )
                : Number.MAX_SAFE_INTEGER,
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