<script setup lang="ts">
  import { reactive, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import type { App, Usecase } from '../../../models';

  definePageMeta({
    middleware: [
      'app-details'
    ]
  });

  const route = useRoute();
  const appId: string = route.params.appId as string;
  
  const state: {
    app?: App;
    usecases: Usecase[]
  } = reactive({
    app: route.meta['app'] as App,
    usecases: route.meta['usecases'] as Usecase[]
  });

  const breadcrumbItems = computed(() => {
    const items =  [
      {label: 'Homepage', url: '/'}
    ];
    if (state.app) {
      items.push({label: state.app.name, url: `/apps/${state.app.id}`});
    }
    return items;
  });
</script>

<template>
  <main>
    <div class="container">
      <Breadcrumb :items="breadcrumbItems"></Breadcrumb>
      <div class="border rounded border-2 bg-light mb-2 p-2">
        <h1 class="px-2"><i class="bi bi-window-fullscreen text-body-secondary" aria-hidden="true"></i> {{ $t("usecaseDetails.headline") }} <span class="text-primary">{{ state.app?.name }}</span></h1>
      </div>
      <p class="p-2 m-0 h4">{{ $t("appDetails.detailsHeadline") }}</p>
      <div class="grid mt-3" v-masonry="usecaseList" transition-duration="0.3s" item-selector=".grid-item">
        <div class="p-2 col-md-4 grid-item" v-for="usecase in state.usecases" :key="usecase.id">
          <CardWithCounter
            :title="usecase.name"
            :description="usecase.script"
            :counter="usecase.lastResultCounter"
            :last-run-date="usecase.lastResult?.date"
            :open-link="`/apps/${appId}/usecases/${usecase.id}`"
          >
          </CardWithCounter>
        </div>
      </div>
    </div>
  </main>
</template>
