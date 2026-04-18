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

function clientLabel(client) {
  return client?.displayName || client?.company || client?.email || `Client ${client?.userId || ''}`;
}

function emptyQuestion() {
  return {
    prompt: '',
    choiceA: '',
    choiceB: '',
    choiceC: '',
    choiceD: '',
    correctOption: 'a',
    explanation: '',
  };
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
    error.code = payload.code || null;
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

export default function AdminEducationPane({ clients = [] }) {
  const [guides, setGuides] = useState([]);
  const [summary, setSummary] = useState({
    totalGuides: 0,
    totalQuestions: 0,
    totalAssignments: 0,
    totalCompleted: 0,
    completionPercent: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const [title, setTitle] = useState('');
  const [guideSummary, setGuideSummary] = useState('');
  const [contentMarkdown, setContentMarkdown] = useState('');
  const [passingPercent, setPassingPercent] = useState(70);
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const [assignedClientIds, setAssignedClientIds] = useState([]);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');

  const [assignmentDrafts, setAssignmentDrafts] = useState({});
  const [assignmentSavingGuideId, setAssignmentSavingGuideId] = useState(null);
  const [assignmentErrorByGuide, setAssignmentErrorByGuide] = useState({});
  const [assignmentNoticeByGuide, setAssignmentNoticeByGuide] = useState({});

  const loadGuides = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const payload = await fetchJson('/api/admin/education/guides');
      const nextGuides = payload.guides || [];

      setGuides(nextGuides);
      setSummary(payload.summary || {
        totalGuides: 0,
        totalQuestions: 0,
        totalAssignments: 0,
        totalCompleted: 0,
        completionPercent: 0,
      });

      const nextDrafts = {};
      for (const guide of nextGuides) {
        nextDrafts[String(guide.id)] = (guide.assignments || []).map((assignment) => String(assignment.clientUserId));
      }
      setAssignmentDrafts(nextDrafts);
    } catch (caughtError) {
      setError(caughtError.message || 'Unable to load education guides.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGuides();
  }, [loadGuides]);

  const filteredGuides = useMemo(() => {
    if (!search.trim()) return guides;

    const query = search.trim().toLowerCase();
    return guides.filter((guide) =>
      [guide.title, guide.summary, guide.contentMarkdown]
        .map((value) => String(value || '').toLowerCase())
        .some((value) => value.includes(query))
    );
  }, [guides, search]);

  function setQuestionValue(index, key, value) {
    setQuestions((previous) =>
      previous.map((question, questionIndex) =>
        questionIndex === index ? { ...question, [key]: value } : question
      )
    );
  }

  function toggleCreateClientSelection(clientUserId) {
    setAssignedClientIds((previous) => {
      const key = String(clientUserId);
      if (previous.includes(key)) {
        return previous.filter((item) => item !== key);
      }
      return [...previous, key];
    });
  }

  async function handleCreateGuide(event) {
    event.preventDefault();
    setCreateLoading(true);
    setCreateError('');
    setCreateSuccess('');

    try {
      const payload = {
        title,
        summary: guideSummary,
        contentMarkdown,
        passingPercent: Number.parseInt(String(passingPercent || 70), 10) || 70,
        quizQuestions: questions.map((question) => ({
          prompt: question.prompt,
          choices: [
            question.choiceA,
            question.choiceB,
            question.choiceC,
            question.choiceD,
          ],
          correctOption: question.correctOption,
          explanation: question.explanation,
        })),
        assignedClientUserIds: assignedClientIds.map((value) => Number.parseInt(String(value), 10)).filter((value) => Number.isFinite(value) && value > 0),
      };

      await fetchJson('/api/admin/education/guides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      setTitle('');
      setGuideSummary('');
      setContentMarkdown('');
      setPassingPercent(70);
      setQuestions([emptyQuestion()]);
      setAssignedClientIds([]);
      setCreateSuccess('Education guide created successfully.');
      await loadGuides();
    } catch (caughtError) {
      setCreateError(caughtError.message || 'Unable to create guide.');
    } finally {
      setCreateLoading(false);
    }
  }

  function toggleGuideClientAssignment(guideId, clientUserId) {
    const guideKey = String(guideId);
    const clientKey = String(clientUserId);

    setAssignmentDrafts((previous) => {
      const current = previous[guideKey] || [];
      const next = current.includes(clientKey)
        ? current.filter((value) => value !== clientKey)
        : [...current, clientKey];

      return {
        ...previous,
        [guideKey]: next,
      };
    });
  }

  async function handleSaveAssignments(guideId) {
    const guideKey = String(guideId);
    const clientUserIds = (assignmentDrafts[guideKey] || [])
      .map((value) => Number.parseInt(String(value), 10))
      .filter((value) => Number.isFinite(value) && value > 0);

    setAssignmentSavingGuideId(guideKey);
    setAssignmentErrorByGuide((previous) => ({
      ...previous,
      [guideKey]: '',
    }));
    setAssignmentNoticeByGuide((previous) => ({
      ...previous,
      [guideKey]: '',
    }));

    try {
      await fetchJson(`/api/admin/education/guides/${guideId}/assignments`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientUserIds,
        }),
      });

      setAssignmentNoticeByGuide((previous) => ({
        ...previous,
        [guideKey]: 'Assignments updated.',
      }));

      await loadGuides();
    } catch (caughtError) {
      setAssignmentErrorByGuide((previous) => ({
        ...previous,
        [guideKey]: caughtError.message || 'Unable to save assignments.',
      }));
    } finally {
      setAssignmentSavingGuideId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Guides" value={String(summary.totalGuides)} tone="blue" />
        <MetricCard label="Quiz Questions" value={String(summary.totalQuestions)} tone="gray" />
        <MetricCard label="Assignments" value={String(summary.totalAssignments)} tone="yellow" />
        <MetricCard label="Completed" value={String(summary.totalCompleted)} tone={summary.totalCompleted > 0 ? 'green' : 'gray'} />
        <MetricCard
          label="Completion"
          value={`${summary.completionPercent}%`}
          helper="Across all guide assignments"
          tone={summary.completionPercent >= 70 ? 'green' : summary.completionPercent > 0 ? 'yellow' : 'gray'}
        />
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">Create Education Guide</p>
            <p className="mt-1 text-sm text-neutral-600">Build a guide, attach a mini quiz, and assign it to selected clients.</p>
          </div>
        </div>

        <form onSubmit={handleCreateGuide} className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Guide title"
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
              required
            />
            <input
              type="number"
              min={1}
              max={100}
              value={passingPercent}
              onChange={(event) => setPassingPercent(event.target.value)}
              placeholder="Passing score percent"
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
            />
          </div>

          <textarea
            value={guideSummary}
            onChange={(event) => setGuideSummary(event.target.value)}
            placeholder="Guide summary (optional)"
            className="min-h-[72px] w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
          />

          <textarea
            value={contentMarkdown}
            onChange={(event) => setContentMarkdown(event.target.value)}
            placeholder="Guide body (plain text or markdown)"
            className="min-h-[140px] w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
          />

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">Mini Quiz</p>
              <button
                type="button"
                onClick={() => setQuestions((previous) => [...previous, emptyQuestion()])}
                className="cursor-pointer rounded-md border border-neutral-300 px-2 py-1.5 text-xs font-semibold text-neutral-700 transition hover:border-neutral-400"
              >
                + Add Question
              </button>
            </div>

            {questions.map((question, index) => (
              <div key={`quiz-question-${index + 1}`} className="rounded-lg border border-neutral-200 p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-neutral-800">Question {index + 1}</p>
                  {questions.length > 1 ? (
                    <button
                      type="button"
                      onClick={() =>
                        setQuestions((previous) =>
                          previous.filter((_, questionIndex) => questionIndex !== index)
                        )
                      }
                      className="cursor-pointer rounded-md border border-rose-200 px-2 py-1 text-xs font-semibold text-rose-700 transition hover:border-rose-300"
                    >
                      Remove
                    </button>
                  ) : null}
                </div>

                <textarea
                  value={question.prompt}
                  onChange={(event) => setQuestionValue(index, 'prompt', event.target.value)}
                  placeholder="Question prompt"
                  className="min-h-[64px] w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
                  required
                />

                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  <input
                    value={question.choiceA}
                    onChange={(event) => setQuestionValue(index, 'choiceA', event.target.value)}
                    placeholder="Option A"
                    className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
                    required
                  />
                  <input
                    value={question.choiceB}
                    onChange={(event) => setQuestionValue(index, 'choiceB', event.target.value)}
                    placeholder="Option B"
                    className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
                    required
                  />
                  <input
                    value={question.choiceC}
                    onChange={(event) => setQuestionValue(index, 'choiceC', event.target.value)}
                    placeholder="Option C"
                    className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
                    required
                  />
                  <input
                    value={question.choiceD}
                    onChange={(event) => setQuestionValue(index, 'choiceD', event.target.value)}
                    placeholder="Option D"
                    className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
                    required
                  />
                </div>

                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  <select
                    value={question.correctOption}
                    onChange={(event) => setQuestionValue(index, 'correctOption', event.target.value)}
                    className="cursor-pointer rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-black"
                  >
                    <option value="a">Correct: A</option>
                    <option value="b">Correct: B</option>
                    <option value="c">Correct: C</option>
                    <option value="d">Correct: D</option>
                  </select>

                  <input
                    value={question.explanation}
                    onChange={(event) => setQuestionValue(index, 'explanation', event.target.value)}
                    placeholder="Optional explanation"
                    className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-neutral-200 p-3">
            <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">Assign on Creation</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {clients.length === 0 ? (
                <p className="text-xs text-neutral-500">No client accounts available.</p>
              ) : (
                clients.map((client) => {
                  const clientId = String(client.userId);
                  const checked = assignedClientIds.includes(clientId);
                  return (
                    <label
                      key={`create-assign-${clientId}`}
                      className={`flex cursor-pointer items-center gap-2 rounded-md border px-2 py-2 text-xs ${
                        checked ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleCreateClientSelection(clientId)}
                        className="h-3.5 w-3.5 rounded border-neutral-300"
                      />
                      <span className="truncate">{clientLabel(client)}</span>
                    </label>
                  );
                })
              )}
            </div>
          </div>

          {createError ? (
            <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
              {createError}
            </p>
          ) : null}

          {createSuccess ? (
            <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
              {createSuccess}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={createLoading}
            className="cursor-pointer rounded-lg bg-neutral-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            {createLoading ? 'Creating guide...' : 'Create guide'}
          </button>
        </form>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">Guide Inbox</p>
            <p className="mt-1 text-sm text-neutral-600">Review guides, assignments, and client completion state.</p>
          </div>

          <div className="flex items-center gap-2">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search guides..."
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
            />
            <button
              type="button"
              onClick={loadGuides}
              disabled={loading}
              className="cursor-pointer rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-semibold text-neutral-800 transition hover:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {error ? (
          <EmptyState
            title="Education guides unavailable"
            description={error}
            actionLabel="Retry"
            onAction={loadGuides}
          />
        ) : loading && guides.length === 0 ? (
          <EmptyState title="Loading guides" description="Fetching guides and assignments now." />
        ) : filteredGuides.length === 0 ? (
          <EmptyState
            title="No matching guides"
            description={guides.length === 0 ? 'Create your first education guide above.' : 'Try a different search.'}
          />
        ) : (
          <div className="space-y-4">
            {filteredGuides.map((guide) => {
              const guideKey = String(guide.id);
              const draftIds = assignmentDrafts[guideKey] || (guide.assignments || []).map((assignment) => String(assignment.clientUserId));
              const assignmentByClientId = new Map(
                (guide.assignments || []).map((assignment) => [String(assignment.clientUserId), assignment])
              );

              return (
                <div key={`guide-${guide.id}`} className="rounded-lg border border-neutral-200 p-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold tracking-tight text-neutral-900">{guide.title}</h3>
                      <p className="mt-1 text-sm text-neutral-600">{guide.summary || 'No summary provided.'}</p>
                      <p className="mt-1 text-xs text-neutral-500">
                        Updated {formatDateTime(guide.updatedAt)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <StatusPill tone="blue">{guide.questionCount} quiz question{guide.questionCount === 1 ? '' : 's'}</StatusPill>
                      <StatusPill tone="yellow">{guide.assignmentSummary.totalAssigned} assigned</StatusPill>
                      <StatusPill tone={guide.assignmentSummary.completedCount > 0 ? 'green' : 'gray'}>
                        {guide.assignmentSummary.completedCount} completed
                      </StatusPill>
                    </div>
                  </div>

                  {guide.contentMarkdown ? (
                    <div className="mt-3 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs leading-6 text-neutral-700">
                      {guide.contentMarkdown.length > 500
                        ? `${guide.contentMarkdown.slice(0, 500)}...`
                        : guide.contentMarkdown}
                    </div>
                  ) : null}

                  <div className="mt-3 rounded-md border border-neutral-200 p-3">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">
                        Client Assignments
                      </p>
                      <button
                        type="button"
                        onClick={() => handleSaveAssignments(guide.id)}
                        disabled={assignmentSavingGuideId === guideKey}
                        className="cursor-pointer rounded-md border border-neutral-300 px-2 py-1.5 text-xs font-semibold text-neutral-700 transition hover:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {assignmentSavingGuideId === guideKey ? 'Saving...' : 'Save assignments'}
                      </button>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {clients.length === 0 ? (
                        <p className="text-xs text-neutral-500">No client accounts found.</p>
                      ) : (
                        clients.map((client) => {
                          const clientId = String(client.userId);
                          const checked = draftIds.includes(clientId);
                          const assignment = assignmentByClientId.get(clientId);

                          return (
                            <label
                              key={`guide-${guide.id}-client-${clientId}`}
                              className={`flex cursor-pointer flex-col gap-1 rounded-md border px-2 py-2 text-xs ${
                                checked ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200'
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => toggleGuideClientAssignment(guide.id, clientId)}
                                  className="h-3.5 w-3.5 rounded border-neutral-300"
                                />
                                <span className="truncate">{clientLabel(client)}</span>
                              </span>

                              {assignment ? (
                                <span className={`text-[11px] ${checked ? 'text-neutral-200' : 'text-neutral-500'}`}>
                                  {assignment.completedAt
                                    ? `Completed ${formatDate(assignment.completedAt)} (${assignment.latestScorePercent ?? 0}%)`
                                    : `Assigned ${formatDate(assignment.assignedAt)}`}
                                </span>
                              ) : (
                                <span className={`text-[11px] ${checked ? 'text-neutral-200' : 'text-neutral-400'}`}>
                                  Not assigned
                                </span>
                              )}
                            </label>
                          );
                        })
                      )}
                    </div>

                    {assignmentErrorByGuide[guideKey] ? (
                      <p className="mt-2 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                        {assignmentErrorByGuide[guideKey]}
                      </p>
                    ) : null}

                    {assignmentNoticeByGuide[guideKey] ? (
                      <p className="mt-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                        {assignmentNoticeByGuide[guideKey]}
                      </p>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
