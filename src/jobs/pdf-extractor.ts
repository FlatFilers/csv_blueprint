import axios from "axios";
import api, { Flatfile } from "@flatfile/api";
import { fileBuffer } from "@flatfile/plugin-file-buffer";
import { FlatfileEvent, FlatfileListener } from "@flatfile/listener";
import * as fs from "fs";

export const pdfExtractorPlugin = () => {
  return (listener: FlatfileListener) => {
    listener.use(
      fileBuffer(".pdf", async (fileResource, buffer, event) => {
        await run(event, fileResource, buffer);
      }),
    );
  };
};

const run = async (
  event: FlatfileEvent,
  file: Flatfile.File_,
  buffer: Buffer,
): Promise<void> => {
  const { environmentId, spaceId } = event.context;

  if (file.ext !== "pdf" || file.mode !== "import") {
    return;
  }

  try {
    const url: string = `https://pdftables.com/api?key=${process.env.PDF_API_KEY}&format=csv`;
    const fileName: string = `${file.name.replace(
      ".pdf",
      "",
    )}(Converted PDF)-${currentEpoch()}.csv`;

    const formData = new FormData();
    formData.append("file", new Blob([buffer]));

    const response = await axios.postForm(url, formData);

    if (response.status !== 200) return;

    fs.writeFile(fileName, response.data, async (err) => {
      if (err) {
        console.log("Error writing file to disk");
      }

      try {
        const reader = fs.createReadStream(fileName);

        await api.files.upload(reader, {
          spaceId,
          environmentId,
          mode: "import",
        });

        reader.close();
      } catch (uploadError: unknown) {
        console.error("Failed to upload PDF->XLSX file");
        console.error(JSON.stringify(uploadError, null, 2));
      }
    });
  } catch (convertError: unknown) {
    console.log(JSON.stringify(convertError));
  }
};

const currentEpoch = (): string => {
  return `${Math.floor(Date.now() / 1000)}`;
};
