import { parseFullName } from "parse-full-name";

// Helper function to trim leading/trailing spaces and replace multiple spaces with single space
function cleanName(name) {
  if (name === null || name === undefined) {
    return "";
  }
  return name.trim().replace(/\s+/g, " ");
}

// Helper function to convert a string to Title Case (i.e., first letter of each word is capitalized)
function toTitleCase(name) {
  if (name === null || name === undefined) {
    return "";
  }
  return name.replace(/\w\S*/g, (word) => {
    return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
  });
}

// Function to concatenate first, middle and last names into a full name
export function concatenateNames(record) {
  try {
    console.log("Starting name concatenation...");

    // Retrieving names and manager info from the record
    console.log("Retrieving names and manager info...");
    const full = record.get("full");
    let first = record.get("first");
    let middle = record.get("middle");
    let last = record.get("last");

    // Clean the names by trimming spaces and replacing multiple spaces with a single space
    console.log("Cleaning names...");
    first = cleanName(first);
    middle = cleanName(middle);
    last = cleanName(last);

    // Concatenating names if full name is missing and both first and last names are present
    console.log("Concatenating names...");
    if ((full === null || full === "") && first !== null && first !== "" && last !== null && last !== "") {
      record.set("Legal_Full_Name", `${first} ${last}`);
      if (middle !== null && middle !== "") {
        record.set("Legal_Full_Name", `${first} ${middle} ${last}`);
      }
    }

    // Normalize the full name to title case
    console.log("Normalizing full name...");
    const normalizedFullName = toTitleCase(record.get("full"));
    record.set("full", normalizedFullName);

    console.log("Finished name concatenation.");
  } catch (error) {
    console.log("Error occurred during name concatenation and manager name:", error);
  }
}

// Function to split a full name into first, middle, and last names
export function splitFullName(record) {
  try {
    console.log("Starting name splitting...");
    const full = record.get("full");

    if (full !== null && full !== "") {
      // Parsing the full name using parse-full-name library
      console.log("Parsing full name...");
      const parsedName = parseFullName(full);

      const firstName = parsedName.first;
      const lastName = parsedName.last;
      // Parsing might yield an array of middle names, join them with spaces if so
      const middleName = Array.isArray(parsedName.middle) ? parsedName.middle.join(" ") : parsedName.middle;

      // Setting the name fields with the parsed name components
      console.log("Setting name fields...");
      record.set("first", firstName);
      record.set("last", lastName);
      record.set("middle", middleName);
    }

    console.log("Finished name splitting.");
  } catch (error) {
    console.log("Error occurred during name splitting:", error);
  }
}
