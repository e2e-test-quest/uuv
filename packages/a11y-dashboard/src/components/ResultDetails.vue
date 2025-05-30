<script setup lang="ts">
  import { computed } from 'vue';
  import type { PropType, ComputedRef } from 'vue';
  import type { Result, ResultCount } from "../models";

  createTooltips();
  
  const props = defineProps({
    result:  Object as PropType<Result>
  });

  const matrix = {
    'error': 'danger',
    'warning': 'warning',
    'notice': 'info'
  };

  const counter: ComputedRef<ResultCount> = computed(() => computeCounter(props.result!));
</script>

<template>
  <div v-if="props.result && counter">
    <h3 class="mx-4 my-2">{{ $t("component.result.headline") }} : <span class="text-primary">{{ toFormattedDate(result?.date!) }}</span></h3>
    <div class="mx-4" v-if="result?.reference">
      <span class="badge text-bg-secondary fs-6">{{ result?.reference }}</span>
    </div>
    <ul class="nav nav-tabs mt-3" id="resultTab" role="tablist">
      <li class="nav-item ms-5" role="presentation">
        <a class="nav-link active text-danger fw-bold" id="error-tab" data-bs-toggle="tab" data-bs-target="#error-tab-pane" type="button" role="tab" aria-controls="error-tab-pane" aria-selected="true" >{{ $t("component.result.count.error") }} ({{ counter.error }})</a>
      </li>
      <li class="nav-item" role="presentation">
        <a class="nav-link text-warning fw-bold" id="warning-tab" data-bs-toggle="tab" data-bs-target="#warning-tab-pane" type="button" role="tab" aria-controls="warning-tab-pane" aria-selected="false">{{ $t("component.result.count.warning") }}  ({{ counter.warning }})</a>
      </li>
      <li class="nav-item" role="presentation">
        <a class="nav-link text-primary fw-bold" id="notice-tab" data-bs-toggle="tab" data-bs-target="#notice-tab-pane" type="button" role="tab" aria-controls="notice-tab-pane" aria-selected="false">{{ $t("component.result.count.notice") }}  ({{ counter.notice }})</a>
      </li>
    </ul>
    <div id="resultTabContent" class="tab-content m-4">
      <div v-for="(theme, type) in matrix" :class="`tab-pane fade ${type === 'error' ? 'active show': ''}`" :id="`${type}-tab-pane`" role="tabpanel" :aria-labelledby="`${type}-tab`" tabindex="0" :key="type">
        <div class="accordion accordion-flush" :id="`accordion-panel-${type}`">
          <div class="accordion-item my-3" v-for="(issue, index) in filterIssuesByType(props.result.issues, type)" :key="index">
            <h2 class="accordion-header">
              <button :class="`accordion-button border border-${theme} bg-${theme}-subtle fw-bold`" type="button" data-bs-toggle="collapse" :data-bs-target="`#panel-${type}-${index}`" aria-expanded="true" :aria-controls="`#panel-${type}-${index}`">{{ issue.code }} <i class="ms-2 bi bi-info-circle-fill" :aria-label="issue.runnerExtras.description" data-bs-toggle="tooltip" :data-bs-title="issue.runnerExtras.description"></i></button>
            </h2>
            <div :id="`panel-${type}-${index}`" class="accordion-collapse collapse show">
              <div class="accordion-body border">
                <p class="mb-1">{{ issue.message }}</p>
                <div><span class="text-body-secondary"><i class="bi bi-crosshair2 me-1" aria-hidden></i><span class="small me-2 fw-bold">{{ $t("component.result.element") }}</span></span><code class="code border p-1">{{ issue.selector }}</code></div>
                <div><span class="text-body-secondary"><i class="bi bi-lightbulb-fill me-1" aria-hidden></i><span class="small me-2 fw-bold">{{ $t("component.result.fixHelp") }}</span></span> <a :href="issue.runnerExtras.helpUrl" target="_blank">{{ issue.runnerExtras.help }}</a></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
