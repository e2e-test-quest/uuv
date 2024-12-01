import { createError, defineEventHandler, readBody, setResponseStatus } from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const models = event.context.$models;
  const { App } = models;

  try {
    const appData = await App.create(body);
    setResponseStatus(event, 201);
    return appData;
  } catch (err: any) {
    throw createError({
      statusCode: 400,
      statusMessage: err.message,
    })
  }
});
