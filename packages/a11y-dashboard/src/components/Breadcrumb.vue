<script setup lang="ts">
  import type { PropType } from 'vue';
  
  const props = defineProps({
    items:  Object as PropType<{label: string, url: string}[]>
  });

  function isLastItem(index: number): boolean {
    return index === props.items!.length - 1;
  }

</script>

<template>
  <nav style="--bs-breadcrumb-divider: url(&#34;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='%236c757d'/%3E%3C/svg%3E&#34;);" class="py-3">
    <ol class="breadcrumb m-0">
      <li v-for="(item, index) in props.items" :key="index" :aria-current="isLastItem(index) ? 'page' : undefined" :class="`breadcrumb-item ${isLastItem(index) ? 'active' : ''}`"><span v-if="isLastItem(index)">{{item.label}}</span><RouterLink :to="item.url" v-else>{{item.label}}</RouterLink></li>
    </ol>
  </nav>
</template>
