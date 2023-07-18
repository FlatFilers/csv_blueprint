import { Flatfile } from "@flatfile/api";
import { vlookup } from "../../common/vlookup";
import { FlatfileRecord } from "@flatfile/plugin-record-hook";

export const companiesSheet: Flatfile.SheetConfig = {
  name: "🏢 Companies",
  slug: "companies",
  fields: [
    {
      key: "id",
      label: "Company ID",
      type: "string",
      constraints: [
        {
          type: "required",
        },
        {
          type: "unique",
        },
      ],
    },
    {
      key: "name",
      label: "Company Name",
      type: "string",
      constraints: [
        {
          type: "required",
        },
        {
          type: "unique",
        },
      ],
    },
    {
      key: "domain",
      label: "Company Domain",
      type: "string",
      description:
        "This field is used to capture the primary domain name of a company's website. It should be entered in the format 'companyname.com'. The domain name provides a unique identifier for the company on the internet and is used for the company's website and email addresses. Please ensure to enter the correct and full domain name, including any necessary top-level domain (like .com, .org, .net, etc.). Note that it should not include 'www' or 'http://'.",
    },
    {
      key: "count",
      label: "Employee Count",
      type: "number",
    },
    {
      key: "country",
      label: "Country",
      type: "reference",
      constraints: [{ type: "required" }],
      config: {
        ref: "countries",
        key: "name",
        relationship: "has-one",
      },
    },
    {
      key: "currency",
      label: "Currency",
      type: "string",
      readonly: true,
    },
  ],
};

// Hooks

export function companyValidations(record: FlatfileRecord) {
  // Validate the input record parameter
  if (!record || typeof record !== "object") {
    console.error("Invalid record input. Expecting a valid record object.");
    throw new Error("Invalid record input. Expecting a valid record object.");
  }

  const domain = record.get("domain");

  if (domain) {
    try {
      // Convert the domain to lowercase for uniformity
      record.compute(
        "domain",
        (domain: string | null | undefined) => (domain ? domain.toLowerCase() : domain),
        "Domain was converted to lowercase.",
      );

      // Validate the domain format using a regular expression
      const domainIsValid = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/.test(domain.toLowerCase());

      // If the domain format is invalid, add an error to the record
      if (!domainIsValid) {
        record.addError("domain", "Invalid domain.");
      }
    } catch (error) {
      console.error("Validation Error: Domain must be in a valid format:", error);
    }
  }

  try {
    vlookup(record, "country", "currency", "currency");
  } catch (error) {
    console.error("Error during vlookup:", error);
  }

  // Return the validated record
  return record;
}
