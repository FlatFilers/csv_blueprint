import { Flatfile } from '@flatfile/api'
import { workerDataSheet } from '../sheets/workerData'
import { companiesSheet } from '../sheets/companies'
import { locationsSheet } from '../sheets/locations'
import { departmentsSheet } from '../sheets/departments'

export const blueprintSheets: Flatfile.SheetConfig[] = [
  workerDataSheet,
  companiesSheet,
  locationsSheet,
  departmentsSheet,
]
