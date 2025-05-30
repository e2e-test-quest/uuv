import { createError, defineEventHandler, getRouterParam, setResponseStatus } from 'h3';

export default defineEventHandler(async (event) => {
  const appId = getRouterParam(event, 'appId');
  const usecaseId = getRouterParam(event, 'usecaseId');
  const models = event.context.$models;
  const { Usecase } = models;

  try {
    const usecase = await Usecase.findOne({ 
      where: {
        id: usecaseId,
        AppId: appId,
      }
    });
    if (!usecase) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Usecase not found',
      });
    }
    await usecase.destroy();
    setResponseStatus(event, 204);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    throw createError({
      statusCode: 400,
      statusMessage: err.message,
    })
  }
});
