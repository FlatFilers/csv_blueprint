import { FlatfileListener } from "@flatfile/listener";
import api from "@flatfile/api";

export default function (listener: FlatfileListener) {
  listener.filter({ job: "sheet:check-watchlist" }, (jobListener) => {
    jobListener.on("job:ready", async (e) => {
      // acck the ob
      const records = await e.data;
      // map the records with a random watchlist fail
      await api.records.update(
        e.context.sheetId,
        records.map((r) => {
          // do a thing
          return r;
        }),
      );
      //   complete the job
    });
  });
}
