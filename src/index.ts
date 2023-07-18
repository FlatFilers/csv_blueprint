import { FlatfileListener } from "@flatfile/listener";
import { recordHook } from "@flatfile/plugin-record-hook";
import { xlsxExtractorPlugin } from "@flatfile/plugin-xlsx-extractor";
import { companyValidations, employeeValidations } from "./blueprints";
import { configureSpace } from "./jobs/space:configure";
import { seedCountries } from "./handlers/seed.countries";
import reviewData from "./jobs/workbook:review-data";
import watchList from "./jobs/watchlist";

/**
 * This default export is used by Flatfile to register event handlers for any
 * event that occurs within the Flatfile Platform.
 *
 * @param listener
 */
export default function (listener: FlatfileListener) {
  listener.on("**", console.log);

  listener.use(configureSpace);
  listener.use(seedCountries);
  listener.use(reviewData);
  listener.use(watchList);

  listener.use(recordHook("companies", companyValidations));
  listener.use(recordHook("employees", employeeValidations));

  listener.use(xlsxExtractorPlugin());
}
