<script setup lang="ts">
import debounce from 'debounce'
import { onMounted, ref, watch } from 'vue'
import IconFilter from './icons/IconFilter.vue'
import { useI18N } from '../utilities/useI18N'

const props = defineProps({
  logoUrl: String,
  siteUrl: String,
})

const isDesktop = () => document.body.clientWidth >= 1280
const showMenu = ref<boolean>(isDesktop())

const setBodyOverflow = (value: boolean) => {
  if (value && !isDesktop()) {
    document.body.classList.add('overflow-hidden')
  } else {
    document.body.classList.remove('overflow-hidden')
  }
}

const { getI18N } = useI18N()
const i18n = getI18N()

watch(showMenu, setBodyOverflow)

onMounted(() => {
  window.addEventListener('resize', debounce(() => {
    if (isDesktop()) {
      showMenu.value = true
    }
  }, 1000))
})
</script>

<template>
  <header class="header">
    <h1 class="sr-only">{{ i18n.title }}</h1>
    <a class="header-logo focus-visible-inside" :href="siteUrl">
      <img alt="" :src="logoUrl" width="514" height="64" />
    </a>
    <button
      class="header-button focus-visible-inside"
      @click="showMenu = !showMenu"
    >
      <span v-if="!showMenu">{{ i18n.filter }}</span>
      <span v-else>{{ i18n.close }}</span>
      <IconFilter aria-hidden="true" focusable="false" />
    </button>
    <Transition name="header-panel">
      <div v-if="showMenu" class="header-panel focus-visible-inside">
        <slot />
      </div>
    </Transition>
  </header>
</template>

<style>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3rem;
  z-index: 9999;
  background: var(--bg);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-logo {

  & img {
    width: auto;
    height: 1.5rem;
    margin: 0.75rem;
  }
}

.header-button {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 3rem;
  height: 3rem;
  font-size: 0.5rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.header-panel {
  position: fixed;
  top: 3rem;
  width: 100%;
  max-height: calc(100vh - 3rem);
  overflow-y: auto;
  transition: all 0.3s;
  transform-origin: top right;
  transform: scale(1);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: .5rem;
  padding-bottom: 6rem;
  background: var(--bg);
  border: none;
  border-bottom: 2px solid var(--highlight);
}

.header-panel-enter-from,
.header-panel-leave-to {
  transform: scale(0);
}

@media (min-width: 1280px) {

  .header {
    position: fixed;
    top: 0;
    left: 0;
    width: var(--sidebar-width);
    height: 100vh;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }

  .header-button {
    display: none;
  }

  .header-logo {

    & img {
      width: 100%;
      height: auto;
      margin: 0;
      padding: 1.5rem;
    }
  }

  .header-panel {
    position: relative;
    top: 0;
    left: 0;
    width: auto;
    height: auto;
    border: none;
    padding: 1.5rem;
    /* Allow space for the autocomplete dropdown (@see MAX_OPTIONS in Autocomplete.vue) */
    padding-bottom: 240px;
  }
}
</style>