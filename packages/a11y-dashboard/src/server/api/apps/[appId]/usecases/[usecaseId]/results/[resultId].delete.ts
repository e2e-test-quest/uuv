import { createError, defineEventHandler, getRouterParam, setResponseStatus } from 'h3';

export default defineEventHandler(async (event) => {
  const resultId = getRouterParam(event, 'resultId');
  const models = event.context.$models;
  const { Result } = models;

  try {
    const result = await Result.findByPk(resultId);
    if (!result) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Result not found',
      });
    }
    await result.destroy();
    setResponseStatus(event, 204);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    throw createError({
      statusCode: 400,
      statusMessage: err.message,
    })
  }
});
