import { FlatfileListener } from "@flatfile/listener";
import api, { Flatfile } from "@flatfile/api";
import { companiesSheet, countriesSheet, employeeSheet, locationsSheet } from "../blueprints";

export default function reviewData(listener: FlatfileListener) {
  listener.on("job:ready", { job: "workbook:review-data" }, async (event) => {
    const { spaceId, environmentId, jobId } = event.context;

    await api.jobs.ack(jobId, { info: "One moment...", progress: 10 });

    const employeeWithWatchlist: Flatfile.SheetConfig = {
      ...employeeSheet,
      fields: [{ key: "watchlist-report", label: "Watchlist Report", type: "string" }, ...employeeSheet.fields],
    };
    let workbookId;
    try {
      // Create a new workbook
      const createWorkbook = await api.workbooks.create({
        spaceId: spaceId,
        environmentId: environmentId,
        name: "Review " + new Date().toISOString(),
        sheets: [employeeWithWatchlist, countriesSheet, companiesSheet, locationsSheet],
        actions: [
          {
            operation: "submit-data",
            mode: "foreground",
            label: "Load to Database",
            type: "string",
            description: "Data will egress to destination database",
            primary: true,
          },
          {
            operation: "return-data",
            mode: "foreground",
            label: "Return Errors for Client Review",
            type: "string",
            description: "Records with errors will be returned to the customer for review.",
            primary: false,
          },
        ],
      });

      workbookId = createWorkbook.data?.id;

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

    await api.jobs.complete(jobId, {
      outcome: {
        message: "Your data has been submitted for review successfully.",
      },
    });
  });
}
