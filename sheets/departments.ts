import { Flatfile } from '@flatfile/api'

export const departmentsSheet: Flatfile.SheetConfig = {
  name: 'Departments',
  slug: 'departments',
  access: [],
  fields: [
    {
      key: 'id',
      label: 'Department ID',
      type: 'string',
      constraints: [{ type: 'unique' }],
    },
    {
      key: 'name',
      label: 'Department Name',
      type: 'string',
      constraints: [{ type: 'unique' }],
    },
  ],
}
