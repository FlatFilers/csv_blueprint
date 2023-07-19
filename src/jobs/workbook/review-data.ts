import { FlatfileListener } from "@flatfile/listener";
import api, { Flatfile } from "@flatfile/api";
import {
  companiesSheet,
  countriesSheet,
  employeeSheet,
  locationsSheet,
} from "../../blueprints";
import { jobHandler } from "../../plugins/job.handler";

export default function reviewData(listener: FlatfileListener) {
  listener.use(
    jobHandler("workbook:review-data", async (event) => {
      const { spaceId, environmentId } = event.context;

      const employeeWithWatchlist: Flatfile.SheetConfig = {
        ...employeeSheet,
        fields: [
          {
            key: "watchlist-report",
            label: "Watchlist Report",
            type: "string",
          },
          ...employeeSheet.fields,
        ],
        actions: [
          {
            operation: "check-watchlist",
            mode: "foreground",
            label: "👀 Check Watchlist",
            description: "Validates data against the 'Watchlist'",
            primary: true,
          },
          ...employeeSheet.actions,
        ],
      };

      const createWorkbook = await api.workbooks.create({
        spaceId: spaceId,
        environmentId: environmentId,
        name: "Review " + new Date().toISOString(),
        sheets: [
          employeeWithWatchlist,
          countriesSheet,
          companiesSheet,
          locationsSheet,
        ],
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
            description:
              "Records with errors will be returned to the customer for review.",
            primary: false,
          },
        ],
      });
    }),
  );
}
