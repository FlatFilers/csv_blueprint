import { FlatfileListener } from "@flatfile/listener";
import { recordHook } from "@flatfile/plugin-record-hook";
import { employeeValidations } from "./blueprints";
import { simpleSpaceSetup } from "./plugins/simple.space.setup";
import { employeeSheetMini } from "./blueprints/sheets/employees_mini";
import generateIds from "./jobs/generateIds";

/**
 * This default export is used by Flatfile to register event handlers for any
 * event that occurs within the Flatfile Platform.
 *
 * @param listener
 */
export default function (listener: FlatfileListener) {
  listener.use(
    simpleSpaceSetup({
      space: {
        metadata: {
          sidebarConfig: {
            showDataChecklist: false,
            showSidebar: false,
          },
        },
      },
      workbook: {
        name: "Employee Import",
        sheets: [employeeSheetMini],
        actions: [
          {
            operation: "review-data",
            mode: "foreground",
            label: "Import Data",
            type: "string",
            description:
              "Once you click continue, your data will be imported to Second Street Labs.",
            primary: true,
          },
        ],
      },
    }),
  );

  listener.use(generateIds);
  listener.use(recordHook("employees", employeeValidations));
}
