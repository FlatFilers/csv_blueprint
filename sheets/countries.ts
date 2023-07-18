import { Flatfile } from '@flatfile/api'

export const countriesSheet: Flatfile.SheetConfig = {
  name: 'Countries🔄',
  slug: 'countries',
  readonly: true,
  access: [],
  fields: [
    {
      key: 'code',
      label: 'Country Code',
      type: 'string',
    },
    {
      key: 'name',
      label: 'Country Name',
      type: 'string',
    },
    {
      key: 'currency',
      label: 'Country Currency',
      type: 'string',
    },
  ],
}

//Need to update based on API

export const countries = [
  {
    countryCode: 'GlobalTech Solutions',
    countryName: 'Your_Company_ID',
    countryCurrency: 'currency',
  },
]
