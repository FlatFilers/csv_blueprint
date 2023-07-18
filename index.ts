import { recordHook, FlatfileRecord } from '@flatfile/plugin-record-hook'
import { FlatfileEvent, Client } from '@flatfile/listener'
import api from '@flatfile/api'
import { blueprintSheets } from './blueprints/blueprint'
import { theme } from './themes/theme'
import { xlsxExtractorPlugin } from '@flatfile/plugin-xlsx-extractor'
import { countries } from './sheets/countries'
import { companyValidations } from './sheets/companies'

export default function flatfileEventListener(listener: Client) {
  listener.on('**', ({ topic }: FlatfileEvent) => {
    console.log(`Received event: ${topic}`)
  })

  // SET UP SPACE
  listener.filter({ job: 'space:configure' }, (configure) => {
    configure.on('job:ready', async (event) => {
      console.log('Reached the job:ready event callback')

      // Destructure the 'context' object from the event object to get the necessary IDs
      const { spaceId, environmentId, jobId } = event.context

      const space = await api.spaces.get(spaceId)

      console.log('Space: ' + JSON.stringify(space))

      // Acknowledge the job with progress and info using api.jobs.ack
      const updateJob = await api.jobs.ack(jobId, {
        info: 'Getting started',
        progress: 10,
      })

      console.log('Updated Job: ' + JSON.stringify(updateJob))

      // Log the environment ID, space ID, and job ID to the console
      console.log('env: ' + environmentId)
      console.log('spaceId: ' + spaceId)
      console.log('jobID: ' + jobId)

      try {
        // Create a new workbook
        const createWorkbook = await api.workbooks.create({
          spaceId: spaceId,
          environmentId: environmentId,
          name: 'Data Import Workbook',
          sheets: blueprintSheets,
          actions: [
            {
              operation: 'submitAction',
              mode: 'foreground',
              label: 'Submit',
              type: 'string',
              description: 'Submit Data to the Smokeball app',
              primary: true,
            },
          ],
        })

        const workbookId = createWorkbook.data?.id

        if (workbookId) {
          console.log('Created Workbook with ID:' + workbookId)
          const updatedSpace = await api.spaces.update(spaceId, {
            environmentId: environmentId,
            primaryWorkbookId: workbookId,
            metadata: {
              theme: theme,
            },
          })
        }
      } catch (error) {
        console.log('Error creating workbook:', error)
      }

      // Acknowledging that the Space is now set up
      await api.jobs.complete(jobId, {
        info: 'We are acknowleding the space is now set up.',
      })
    })
    // Handle the 'job:failed' event
    configure.on('job:failed', async (event: any) => {
      console.log('Space creation has failed: ' + JSON.stringify(event))
    })
    // Handle the 'job:completed' event
    configure.on('job:completed', async (event: any) => {
      console.log('Space creation has completed: ' + JSON.stringify(event))
    })
  })

  // SEED THE WORKBOOK WITH DATA
  listener.on('workbook:created', async (event) => {
    if (!event.context || !event.context.workbookId) {
      console.error('Event context or workbookId missing')
      return
    }

    const workbookId = event.context.workbookId
    let workbook
    try {
      workbook = await api.workbooks.get(workbookId)
    } catch (error) {
      console.error('Error getting workbook:', error.message)
      return
    }

    const workbookName =
      workbook.data && workbook.data.name ? workbook.data.name : ''
    const spaceId =
      workbook.data && workbook.data.spaceId ? workbook.data.spaceId : ''

    if (workbookName.includes('Data Import Workbook')) {
      const sheets =
        workbook.data && workbook.data.sheets ? workbook.data.sheets : []

      // Countries
      const countriesSheet = sheets.find((s) =>
        s.config.slug.includes('countries')
      )
      if (countriesSheet && Array.isArray(countries)) {
        const countriesId = countriesSheet.id
        const request1 = countries.map(
          ({ countryCode, countryName, countryCurrency }) => ({
            code: { value: countryCode },
            name: { value: countryName },
            currency: { value: countryCurrency },
          })
        )

        try {
          const insertCountries = await api.records.insert(
            countriesId,
            request1
          )
        } catch (error) {
          console.error('Error inserting companies:', error.message)
        }
      }
    }
  })

  // RECORD HOOK VALIDATIONS

  listener.use(
    recordHook('companies', (record: FlatfileRecord) => {
      try {
        // Apply the company validations to the record
        return companyValidations(record)
      } catch (error) {
        console.error('Error during company validation:', error)
      }
    })
  )

  listener.use(
    recordHook('companies', (record: FlatfileRecord) => {
      try {
        // Apply the company validations to the record
        return companyValidations(record)
      } catch (error) {
        console.error('Error during company validation:', error)
      }
    })
  )

  // PARSE XLSX FILES
  listener.use(xlsxExtractorPlugin({ rawNumbers: true }))
}
