<script setup lang="ts">
import Dropdown from './Dropdown.vue'
import HeaderDescription from './HeaderDescription.vue'
import IconFilter from './icons/Filter.vue'
</script>

<template>
  <Dropdown :disable-background-scroll="true">
    <template v-slot:button>
      <span class="sr-only">Filter</span>
      <IconFilter aria-hidden="true" focusable="false" />
    </template>
    <HeaderDescription />
  </Dropdown>
</template>
