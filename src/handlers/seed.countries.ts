import { Client } from "@flatfile/listener";
import api from "@flatfile/api";
import { countryFlagEmojis } from "../common/emojis";

type CountryData = {
  cca2: string;
  name: {
    common: string;
    official: string;
    nativeName: {
      [key: string]: {
        official: string;
        common: string;
      };
    };
  };
  translations: {
    [key: string]: {
      official: string;
      common: string;
    };
  };
  fifa?: string;
  currencies: Record<string, unknown>;
}[];

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

    const sheets = workbook.data && workbook.data.sheets ? workbook.data.sheets : [];

    // Countries
    const countriesSheet = sheets.find((s) => s.config?.slug?.includes("countries"));
    if (countriesSheet) {
      const countriesId = countriesSheet.id;

      // Fetch data from the external API
      const response = await fetch("https://restcountries.com/v3.1/all");
      const countriesData = (await response.json()) as CountryData;

      const totalCountries = countriesData.length;

      if (totalCountries === 0) {
        console.error("No countries retrieved from the API");
        return;
      }

      const request1 = countriesData.map(async (country) => {
        const countryCurrency = country.currencies ? Object.keys(country.currencies)[0] : "N/A";
        const countryCode = country.cca2;
        const flagEmoji = countryCode ? countryFlagEmojis[countryCode] || "" : "";
        const nativeValue =
          country.name.nativeName && Object.keys(country.name.nativeName).length > 0
            ? country.name.nativeName[Object.keys(country.name.nativeName)[0]]?.official || ""
            : "";

        return {
          code: { value: countryCode },
          name: { value: country.name.common },
          currency: { value: countryCurrency },
          fifa: { value: country.fifa || null },
          flag: { value: flagEmoji },
          native: { value: nativeValue },
        };
      });

      try {
        const request1Data = await Promise.all(request1);
        console.log("Request1Data:", request1Data);
        await api.records.insert(countriesId, request1Data);
        console.log("Data inserted successfully!");
      } catch (error) {
        console.error("Error inserting countries:", error.message);
        console.log(error);
      }
    } else {
      console.log("no countries sheet");
    }
  });
}
