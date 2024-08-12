<script setup lang="ts">
import { ref, getCurrentInstance, watch, onMounted } from 'vue'

const props = defineProps({
  disableBackgroundScroll: Boolean
})

const open = ref(false)
const button = ref<HTMLButtonElement | null>(null)
const panel = ref<HTMLElement | null>(null)
const instance = getCurrentInstance()
const panelId = `${instance?.uid ?? ''}-panel`
const buttonId = `${instance?.uid ?? ''}-button`

const tabindexSelectors = [
  'button',
  '[href]',
  'input',
  'select',
  'textarea',
  'details',
  '[tabindex]:not([tabindex="-1"])'
]

const toggleDomSideEffects = (isOpen: boolean) => {
  if (props.disableBackgroundScroll) {
    if (isOpen) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
  }
  const tabIndex = isOpen ? 0 : -1
  panel.value?.querySelectorAll<HTMLButtonElement>(tabindexSelectors.join(',')).forEach((el) => {
    if (el?.tabIndex) {
      el.tabIndex = tabIndex
    }
  })
}

const setupGlobalListeners = () => {
  if (!panel?.value) {
    return
  }
  panel.value.addEventListener('focusout', () => {
    setTimeout(() => {
      if (panel?.value && !panel?.value.contains(document.activeElement)) {
        open.value = false
      }
    }, 500)
  })
  document.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (!button.value?.contains(target) && !panel.value?.contains(target)) {
      open.value = false
    }
  })
}

watch(open, (isOpen, wasOpen) => {
  if (isOpen === wasOpen) {
    return
  }
  toggleDomSideEffects(isOpen)
})

onMounted(() => {
  if (button.value && panel.value) {
    toggleDomSideEffects(false)
    setupGlobalListeners()
  }
})
</script>

<template>
  <div class="dropdown">
    <button
      class="dropdown-button"
      :aria-controls="panelId"
      :aria-expanded="open"
      :id="buttonId"
      ref="button"
      @click="open = !open"
    >
      <slot name="button" />
    </button>
    <div
      :aria-labelledby="buttonId"
      class="dropdown-panel"
      :data-open="open"
      :id="panelId"
      ref="panel"
    >
      <slot />
    </div>
  </div>
</template>

<style>
.dropdown {
  position: relative;
}

.dropdown-button {
  padding: 0;
  background: none;
  border: none;

  &:focus-visible {
    outline: 2px solid;
  }
}

.dropdown-panel {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: white;
  z-index: 99;
  padding: 1rem;
  min-width: 20em;
  border: 1px solid black;
  border-radius: var(--radius);
  transform: scale(0);
  transform-origin: top left;
  transition: transform 0.2s;

  &[data-open='true'] {
    transform: scale(1);
  }
}
</style>
