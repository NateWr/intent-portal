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

.count-showing {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 1rem;
  font-size: 0.875rem;
  background: var(--red);
  color: white;
  border-radius: var(--border-rounded);
  white-space: nowrap;
}

@media (min-width: 1280px) {

  .toolbar {
    top: 0.75rem;
    left: auto;
    right: 1rem;
    width: auto;
    height: auto;
    transform: none;
    padding: 0.75rem;
    background: white;
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: var(--border-rounded);
    font-size: 1rem;
  }

  .count-showing {
    color: black;
    background: transparent;
  }
}

</style>