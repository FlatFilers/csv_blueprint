import { Client } from "@flatfile/listener";
import api from "@flatfile/api";
import { countries } from "../blueprints/sheets/countries";

export function seedCountries(listener: Client) {
  // SEED THE WORKBOOK WITH DATA
  listener.on("workbook:created", async (event) => {
    if (!event.context || !event.context.workbookId) {
      console.error("Event context or workbookId missing");
      return;
    }

    const workbookId = event.context.workbookId;
    let workbook;
    try {
      workbook = await api.workbooks.get(workbookId);
    } catch (error) {
      console.error("Error getting workbook:", error.message);
      return;
    }

    const workbookName = workbook.data && workbook.data.name ? workbook.data.name : "";

    if (workbookName.includes("Data Import Workbook")) {
      const sheets = workbook.data && workbook.data.sheets ? workbook.data.sheets : [];

      // Countries
      const countriesSheet = sheets.find((s) => s.config.slug.includes("countries"));
      if (countriesSheet && Array.isArray(countries)) {
        const countriesId = countriesSheet.id;
        const request1 = countries.map(({ countryCode, countryName, countryCurrency }) => ({
          code: { value: countryCode },
          name: { value: countryName },
          currency: { value: countryCurrency },
        }));

        try {
          await api.records.insert(countriesId, request1);
        } catch (error) {
          console.error("Error inserting companies:", error.message);
        }
      }
    }
  });
}
