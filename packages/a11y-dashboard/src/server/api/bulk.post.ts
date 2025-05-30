import { createError, defineEventHandler, readBody, setResponseStatus } from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const models = event.context.$models;
  const { App, Usecase, Result, AccessibilityIssue } = models;

  const transaction = await App.sequelize.transaction(); // Start a transaction
    try {
      console.log("before app creation", body);

      // 1. Find or Create the App based on the App name
      const [targetApp] = await App.findOrCreate({
          where: { name: body.app.name },
          defaults: {
              description: body.app.description
          },
          transaction
      });

      console.log("after app creation");

      // Iterate over usecases in the app
      for (const usecaseInput of body.app.usecases) {

          // 2. Find or Create the Usecase based on AppId, Usecase Name, and Location
          const [usecase] = await Usecase.findOrCreate({
              where: {
                  AppId: targetApp.id,
                  name: usecaseInput.name,
                  locationFile: usecaseInput.location.file
              },
              defaults: {
                  script: usecaseInput.script
              },
              transaction
          });

          // 3. Create the Result for this usecase
          const result = await Result.create({
              UsecaseId: usecase.id,
              reference: usecaseInput.result.reference,
              date: usecaseInput.result.date,
          }, { transaction });

          // 4. Create AccessibilityIssues associated with the Result
          const issues = usecaseInput.result.issues.map(issue => ({
              ResultId: result.id,
              type: issue.type,
              code: issue.code,
              message: issue.message,
              selector: issue.selector,
              runnerExtrasDescription: issue.runnerExtras.description,
              runnerExtrasImpact: issue.runnerExtras.impact,
              runnerExtrasHelp: issue.runnerExtras.help,
              runnerExtrasHelpUrl: issue.runnerExtras.helpUrl,
          }));

          await AccessibilityIssue.bulkCreate(issues, { transaction });
      }

      // Commit the transaction after all operations succeed
      await transaction.commit();

      // Return success response
      setResponseStatus(event, 201);
      return { message: 'Bulk import successful' };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
      // Rollback the transaction in case of an error
      await transaction.rollback();
      throw createError({
        statusCode: 500,
        statusMessage: err.message,
      });
  }
});
