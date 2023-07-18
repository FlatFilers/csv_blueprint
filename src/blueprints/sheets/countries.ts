import { Flatfile } from "@flatfile/api";

export const countriesSheet: Flatfile.SheetConfig = {
  name: "🌎 Countries",
  slug: "countries",
  readonly: true,
  access: [],
  fields: [
    {
      key: "code",
      label: "Country Code",
      type: "string",
    },
    {
      key: "name",
      label: "Country Name",
      type: "string",
    },
    {
      key: "currency",
      label: "Country Currency",
      type: "string",
    },
    {
      key: "fifa",
      label: "Fifa",
      type: "string",
    },
    {
      key: "flag",
      label: "Country Flag",
      type: "string",
    },
    {
      key: "native",
      label: "Country Native Language",
      type: "string",
    },
  ],
};
