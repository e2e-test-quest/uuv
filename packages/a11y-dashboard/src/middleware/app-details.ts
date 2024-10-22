export default defineNuxtRouteMiddleware(async to => {
    const appId: string = to.params.appId as string;
    to.meta['app'] = (await useFetch(`/api/apps/${appId}`)).data;
    to.meta['usecases'] = (await useFetch(`/api/apps/${appId}/usecases`)).data;
});
  