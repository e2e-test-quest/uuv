<script setup lang="ts">
  import type { PropType } from 'vue';
  import type { ResultCount } from "../models";

  createTooltips();
  
  const props = defineProps({
    title:  Object as PropType<string>,
    chips:  Object as PropType<string[]>,
    description:  Object as PropType<string>,
    counter:  Object as PropType<ResultCount>,
    lastRunDate:  Object as PropType<number>,
    openLink:  Object as PropType<string>
  });

</script>

<template>
  <div v-if="props.title" :class="`card border-${getThemeFromResultCount(props.counter)} border-3`">
    <div :class="`card-header rounded-0 bg-${getThemeFromResultCount(props.counter)} text-bg-${getThemeFromResultCount(props.counter)} d-flex flex-row justify-content-between align-items-center`">
      <h3 class="h5 card-title">{{ props.title }}</h3>
      <span class="badge text-bg-secondary p-2" v-for="chip in props.chips" :key="chip">{{chip}}</span>
    </div>
    <div class="card-body">
        <p class="card-text">{{props.description}}</p>
        <div class="d-flex">
          <span class="badge text-bg-danger mx-2 fs-6" v-if="props.counter?.error">{{props.counter?.error}} {{ $t("component.result.count.error") }}</span>
          <span class="badge text-bg-warning mx-2 fs-6" v-if="props.counter?.warning">{{props.counter?.warning}} {{ $t("component.result.count.warning") }}</span>
          <span class="badge text-bg-info mx-2 fs-6"  v-if="props.counter?.notice">{{props.counter?.notice}} {{ $t("component.result.count.notice") }}</span>
        </div>
    </div>          
    <div class="card-footer d-flex justify-content-between align-items-end">
      <span class="small" v-if="props.lastRunDate">{{$t("card.lastRun")}}<span class="fw-bold">{{toFormattedDate(props.lastRunDate)}}</span></span>
      <span class="small fw-bold" v-else>{{$t("card.noRunYet")}}</span>
      <RouterLink v-if="props.openLink" :to="props.openLink" :class="'btn btn-primary btn-sm d-flex'"><i class="bi bi-eye-fill me-1" aria-hidden></i>{{$t("card.actionButton")}}</RouterLink>
    </div>
  </div>
</template>
