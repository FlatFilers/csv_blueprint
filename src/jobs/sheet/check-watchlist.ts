import { FlatfileListener } from "@flatfile/listener";
import { jobHandler } from "../../plugins/job.handler";

export default function (listener: FlatfileListener) {
  listener.use(
    jobHandler("sheet:check-watchlist", async (e) => {
      const { records } = await e.data;
      const updatedRecords = records.map((r) => {
        if (Math.random() <= 0.1) {
          r.values["watchlist-report"] = { value: "⛔️ Present in Watchlist" };
        }

        return r;
      });
      await e.update(updatedRecords);
    }),
  );
}
