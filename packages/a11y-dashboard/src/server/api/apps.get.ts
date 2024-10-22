import { createError, defineEventHandler, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  const q = getQuery(event);
  const models = event.context.$models;
  const { App, AccessibilityIssue } = models;

  try {
    const apps = await App.findAll({
      include: [
        {
          association: 'usecases',
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
          ],
          required: false
        }
      ]
    });
    return apps;
  } catch (err: any) {
    throw createError({
      statusCode: 400,
      statusMessage: err.message,
    })
  }
});
