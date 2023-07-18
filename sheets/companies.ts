import { Flatfile } from '@flatfile/api'
import { vlookup } from '../common/vlookup'

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
      key: 'name',
      label: 'Company Name',
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
      key: 'domain',
      label: 'Company Domain',
      type: 'string',
      description:
        "This field is used to capture the primary domain name of a company's website. It should be entered in the format 'companyname.com'. The domain name provides a unique identifier for the company on the internet and is used for the company's website and email addresses. Please ensure to enter the correct and full domain name, including any necessary top-level domain (like .com, .org, .net, etc.). Note that it should not include 'www' or 'http://'.",
      constraints: [
        {
          type: 'required',
        },
      ],
    },
    {
      key: 'count',
      label: 'Employee Count',
      type: 'number',
      constraints: [
        {
          type: 'required',
        },
      ],
    },
    {
      key: 'country',
      label: 'Country',
      type: 'reference',
      constraints: [{ type: 'required' }],
      config: {
        ref: 'countries',
        key: 'name',
        relationship: 'has-one',
      },
    },
    {
      key: 'currency',
      label: 'Currency',
      type: 'reference',
      readonly: true,
      constraints: [{ type: 'required' }],
      config: {
        ref: 'countries',
        key: 'currency',
        relationship: 'has-one',
      },
    },
  ],
}

// Hooks

export function companyValidations(record) {
  // Validate the input record parameter
  if (!record || typeof record !== 'object') {
    console.error('Invalid record input. Expecting a valid record object.')
    throw new Error('Invalid record input. Expecting a valid record object.')
  }

  try {
    record.validateIfPresent('domain', (domain: string) => {
      const domainRegex =
        /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/
      if (!domainRegex.test(domain)) {
        return 'Invalid domain format.'
      }
    })
  } catch (error) {
    console.error('Error during domain validation:', error)
  }

  try {
    vlookup(record, 'country', 'currency', 'currency')
  } catch (error) {
    console.error('Error during vlookup:', error)
  }

  // Return the validated record
  return record
}
