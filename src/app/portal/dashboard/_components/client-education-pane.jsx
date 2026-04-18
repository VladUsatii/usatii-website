'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function formatDateTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    cache: 'no-store',
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(payload.error || `Request failed (${response.status}).`);
    error.status = response.status;
    throw error;
  }

  return payload;
}

function StatusPill({ tone = 'gray', children }) {
  const tones = {
    green: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    yellow: 'bg-amber-50 border-amber-200 text-amber-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    gray: 'bg-neutral-100 border-neutral-200 text-neutral-700',
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

function MetricCard({ label, value, helper, tone = 'gray' }) {
  const borderTone = {
    green: 'border-emerald-200',
    yellow: 'border-amber-200',
    blue: 'border-blue-200',
    gray: 'border-neutral-200',
  };

  return (
    <div className={`rounded-xl border bg-white p-4 ${borderTone[tone]}`}>
      <p className="text-[11px] uppercase tracking-[0.12em] text-neutral-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">{value}</p>
      {helper ? <p className="mt-1 text-xs text-neutral-600">{helper}</p> : null}
    </div>
  );
}

function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center">
      <p className="text-sm font-semibold text-neutral-900">{title}</p>
      <p className="mt-1 text-xs text-neutral-600">{description}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="cursor-pointer mt-4 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 transition hover:border-neutral-400"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

export default function ClientEducationPane() {
  const [data, setData] = useState({
    summary: {
      assignedCount: 0,
      completedCount: 0,
      completionPercent: 0,
      averageScorePercent: 0,
    },
    assignments: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [answersByAssignment, setAnswersByAssignment] = useState({});
  const [submitLoadingAssignmentId, setSubmitLoadingAssignmentId] = useState(null);
  const [noticeByAssignment, setNoticeByAssignment] = useState({});

  const loadEducation = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const payload = await fetchJson('/api/portal/education');
      const nextAssignments = payload.assignments || [];

      setData({
        summary: payload.summary || {
          assignedCount: 0,
          completedCount: 0,
          completionPercent: 0,
          averageScorePercent: 0,
        },
        assignments: nextAssignments,
      });

      setSelectedAssignmentId((previous) => {
        if (nextAssignments.length === 0) return null;
        if (
          previous !== null &&
          nextAssignments.some((assignment) => String(assignment.assignmentId) === String(previous))
        ) {
          return previous;
        }
        return nextAssignments[0].assignmentId;
      });
    } catch (caughtError) {
      setError(caughtError.message || 'Unable to load education assignments.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEducation();
  }, [loadEducation]);

  const selectedAssignment = useMemo(() => {
    if (!selectedAssignmentId) return data.assignments[0] || null;
    return data.assignments.find((assignment) => String(assignment.assignmentId) === String(selectedAssignmentId)) || data.assignments[0] || null;
  }, [data.assignments, selectedAssignmentId]);

  const selectedAnswers = useMemo(() => {
    if (!selectedAssignment) return {};
    return answersByAssignment[String(selectedAssignment.assignmentId)] || {};
  }, [answersByAssignment, selectedAssignment]);

  const allQuestionsAnswered = useMemo(() => {
    if (!selectedAssignment) return false;

    const questions = selectedAssignment.guide?.questions || [];
    if (questions.length === 0) return false;

    return questions.every((question) => Boolean(selectedAnswers[String(question.id)]));
  }, [selectedAssignment, selectedAnswers]);

  function setAnswer(assignmentId, questionId, choiceKey) {
    const assignmentKey = String(assignmentId);
    const questionKey = String(questionId);

    setAnswersByAssignment((previous) => ({
      ...previous,
      [assignmentKey]: {
        ...(previous[assignmentKey] || {}),
        [questionKey]: choiceKey,
      },
    }));
  }

  async function handleSubmitQuiz() {
    if (!selectedAssignment) return;

    const assignmentId = selectedAssignment.assignmentId;
    const assignmentKey = String(assignmentId);
    const answers = answersByAssignment[assignmentKey] || {};

    setSubmitLoadingAssignmentId(assignmentKey);
    setNoticeByAssignment((previous) => ({
      ...previous,
      [assignmentKey]: '',
    }));

    try {
      const payload = await fetchJson(`/api/portal/education/${assignmentId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers,
        }),
      });

      setNoticeByAssignment((previous) => ({
        ...previous,
        [assignmentKey]: payload.passed
          ? `Passed at ${payload.scorePercent}% (${payload.correctCount}/${payload.totalCount}). Marked complete.`
          : `Scored ${payload.scorePercent}% (${payload.correctCount}/${payload.totalCount}). Passing score is ${payload.passingPercent}%. You can retry.`,
      }));

      await loadEducation();
    } catch (caughtError) {
      setNoticeByAssignment((previous) => ({
        ...previous,
        [assignmentKey]: caughtError.message || 'Unable to submit quiz.',
      }));
    } finally {
      setSubmitLoadingAssignmentId(null);
    }
  }

  if (loading && data.assignments.length === 0) {
    return (
      <EmptyState
        title="Loading education assignments"
        description="Pulling your assigned guides now."
      />
    );
  }

  if (error) {
    return (
      <EmptyState
        title="Education unavailable"
        description={error}
        actionLabel="Retry"
        onAction={loadEducation}
      />
    );
  }

  const summary = data.summary || {
    assignedCount: 0,
    completedCount: 0,
    completionPercent: 0,
    averageScorePercent: 0,
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Assigned Guides" value={String(summary.assignedCount)} tone="blue" />
        <MetricCard label="Completed" value={String(summary.completedCount)} tone={summary.completedCount > 0 ? 'green' : 'gray'} />
        <MetricCard label="Completion" value={`${summary.completionPercent}%`} tone={summary.completionPercent >= 70 ? 'green' : summary.completionPercent > 0 ? 'yellow' : 'gray'} />
        <MetricCard label="Avg Score" value={`${summary.averageScorePercent}%`} tone={summary.averageScorePercent >= 70 ? 'green' : summary.averageScorePercent > 0 ? 'yellow' : 'gray'} />
      </div>

      {data.assignments.length === 0 ? (
        <EmptyState
          title="No education guides assigned yet"
          description="Your team will assign guides here when they are ready."
        />
      ) : (
        <div className="grid gap-4 xl:grid-cols-[320px_1fr]">
          <div className="rounded-xl border border-neutral-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">Guide Inbox</p>
              <button
                type="button"
                onClick={loadEducation}
                disabled={loading}
                className="cursor-pointer rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-xs font-semibold text-neutral-800 transition hover:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>

            <div className="space-y-2">
              {data.assignments.map((assignment) => {
                const isSelected = String(selectedAssignment?.assignmentId) === String(assignment.assignmentId);
                const isCompleted = Boolean(assignment.completedAt);

                return (
                  <button
                    key={`assignment-${assignment.assignmentId}`}
                    type="button"
                    onClick={() => setSelectedAssignmentId(assignment.assignmentId)}
                    className={`w-full rounded-lg border px-3 py-2 text-left transition ${
                      isSelected
                        ? 'border-neutral-900 bg-neutral-900 text-white'
                        : 'border-neutral-200 bg-white hover:border-neutral-400'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold">{assignment.guide?.title || 'Untitled Guide'}</p>
                      <StatusPill tone={isCompleted ? 'green' : 'yellow'}>
                        {isCompleted ? 'Completed' : 'Assigned'}
                      </StatusPill>
                    </div>
                    <p className={`mt-1 text-xs ${isSelected ? 'text-neutral-200' : 'text-neutral-500'}`}>
                      Assigned {formatDate(assignment.assignedAt)}
                    </p>
                    <p className={`mt-1 text-[11px] ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                      Latest score: {assignment.latestScorePercent === null ? '—' : `${assignment.latestScorePercent}%`}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-4">
            {!selectedAssignment ? (
              <EmptyState title="Select a guide" description="Choose a guide from the inbox to begin." />
            ) : (
              <div className="space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">Education Guide</p>
                    <h2 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950">
                      {selectedAssignment.guide?.title || 'Untitled Guide'}
                    </h2>
                    <p className="mt-1 text-sm text-neutral-600">
                      {selectedAssignment.guide?.summary || 'No summary provided.'}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <StatusPill tone={selectedAssignment.completedAt ? 'green' : 'yellow'}>
                      {selectedAssignment.completedAt ? 'Completed' : 'In Progress'}
                    </StatusPill>
                    <StatusPill tone="blue">
                      Passing {selectedAssignment.guide?.passingPercent || 70}%
                    </StatusPill>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-neutral-200 p-3">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-neutral-500">Assigned</p>
                    <p className="mt-1 text-sm text-neutral-900">{formatDateTime(selectedAssignment.assignedAt)}</p>
                  </div>
                  <div className="rounded-lg border border-neutral-200 p-3">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-neutral-500">Completed</p>
                    <p className="mt-1 text-sm text-neutral-900">{formatDateTime(selectedAssignment.completedAt)}</p>
                  </div>
                  <div className="rounded-lg border border-neutral-200 p-3">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-neutral-500">Latest Score</p>
                    <p className="mt-1 text-sm text-neutral-900">
                      {selectedAssignment.latestScorePercent === null
                        ? 'Not attempted yet'
                        : `${selectedAssignment.latestScorePercent}% (${selectedAssignment.latestCorrectCount || 0}/${selectedAssignment.latestTotalCount || 0})`}
                    </p>
                  </div>
                  <div className="rounded-lg border border-neutral-200 p-3">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-neutral-500">Attempts</p>
                    <p className="mt-1 text-sm text-neutral-900">{selectedAssignment.attemptCount || 0}</p>
                  </div>
                </div>

                <div className="rounded-lg border border-neutral-200 p-3">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-neutral-500">Guide Content</p>
                  <div className="mt-2 whitespace-pre-wrap text-sm leading-7 text-neutral-800">
                    {selectedAssignment.guide?.contentMarkdown || 'No guide content provided.'}
                  </div>
                </div>

                <div className="rounded-lg border border-neutral-200 p-3">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-neutral-500">Mini Quiz</p>
                  <div className="mt-3 space-y-4">
                    {(selectedAssignment.guide?.questions || []).map((question) => {
                      const selectedValue = selectedAnswers[String(question.id)] || '';
                      return (
                        <div key={`question-${question.id}`} className="rounded-md border border-neutral-200 p-3">
                          <p className="text-sm font-semibold text-neutral-900">
                            {question.position}. {question.prompt}
                          </p>
                          <div className="mt-2 grid gap-2">
                            {['a', 'b', 'c', 'd'].map((choiceKey) => (
                              <label key={`question-${question.id}-choice-${choiceKey}`} className="flex items-center gap-2 rounded-md border border-neutral-200 px-2 py-2 text-xs text-neutral-700">
                                <input
                                  type="radio"
                                  name={`question-${question.id}`}
                                  value={choiceKey}
                                  checked={selectedValue === choiceKey}
                                  onChange={() =>
                                    setAnswer(selectedAssignment.assignmentId, question.id, choiceKey)
                                  }
                                  disabled={Boolean(selectedAssignment.completedAt)}
                                  className="h-3.5 w-3.5"
                                />
                                <span className="font-semibold uppercase">{choiceKey}</span>
                                <span>{question.choices?.[choiceKey] || ''}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {noticeByAssignment[String(selectedAssignment.assignmentId)] ? (
                    <p className="mt-3 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-700">
                      {noticeByAssignment[String(selectedAssignment.assignmentId)]}
                    </p>
                  ) : null}

                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={handleSubmitQuiz}
                      disabled={
                        Boolean(selectedAssignment.completedAt) ||
                        !allQuestionsAnswered ||
                        submitLoadingAssignmentId === String(selectedAssignment.assignmentId)
                      }
                      className="cursor-pointer rounded-md bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {selectedAssignment.completedAt
                        ? 'Completed'
                        : submitLoadingAssignmentId === String(selectedAssignment.assignmentId)
                          ? 'Submitting...'
                          : 'Submit Quiz'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
