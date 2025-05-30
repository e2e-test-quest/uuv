import { createError, defineEventHandler, getRouterParam } from 'h3';

export default defineEventHandler(async (event) => {
  const usecaseId = getRouterParam(event, 'usecaseId');
  const models = event.context.$models;
  const { Result } = models;

  try {
    const results = await Result.findAll({
      order: [
        ['date', 'DESC']
      ],
      include: ['issues'],
      where: {
        UsecaseId: usecaseId,
      }
    });
    return results;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    throw createError({
      statusCode: 400,
      statusMessage: err.message,
    })
  }
});
