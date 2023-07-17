import { Flatfile } from '@flatfile/api'

export const companiesSheet: Flatfile.SheetConfig = {
  name: 'Job Codes',
  slug: 'jobs',
  access: [],
  fields: [
    {
      key: 'code',
      label: 'Job Code',
      type: 'string',
      constraints: [
        {
          type: 'required',
        },
        {
          type: 'unique',
        },
      ],
    },
    {
      key: 'title',
      label: 'Job Title',
      type: 'string',
    },
    {
      key: 'department',
      label: 'Department',
      type: 'string',
    },
    {
      key: 'classification',
      label: 'Classification',
      type: 'string',
    },
    {
      key: 'pay_rate_type',
      label: 'Pay Rate Type',
      type: 'string',
    },
  ],
}
