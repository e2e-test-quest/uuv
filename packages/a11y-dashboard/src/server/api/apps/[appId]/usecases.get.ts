import { createError, defineEventHandler, getRouterParam } from 'h3';

export default defineEventHandler(async (event) => {
  const appId = getRouterParam(event, 'appId');
  const models = event.context.$models;
  const { Usecase, Result, AccessibilityIssue } = models;

  try {
    const usecases = await Usecase.findAll({
      where: {
        AppId: appId,
      },

      include: [
        {
          association: 'lastResult',
          model: Result,
          include: [
            {
              model: AccessibilityIssue,
              as: 'issues'
            }
          ],
          required: false
        }
      ]
    });
    return usecases;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    throw createError({
      statusCode: 400,
      statusMessage: err.message,
    })
  }
});
