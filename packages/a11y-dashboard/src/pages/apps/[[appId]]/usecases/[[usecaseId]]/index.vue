<script setup lang="ts">
  import type { ComputedRef } from 'vue';
  import { reactive, computed } from 'vue';
  import 'chartjs-adapter-moment';
  import {
    Chart as ChartJS,
    TimeScale,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  } from 'chart.js';
  import type {
    ChartData,
    Point,
    ChartOptions
  } from 'chart.js';
  import { Line } from 'vue-chartjs';
  import { DEFAULT_DATE_FORMAT } from '../../../../../models';
  import type { App, Result, Usecase } from '../../../../../models';
  import { useRoute } from 'vue-router';

  definePageMeta({
    middleware: [
      'usecase-details'
    ]
  });

  ChartJS.register(
    TimeScale,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const route = useRoute();
  
  const state: {
    app?: App,
    usecase?: Usecase,
    results: Result[],
    selectedIndex?: number
  } = reactive({
    app: route.meta['app'] as App,
    usecase: route.meta['usecase'] as Usecase,
    results: route.meta['results'] as Result[]
  });

  const breadcrumbItems = computed(() => {
    const items =  [
      {label: 'Homepage', url: '/'}
    ];
    if (state.app) {
      items.push({label: state.app.name, url: `/apps/${state.app.id}`});      
      if (state.usecase) {
        items.push({label: state.usecase.name, url: `/apps/${state.app.id}/usecases/${state.usecase.id}`});
      }
    }
    return items;
  });

  if (state.results.length) {
    selectResultIndex(0);
  }

  const diagramOptions: ChartOptions<"line"> = {
    maintainAspectRatio: true,
    aspectRatio: 3,
    scales: {
      x: {
        type: 'time',
        title: {
          display: true,
          text: 'Date'
        },
        time:{
          unit: 'day',
          tooltipFormat: DEFAULT_DATE_FORMAT
        }
      },
      y: {
        title: {
          display: true,
          text: 'value'
        }
      }
    }
  };

  const diagramData: ComputedRef<ChartData<"line", (number | Point | null)[], unknown>> = computed(() => {
    const errors = state.results.map(result => {return { x:result.date*1000, y: computeCounter(result).error}});
    const warnings = state.results.map(result => {return { x:result.date*1000, y: computeCounter(result).warning}});
    const notices = state.results.map(result => {return { x:result.date*1000, y: computeCounter(result).notice}});
    return {
      datasets: [
        {
          label: 'Errors',
          backgroundColor: 'rgb(220, 53, 69)',
          borderColor: 'rgb(220, 53, 69)',
          data: errors
        },
        {
          label: 'Warnings',
          backgroundColor: 'rgb(253, 126, 20)',
          borderColor: 'rgb(253, 126, 20)',
          data: warnings
        },
        {
          label: 'Notices',
          backgroundColor: 'rgb(13, 110, 253)',
          borderColor: 'rgb(13, 110, 253)',
          data: notices
        }
      ]
    };
  });

  const selectResult: ComputedRef<Result | undefined> = computed(() => {
    return state.selectedIndex !== undefined ? state.results[state.selectedIndex] : undefined;
  })

  function selectResultIndex(index: number) {
    state.selectedIndex = index;
  }
</script>

<template>
  <main>
    <div class="container">
      <Breadcrumb :items="breadcrumbItems"></Breadcrumb>
      <div class="border rounded border-2 bg-light mb-2 p-2">
        <h1 class="px-2"><i class="bi bi-window-fullscreen text-body-secondary" aria-hidden="true"></i> {{ $t("usecaseDetails.headline") }} <span class="text-primary">{{ state.app?.name }}</span></h1>
        <h2 class="px-2"><i class="bi bi-ui-checks text-body-secondary" aria-hidden="true"></i> {{ $t("usecaseDetails.subHeadline") }} <span class="text-primary">{{ state.usecase?.name }}</span></h2>
      </div>
      <div v-if="state.results && state.results.length">
        <Line :data="diagramData" :options="diagramOptions" class="result-evolution border rounded border-2 mb-3"></Line>
        <div class="d-flex flex-row align-items-start">
          <div class="col-3">
            <div class="border rounded border-2 me-2">
              <p class="bg-primary-subtle text-dark rounded-top px-3 py-2 m-0">{{ $t("component.result.resultSelection") }}</p>
              <div class="list-group list-group-flush border-top">
                <button type="button" v-for="(result, index) in state.results" :class="`list-group-item list-group-item-action ${result.id === selectResult?.id ? 'active' : ''}`" v-on:click="selectResultIndex(index)" :key="result.id">{{toFormattedDate(result.date)}}</button>
              </div>
            </div>
          </div>
          <div class="col-9">
            <ResultDetails v-if="selectResult" :result="selectResult" class="ms-2 mb-4 border rounded border-2"></ResultDetails>
          </div>
        </div>
      </div>
      <p v-else class="display-6 m-5 text-center">{{ $t("general.noContentFound") }}</p>
    </div>
  </main>
</template>

<style scoped>
  .result-evolution {
    height: 400px !important;
  }
</style>