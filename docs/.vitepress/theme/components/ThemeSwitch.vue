<script setup lang="ts">
import { useDark } from '@vueuse/core';
import { computed } from 'vue';

const isDark = useDark();

const buttonText = computed(() => (isDark.value ? '☀️' : '🌙'));
</script>

<template>
  <button
    class="theme-switch"
    :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    @click="isDark = !isDark"
  >
    <span class="theme-icon">{{ buttonText }}</span>
  </button>
</template>

<style scoped>
.theme-switch {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 50%;
  background-color: var(--vp-c-bg);
  cursor: pointer;
  transition: all 0.3s ease;
}

.theme-switch:hover {
  border-color: var(--vp-c-brand-1);
  transform: rotate(15deg);
}

.theme-icon {
  font-size: 18px;
  line-height: 1;
}
</style>
