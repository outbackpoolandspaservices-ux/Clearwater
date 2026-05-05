import Link from "next/link";
import { notFound } from "next/navigation";

import { SectionPage } from "@/components/app-shell/section-page";
import { AttachmentForm } from "@/features/attachments/attachment-form";
import { getJobById } from "@/features/jobs/data/jobs";

type NewJobAttachmentPageProps = {
  params: Promise<{
    jobId: string;
  }>;
};

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function NewJobAttachmentPage({
  params,
}: NewJobAttachmentPageProps) {
  const { jobId } = await params;
  const job = await getJobById(jobId);

  if (!job) notFound();

  return (
    <SectionPage
      title={`Add Attachment Metadata for ${job.jobNumber}`}
      description="Prepare job photos and documents for real upload storage without connecting a storage provider yet."
    >
      <Link
        className="text-sm font-semibold text-cyan-700 hover:text-cyan-900"
        href={`/jobs/${job.id}`}
      >
        Back to job
      </Link>
      <AttachmentForm jobId={job.id} />
    </SectionPage>
  );
}
