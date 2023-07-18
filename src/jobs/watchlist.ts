import { FlatfileListener } from "@flatfile/listener";
import api from "@flatfile/api";

export default function (listener: FlatfileListener) {
  listener.filter({ job: "sheet:check-watchlist" }, (jobListener) => {
    jobListener.on("job:ready", async (e) => {
      const { jobId } = e.context;

      await api.jobs.ack(jobId, {
        info: "Starting job to write to Excel file",
        progress: 10,
      });

      const { records } = await e.data;

      await e.update(
        records.map((r) => {
          if (Math.random() <= 0.5) {
            r.values["full"].messages.push({ type: "error", message: "Invalid value" });
          }

          return r;
        }),
      );

      await api.jobs.complete(jobId, {
        outcome: {
          message: "Watchlist validation complete",
        },
      });
    });
  });
}
