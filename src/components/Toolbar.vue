<template>
  <section class="toolbar flex item-center gap-6">
    <slot />
  </section>
</template>

<style>
.toolbar {
  position: fixed;
  top: 3rem;
  left: 50%;
  height: 2rem;
  transform: translateX(-50%);
  z-index: 99;
  margin: 0.5rem 0;
  font-size: 0.875rem;
}

@media (min-width: 1280px) {

  .toolbar {
    top: 1rem;
    left: auto;
    right: 1rem;
    margin: 0;
    width: auto;
    height: auto;
    transform: none;
    padding: 0.75rem;
    background: var(--bg);
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: var(--border-rounded);
    font-size: 1rem;
  }
}

</style>