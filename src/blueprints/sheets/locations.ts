import { Flatfile } from "@flatfile/api";
import { FlatfileRecord } from "@flatfile/plugin-record-hook";

export const locationsSheet: Flatfile.SheetConfig = {
  name: "Locations",
  slug: "locations",
  access: [],
  fields: [
    {
      key: "id",
      label: "Location ID",
      type: "string",
      constraints: [{ type: "unique" }],
    },
    {
      key: "name",
      label: "Location Name",
      type: "string",
      constraints: [{ type: "unique" }],
    },
    {
      key: "address",
      label: "Location Address",
      type: "string",
    },
    {
      key: "hours",
      label: "Location Hours",
      type: "number",
    },
    {
      key: "count",
      label: "Location Desk Count",
      type: "number",
    },
    {
      key: "spaces",
      label: "Location Parking Spaces",
      type: "number",
    },
    {
      key: "security",
      label: "Has Security?",
      type: "boolean",
    },
  ],
};

//offices for each company - address (Denver,CO), hours, desk count, parking spaces, has security (boolean)

// Hooks

export function locationValidations(record: FlatfileRecord) {
  // Validate the input record parameter
  if (!record || typeof record !== "object") {
    console.error("Invalid record input. Expecting a valid record object.");
    return record;
  }

  // Return the validated record
  return record;
}
