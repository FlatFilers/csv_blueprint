import { FlatfileListener } from "@flatfile/listener";
import { testSheet } from "../../blueprints";
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
        name: "CSV to Blueprint",
        sheets: [testSheet],
      },
    }),
  );
}
