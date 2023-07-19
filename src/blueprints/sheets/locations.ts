import { Flatfile } from "@flatfile/api";
import { FlatfileRecord } from "@flatfile/plugin-record-hook";

export const locationsSheet: Flatfile.SheetConfig = {
  name: "📍 Locations",
  slug: "locations",
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

  booleanFields.forEach((field) => {
    let value = record.get(field);

    if (typeof value === "string") {
      value = synonyms[value.toLowerCase()];
      record.set(field, value);
      record.addInfo(field, `Mapped ${value} to boolean`);
    }

    if (typeof value !== "boolean") {
      record.addError(field, "Must be boolean");
    }
  });

  // Return the validated record
  return record;
}

const sheet = locationsSheet;

const booleanFields = sheet.fields.filter((field) => field.type === "boolean").map((field) => field.key);

const synonyms = {
  true: true,
  yes: true,
  y: true,
  on: true,
  false: false,
  no: false,
  n: false,
  off: false,
};
