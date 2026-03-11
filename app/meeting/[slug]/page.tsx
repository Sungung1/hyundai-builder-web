import { notFound } from "next/navigation";
import { MeetingShell } from "@/components/meeting-shell";
import { getMeetingAvailability, getMeetingBestTimes } from "@/db/queries";

export default async function MeetingPage({
  params
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const [availability, bestTimes] = await Promise.all([
    getMeetingAvailability(slug),
    getMeetingBestTimes(slug)
  ]);

  if (!availability || !bestTimes) {
    notFound();
  }

  return <MeetingShell initialData={availability} initialBestTimes={bestTimes} />;
}
