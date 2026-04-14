import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import type {
  ApplicationStatus,
  ProjectSubmission,
  ProjectSubmissionStatusHistoryEntry,
  StudentProfile,
  UpdateProjectSubmissionStatusPayload,
} from '@/lib/api/types';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Tabs } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/toast';
import { ApiError, parseApiError } from '@/lib/api/errors';
import { format } from 'date-fns';
import { useAuth } from '@/store/authStore';

const statusSchema = z.object({
  status: z.enum(['SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED']),
  note: z.string().max(500).optional().nullable(),
});

type StatusFormValues = z.infer<typeof statusSchema>;

const STATUS_OPTIONS = [
  { value: 'SHORTLISTED', label: 'Shortlisted' },
  { value: 'INTERVIEW', label: 'Interview' },
  { value: 'SELECTED', label: 'Selected' },
  { value: 'REJECTED', label: 'Rejected' },
];

export default function ProjectSubmissionReviewPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('Profile');
  const { isCompanyAdmin } = useAuth();

  const { data: submission, isLoading } = useQuery({
    queryKey: ['project-submissions', id],
    queryFn: async () => {
      const res = await api.get<{ data?: ProjectSubmission } | ProjectSubmission>(endpoints.projectSubmissions.detail(id!));
      const body = res.data;
      return (body && typeof body === 'object' && 'data' in body ? body.data : body) as ProjectSubmission;
    },
    enabled: !!id,
  });

  const { register, handleSubmit, formState: { errors } } = useForm<StatusFormValues>({
    resolver: zodResolver(statusSchema),
    defaultValues: { status: 'SHORTLISTED', note: '' },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (payload: UpdateProjectSubmissionStatusPayload) => {
      await api.patch(endpoints.projectSubmissions.updateStatus(id!), payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-submissions', id] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Status updated');
      navigate(-1);
    },
    onError: (err) => {
      const apiErr = err instanceof ApiError ? err : parseApiError(err);
      toast.error(apiErr.message);
    },
  });

  const onStatusSubmit = (values: StatusFormValues) => {
    updateStatusMutation.mutate({
      status: values.status as UpdateProjectSubmissionStatusPayload['status'],
      note: values.note || null,
    });
  };

  const profile = submission?.profile as StudentProfile | undefined;
  const statusHistory = submission?.statusHistory ?? [];
  const project = submission?.project;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <header>
          <h1 className="ef-heading-gradient text-4xl font-semibold">Project Submission Review</h1>
        </header>
        <div className="h-64 animate-pulse rounded-2xl bg-[var(--elements)]elements)]" />
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="space-y-8">
        <header>
          <h1 className="ef-heading-gradient text-4xl font-semibold">Project Submission Review</h1>
        </header>
        <p className="text-[var(--muted)]">Submission not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Company</p>
        <h1 className="ef-heading-gradient mt-2 text-4xl font-semibold leading-tight md:text-5xl">
          Project Submission Review
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-[var(--foreground)] md:text-base">
          Review submission for {project?.title ?? 'this project'}
        </p>
      </header>

      <Tabs tabs={['Profile', 'Submission Form', 'Cover Letter', 'Status History']} active={activeTab} onChange={setActiveTab} />

      {activeTab === 'Profile' && profile && (
        <Card>
          <div className="flex flex-wrap items-start gap-6">
            <Avatar name={`${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim()} size="lg" />
            <div className="flex-1 space-y-2">
              <h3 className="text-lg font-semibold text-[var(--foreground)]">{`${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim() || '—'}</h3>
              {profile.major && <p className="text-sm text-[var(--muted)]">{profile.major}</p>}
              {profile.skills?.length ? (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {profile.skills.map((s) => (
                    <Badge key={s}>{s}</Badge>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'Submission Form' && (
        <Card>
          <h3 className="mb-4 text-sm font-medium uppercase tracking-[0.12em] text-[var(--muted)]">Submission Details</h3>
          {!submission.formAnswers || Object.keys(submission.formAnswers).length === 0 ? (
            <p className="text-sm text-[var(--muted)]">No submission form data provided.</p>
          ) : (
            <dl className="space-y-4 text-sm">
              {submission.formAnswers.firstName && (
                <div>
                  <dt className="text-[var(--muted)]">First Name</dt>
                  <dd className="mt-1 text-[var(--foreground)]">{submission.formAnswers.firstName}</dd>
                </div>
              )}
              {submission.formAnswers.lastName && (
                <div>
                  <dt className="text-[var(--muted)]">Last Name</dt>
                  <dd className="mt-1 text-[var(--foreground)]">{submission.formAnswers.lastName}</dd>
                </div>
              )}
              {submission.formAnswers.address && (
                <div>
                  <dt className="text-[var(--muted)]">Address</dt>
                  <dd className="mt-1 text-[var(--foreground)]">{submission.formAnswers.address}</dd>
                </div>
              )}
              {submission.formAnswers.resumeUrl && (
                <div>
                  <dt className="text-[var(--muted)]">Resume Link</dt>
                  <dd className="mt-1 text-blue-400 hover:underline">
                    <a href={submission.formAnswers.resumeUrl as string} target="_blank" rel="noopener noreferrer">
                      {submission.formAnswers.resumeUrl}
                    </a>
                  </dd>
                </div>
              )}
              {submission.formAnswers.customAnswers && typeof submission.formAnswers.customAnswers === 'object' && (
                <div className="mt-4 border-t border-[var(--border)] pt-4">
                  <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Custom Questions</h4>
                  <div className="space-y-4">
                    {Object.entries(submission.formAnswers.customAnswers).map(([qId, answer]) => (
                      <div key={qId}>
                        <dt className="mb-1 text-xs text-[var(--muted)]">Answer to custom question:</dt>
                        <dd className="whitespace-pre-wrap rounded-lg border border-[var(--border)] bg-[var(--elements)] p-3 text-[var(--foreground)]">
                          {String(answer)}
                        </dd>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </dl>
          )}
        </Card>
      )}

      {activeTab === 'Cover Letter' && (
        <Card>
          <h3 className="mb-3 text-sm font-medium uppercase tracking-[0.12em] text-[var(--muted)]">Cover Letter</h3>
          <p className="whitespace-pre-wrap text-sm text-[var(--foreground)]">{submission.coverLetter || 'No cover letter provided.'}</p>
          {submission.resumeUrl && (
            <div className="mt-4">
              <a href={submission.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--foreground)] underline hover:text-[var(--foreground)]">
                Download resume
              </a>
            </div>
          )}
        </Card>
      )}

      {activeTab === 'Status History' && (
        <Card>
          <h3 className="mb-4 text-sm font-medium uppercase tracking-[0.12em] text-[var(--muted)]">Status History</h3>
          <div className="space-y-3">
            {statusHistory.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">No status changes yet.</p>
            ) : (
              statusHistory.map((entry: ProjectSubmissionStatusHistoryEntry) => (
                <div key={entry.id} className="flex flex-wrap items-start gap-3 border-b border-[var(--border)] pb-3 last:border-0 last:pb-0">
                  <Badge>{entry.toStatus as ApplicationStatus}</Badge>
                  <span className="text-xs text-[var(--muted)]">
                    {(() => {
                      const d = entry.createdAt ? new Date(entry.createdAt) : null;
                      return d && !isNaN(d.getTime()) ? format(d, 'MMM d, yyyy HH:mm') : '—';
                    })()}
                  </span>
                  {entry.note && <p className="w-full text-sm text-[var(--muted)]">{entry.note}</p>}
                </div>
              ))
            )}
          </div>
        </Card>
      )}

      {isCompanyAdmin ? (
        <Card>
          <h3 className="mb-4 text-sm font-medium uppercase tracking-[0.12em] text-[var(--muted)]">Update Status</h3>
          <form onSubmit={handleSubmit(onStatusSubmit)} className="space-y-4">
            <Select label="Decision" options={STATUS_OPTIONS} {...register('status')} error={errors.status?.message} />
            <Textarea
              label="Note (optional)"
              placeholder="Add a note for this status change..."
              maxLength={500}
              {...register('note')}
              error={errors.note?.message}
            />
            <div className="flex gap-2">
              <Button type="submit" variant="primary" withBorderEffect={false} disabled={updateStatusMutation.isPending}>
                {updateStatusMutation.isPending ? 'Saving...' : 'Save'}
              </Button>
              <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
                Back
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--elements)] px-4 py-3 text-sm text-[var(--muted)]">
          Read-only view. Only company admins can update submission status.
        </div>
      )}
    </div>
  );
}
