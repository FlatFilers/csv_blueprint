import { FlatfileListener } from "@flatfile/listener";
import api from "@flatfile/api";
import { companiesSheet, countriesSheet, employeeSheet, locationsSheet } from "../blueprints";

export function configureSpace(listener: FlatfileListener) {
  listener.filter({ job: "space:configure" }, (configure) => {
    configure.on("job:ready", async (event) => {
      const { spaceId, environmentId, jobId } = event.context;

      await api.jobs.ack(jobId, { info: "Getting started", progress: 10 });

      try {
        // Create a new workbook
        const createWorkbook = await api.workbooks.create({
          spaceId: spaceId,
          environmentId: environmentId,
          name: "Employee Registry Onboarding",
          sheets: [employeeSheet, companiesSheet, locationsSheet, countriesSheet],
          actions: [
            {
              operation: "review-data",
              mode: "foreground",
              label: "Request Review",
              type: "string",
              description: "A representative from Acme Inc. will review your data.",
              primary: true,
            },
          ],
        });

        const workbookId = createWorkbook.data?.id;

        if (workbookId) {
          await api.spaces.update(spaceId, {
            environmentId: environmentId,
            primaryWorkbookId: workbookId,
          });
        }
      } catch (error) {
        console.log("Error creating workbook:", error);
        await api.jobs.fail(jobId, {
          info: String(error),
        });
        return;
      }

      await api.jobs.complete(jobId, { info: "Successfully configured!" });
    });

    configure.on("job:failed", async (event: any) => {
      console.log("Space creation has failed: " + JSON.stringify(event));
    });

    configure.on("job:completed", async (event: any) => {
      console.log("Space creation has completed: " + JSON.stringify(event));
    });
  });
}
