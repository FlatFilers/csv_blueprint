import { Flatfile } from "@flatfile/api";
import { employeeSheet } from "./sheets/employees";
import { companiesSheet } from "./sheets/companies";
import { locationsSheet } from "./sheets/locations";
import { countriesSheet } from "./sheets/countries";

export const blueprintSheets: Flatfile.SheetConfig[] = [employeeSheet, countriesSheet, companiesSheet, locationsSheet];
