import { createError, defineEventHandler, readBody, setResponseStatus, getRouterParam } from 'h3';

export default defineEventHandler(async (event) => {
  const usecaseId = getRouterParam(event, 'usecaseId');
  const body = await readBody(event);
  const models = event.context.$models;
  const { Result, AccessibilityIssue } = models;
  const transaction = await Result.sequelize.transaction();

  try {
    const { issues, ...resultData } = body;

    // Create the Result
    const result = await Result.create({
      UsecaseId: usecaseId,
      ...resultData
    }, { transaction });

    // If there are issues, create them and associate them with the Result
    if (issues && issues.length > 0) {
      const accessibilityIssues = await AccessibilityIssue.bulkCreate(
        issues.map(issue => ({
          ...issue,
          ResultId: result.id,
        })), { transaction }
      );
      result.setDataValue('issues', accessibilityIssues);
    }

    // Commit the transaction after all operations succeed
    await transaction.commit();

    setResponseStatus(event, 201);
    return result;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    await transaction.rollback();
    throw createError({
      statusCode: 400,
      statusMessage: err.message,
    })
  }
});
