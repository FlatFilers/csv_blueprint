import { Flatfile } from '@flatfile/api'

export const locationsSheet: Flatfile.SheetConfig = {
  name: 'Locations',
  slug: 'locations',
  access: [],
  fields: [
    {
      key: 'id',
      label: 'Location ID',
      type: 'string',
      constraints: [{ type: 'unique' }],
    },
    {
      key: 'name',
      label: 'Location Name',
      type: 'string',
      constraints: [{ type: 'unique' }],
    },
  ],
}
