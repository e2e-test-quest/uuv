<script setup lang="ts">
  import { reactive } from 'vue';

  createTooltips();
  
  const state: {
    status : 'notStarted' | 'loading' | 'error' | 'success';
    selectedFile ?: File;
  } = reactive({
    status: 'notStarted'
  });

  function onFileChanged($event: Event) {
    const target = $event.target as HTMLInputElement;
    if (target && target.files) {
      state.selectedFile = target.files[0];
    }
  }

  function notifyResult(status) {
    setTimeout(() => { state.status = status; }, 1000);
  }

  async function bulkImport() {
    state.status = 'loading';
    const bulkImportContent = await state.selectedFile?.text();
    useFetch('/api/bulk', {
        body: bulkImportContent,
        method: 'post',
        headers: {
            "Content-Type": "application/json",
        }
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .then((response: any) => {
      if (response?.message === 'Bulk import successful' && !response?.error) {
        notifyResult('success');
      } else {
        notifyResult('error');
      }
    })
    .catch(() => {
      notifyResult('error');
    });
  }

</script>

<template>
  <div class="card border-dark border-3">
    <div class="card-body d-flex flex-column align-items-center pt-0">
        <i class="bi bi-file-earmark-arrow-up-fill fs-1 text-dark" aria-hidden="true"></i>
        <div class="alert alert-success align-self-stretch" role="alert" v-if="state.status === 'success'"><i class="bi bi-check-circle-fill me-2" aria-hidden="true"></i>{{$t("component.bulkImporter.success")}}</div>
        <div class="alert alert-danger align-self-stretch" role="alert" v-if="state.status === 'error'"><i class="bi bi-exclamation-circle-fill me-2" aria-hidden="true"></i>{{$t("component.bulkImporter.error")}}</div>
        <p class="card-text text-justify">{{$t("component.bulkImporter.tips")}}</p>
        <form @submit.prevent="bulkImport">
          <div class="input-group">
            <input type="file"
              class="form-control"
              aria-describedby="selectedFileToImport"
              :aria-label="$t('component.bulkImporter.importFileLabel')"
              @change="onFileChanged($event)"
            >
            <button 
              class="btn btn-primary"
              type="submit"
              id="selectedFileToImport"
              :disabled="!state.selectedFile || state.status === 'loading'">
                <div class="spinner-border spinner-border-sm me-2" role="status" v-if="state.status === 'loading'">
                  <span class="visually-hidden">{{$t("component.bulkImporter.loading")}}</span>
                </div>{{$t("component.bulkImporter.importButton")}}</button>
          </div>
        </form>
    </div>
  </div>
</template>
