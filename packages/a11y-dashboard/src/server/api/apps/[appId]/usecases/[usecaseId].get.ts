import { createError, defineEventHandler, getRouterParam } from 'h3';

export default defineEventHandler(async (event) => {
  const appId = getRouterParam(event, 'appId');
  const usecaseId = getRouterParam(event, 'usecaseId');
  const models = event.context.$models;
  const { Usecase, AccessibilityIssue } = models;

  try {
    const usecase = await Usecase.findOne({ 
      where: {
        id: usecaseId,
        AppId: appId,
      },
      include: [
        {
          association: 'lastResult',
          include: [
            {
              model: AccessibilityIssue,
              as: 'issues'
            }
          ],
          required: false
        },
        {
          association: 'results',
          order: [
            ['date', 'DESC']
          ],
          separate: true,
          include: [
            {
              model: AccessibilityIssue,
              as: 'issues'
            }
          ]
        }
      ]
    });
    if (!usecase) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Usecase not found',
      });
    }
    return usecase;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    throw createError({
      statusCode: 400,
      statusMessage: err.message,
    })
  }
});
