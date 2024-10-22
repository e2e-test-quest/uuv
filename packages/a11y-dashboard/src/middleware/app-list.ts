export default defineNuxtRouteMiddleware(async to => {
    to.meta['apps'] = (await useFetch('/api/apps')).data;
});
  