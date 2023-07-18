import { recordHook, FlatfileRecord } from '@flatfile/plugin-record-hook'
import { FlatfileEvent, Client } from '@flatfile/listener'
import api from '@flatfile/api'
import { blueprintSheets } from './blueprints/blueprint'
import { theme } from './themes/theme'
import { xlsxExtractorPlugin } from '@flatfile/plugin-xlsx-extractor'

export default function flatfileEventListener(listener: Client) {
  listener.on('**', ({ topic }: FlatfileEvent) => {
    console.log(`Received event: ${topic}`)
  })

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
  // PARSE XLSX FILES
  listener.use(xlsxExtractorPlugin({ rawNumbers: true }))
}
