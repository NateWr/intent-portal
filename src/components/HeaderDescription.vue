<script setup lang="ts">
import { useI18N } from '../utilities/useI18N'

const { getI18N } = useI18N()
const i18n = getI18N()
</script>

<template>
  <div class="header-description">
    {{ i18n.description }}
    <a href="/about" class="link">
      {{ i18n.learnMore }}
    </a>
  </div>
</template>
../utilities/useI18N