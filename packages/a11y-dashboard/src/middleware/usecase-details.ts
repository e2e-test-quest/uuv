export default defineNuxtRouteMiddleware(async to => {
    const appId: string = to.params.appId as string;
    const usecaseId: string = to.params.usecaseId as string;
    to.meta['app'] = (await useFetch(`/api/apps/${appId}`)).data;
    to.meta['usecase'] = (await useFetch(`/api/apps/${appId}/usecases/${usecaseId}`)).data;
    to.meta['results'] = (await useFetch(`/api/apps/${appId}/usecases/${usecaseId}/results`)).data;
});
  