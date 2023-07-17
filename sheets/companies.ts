import { Flatfile } from '@flatfile/api'

export const companiesSheet: Flatfile.SheetConfig = {
  name: 'Companies',
  slug: 'companies',
  readonly: true,
  access: [],
  fields: [
    {
      key: 'id',
      label: 'Company ID',
      type: 'string',
      constraints: [{ type: 'unique' }],
    },
    {
      key: 'name',
      label: 'Company Name',
      type: 'string',
      constraints: [{ type: 'unique' }],
    },
  ],
}
