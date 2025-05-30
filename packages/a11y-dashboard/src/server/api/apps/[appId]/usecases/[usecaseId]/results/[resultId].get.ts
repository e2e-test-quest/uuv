import { createError, defineEventHandler, getRouterParam } from 'h3';

export default defineEventHandler(async (event) => {
  const resultId = getRouterParam(event, 'resultId');
  const models = event.context.$models;
  const { Result, AccessibilityIssue } = models;

  try {
    const result = await Result.findByPk(resultId, {
      include: [
        {
          model: AccessibilityIssue,
          as: 'issues'
        }
      ],
    });
    if (!result) {
      throw createError({
        statusCode: 404,
        statusMessage: 'UsecasResulte not found',
      });
    }
    return result;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    throw createError({
      statusCode: 400,
      statusMessage: err.message,
    })
  }
});
