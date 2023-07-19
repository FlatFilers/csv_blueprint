import { FlatfileListener } from "@flatfile/listener";
import api from "@flatfile/api";

export default function (listener: FlatfileListener) {
  listener.filter({ job: "sheet:generate-ids" }, (jobListener) => {
    jobListener.on("job:ready", async (e) => {
      const { jobId } = e.context;

      await api.jobs.ack(jobId, {
        info: "Starting job to generate IDs",
        progress: 10,
      });

      const { records } = await e.data;

      await e.update(
        records.map((r) => {
          console.log(JSON.stringify(r,null,2))
          if (r.values["id"].value === null) {
            const val = Math.random()*9999
            const value = JSON.stringify(Math.round(val))
            r.values["id"].value = value
            r.values["id"].messages = []
            r.values["id"].messages.push({type: "info", message: "ID auto generated"})
          }

          return r;
        }),
      );

      await api.jobs.complete(jobId, {
        outcome: {
          message: "IDs generated for employees",
        },
      });
    });
  });
}
