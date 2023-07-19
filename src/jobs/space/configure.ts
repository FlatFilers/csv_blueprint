import { FlatfileListener } from "@flatfile/listener";
import {
  companiesSheet,
  countriesSheet,
  employeeSheet,
  locationsSheet,
} from "../../blueprints";
import { simpleSpaceSetup } from "../../plugins/simple.space.setup";

/**
 * Configures a Flatfile space with an employee registry
 * workbook, sheets and actions.
 *
 * @param listener The FlatfileListener instance
 *
 * @returns void
 */
export function configureSpace(listener: FlatfileListener) {
  listener.use(
    simpleSpaceSetup({
      workbook: {
        name: "Employee Registry",
        sheets: [
          employeeSheet,
          companiesSheet,
          locationsSheet,
          countriesSheet,
        ],
        actions: [
          {
            operation: "review-data",
            mode: "foreground",
            label: "Request Review",
            type: "string",
            description:
              "A representative from Acme Inc. will review your data.",
            primary: true,
          },
          {
            operation: "downloadExcelWorkbook",
            mode: "foreground",
            label: "Download Excel Workbook",
            description: "Downloads Excel Workbook of Data",
            primary: false,
          },
        ],
      },
    }),
  );
}
