import { createError, defineEventHandler, readBody, setResponseStatus, getRouterParam } from 'h3';

export default defineEventHandler(async (event) => {
  const appId = getRouterParam(event, 'appId');
  const body = await readBody(event);
  const models = event.context.$models;
  const { Usecase } = models;

  try {
    const usecaseData = await Usecase.create({
      ...body,
      AppId: appId
    });
    setResponseStatus(event, 201);
    return usecaseData;
  } catch (err: any) {
    throw createError({
      statusCode: 400,
      statusMessage: err.message,
    })
  }
});
