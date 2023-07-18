import { FlatfileListener } from "@flatfile/listener";
import api from "@flatfile/api";

export default function (listener: FlatfileListener) {
  listener.filter({ job: "sheet:check-watchlist" }, (jobListener) => {
    jobListener.on("job:ready", async (e) => {
      const { jobId, sheetId } = e.context;

      await api.jobs.ack(jobId, {
        info: "Starting job to write to Excel file",
        progress: 10,
      });

      const records = await e.data;

      await api.records.update(
        sheetId,
        records.map((r) => {
          if (Math.random() <= 0.2) {
            r.addError("name", "Invalid value");
          }

          return r;
        }),
      );

      await api.jobs.complete(jobId, {
        outcome: {
          message: "Watchlist validation complete"
        },
      });
    });
  });
}
