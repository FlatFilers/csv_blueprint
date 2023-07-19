import { FlatfileListener } from "@flatfile/listener";
import api from "@flatfile/api";
import * as ExcelJS from "exceljs";
import * as path from "path";
import * as fs from "fs";
import { jobHandler } from "../../plugins/job.handler";

export const xlsxSinkPlugin = () => {
  return (listener: FlatfileListener) => {
    listener.use(
      jobHandler("workbook:downloadExcelWorkbook", async (event: any) => {
        const { jobId, workbookId, spaceId, environmentId } = event.context;

        // Get all sheets
        const sheetsResponse = await api.sheets.list({ workbookId });
        const sheets = sheetsResponse.data;
        console.log("Sheets retrieved:", sheets);

        const records: any = {};
        for (let index = 0; index < sheets.length; index++) {
          const sheet = sheets[index];
          records[sheet.name] = await api.records.get(sheet.id, {
            includeMessages: true,
          });
        }
        console.log("Records for sheets:", records);

        try {
          await api.jobs.ack(jobId, {
            info: "Starting job to write to Excel file",
            progress: 10,
          });

          // Create new workbook
          const workbook = new ExcelJS.Workbook();
          console.log("New workbook created");

          // For each sheet, create a worksheet in the workbook and populate it with data
          for (const sheet in records) {
            // Limit sheet name to 31 characters
            const trimmedSheetName = sheet.substring(0, 31);

            const newWorksheet = workbook.addWorksheet(trimmedSheetName);
            const data = records[sheet].data.records;

            if (data.length > 0) {
              // Add headers to the worksheet based on the keys of the `values` object in the first record
              const headers = Object.keys(data[0].values);
              newWorksheet.addRow(headers);
            }

            // For each row of data, write to a row in the Excel worksheet
            data.forEach((record: any, rowIndex: number) => {
              // Get the values object, which contains the actual cell data
              const cellData = record.values;

              // Create a new row for the worksheet
              const newRow: any[] = [];

              // Write each cell to the Excel file
              Object.entries(cellData).forEach(
                ([column, value]: [string, any], cellIndex: number) => {
                  newRow.push(value.value);
                },
              );

              // Add the new row to the worksheet
              const row = newWorksheet.addRow(newRow);

              Object.entries(cellData).forEach(
                ([column, value]: [string, any], cellIndex: number) => {
                  const filtered = value.messages.filter(
                    (m) => m.type === "error",
                  );

                  if (filtered.length === 0) return;

                  const comments = filtered.map((m) => {
                    return {
                      font: { color: { argb: "FF0000" } },
                      text: m.message,
                    };
                  });

                  row.getCell(cellIndex + 1).note = { texts: comments };
                },
              );
            });
          }
          console.log("Data written to workbook");

          // Get current date-time
          const dateTime = new Date().toISOString().replace(/[:.]/g, "-");

          // Write workbook to a file with date and time in its name
          const tempFilePath = path.join(
            __dirname,
            `Workbook_${dateTime}.xlsx`,
          );
          await workbook.xlsx.writeFile(tempFilePath);

          // Read the file as a stream
          const fileStream = fs.createReadStream(tempFilePath);

          // Upload the workbook to Flatfile as a file
          const fileUploadResponse = await api.files.upload(fileStream, {
            spaceId,
            environmentId,
            mode: "export",
          });
          console.log("File uploaded:", fileUploadResponse);

          await api.jobs.complete(jobId, {
            outcome: {
              message:
                'Data was successfully written to Excel file and uploaded. You can access the workbook in the "Available Downloads" section of the Files page in Flatfile.',
            },
          });
        } catch (error) {
          console.log(`Error: ${JSON.stringify(error, null, 2)}`);

          await api.jobs.fail(jobId, {
            outcome: {
              message:
                "This job failed probably because it couldn't write to the Excel file or upload it.",
            },
          });
        }
      }),
    );
  };
};
