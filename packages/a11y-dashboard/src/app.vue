<script setup lang="ts">
  import 'bootstrap';
</script>

<template>
  <main>
    <header>
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container">
          <a class="navbar-brand d-flex align-items-center" href="/"><img src="/uuv.png" class="logo me-2"><span class="h2">{{ $t("appName") }}</span></a>
        </div>
      </nav>
    </header>
    <nuxt-page />
  </main>
</template>
