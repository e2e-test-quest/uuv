<script setup lang="ts">
import { reactive } from "vue";
import { useRoute } from "vue-router";
import type { App, ResultCount } from "../models";
import BulkImporter from "../components/BulkImporter.vue";
import CardWithCounter from "../components/CardWithCounter.vue";

definePageMeta({
    middleware: ["app-list"],
});

const route = useRoute();

const state: {
    apps: App[];
} = reactive({
    apps: route.meta["apps"] as App[],
});

function computeAppCounter(app: App): ResultCount {
    return {
        error: app.usecases
            .filter(usecase => usecase.lastResultCounter)
            .map(usecase => usecase.lastResultCounter?.error)
            .reduce((previous, current) => previous + current, 0),
        warning: app.usecases
            .filter(usecase => usecase.lastResultCounter)
            .map(usecase => usecase.lastResultCounter?.warning)
            .reduce((previous, current) => previous + current, 0),
        notice: app.usecases
            .filter(usecase => usecase.lastResultCounter)
            .map(usecase => usecase.lastResultCounter?.notice)
            .reduce((previous, current) => previous + current, 0),
    };
}

function getLastResultDate(app: App): number {
    return Math.max(...app.usecases.filter(usecase => usecase.lastResult?.date).map(usecase => usecase.lastResult.date));
}
</script>

<template>
    <main>
        <div class="container pt-4">
            <div class="border rounded border-2 bg-light mb-2 p-2">
                <h1 class="px-2">
                    <i class="bi bi-universal-access"></i>{{ $t("appList.headline") }}<span class="text-primary">{{ $t("appName") }}</span>
                </h1>
                <p class="p-2 m-0">{{ $t("appList.detailsHeadline") }}</p>
            </div>
            <p class="p-2 m-0 h4">{{ $t("appList.subHeadline") }}</p>
            <div id="appsList" v-masonry transition-duration="0.3s" item-selector=".grid-item" class="grid mt-3">
                <div class="p-2 col-md-4 grid-item">
                    <BulkImporter />
                </div>
                <div v-for="app in state.apps" :key="app.id" class="p-2 col-md-4 grid-item">
                    <template v-for="model in [{ counter: computeAppCounter(app) }]" :key="model">
                        <CardWithCounter
                            :title="app.name"
                            :chips="[`${app.usecases.length} usecase(s)`]"
                            :description="app.description"
                            :counter="model.counter"
                            :last-run-date="getLastResultDate(app)"
                            :open-link="`/apps/${app.id}`"
                        />
                    </template>
                </div>
            </div>
        </div>
    </main>
</template>
