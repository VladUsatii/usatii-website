import { ensurePortalTables } from '@/lib/portal/schema';
import { portalSql } from '@/lib/portal/database';

const QUIZ_CHOICE_KEYS = ['a', 'b', 'c', 'd'];

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toIso(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function toPositiveInt(value) {
  const parsed = Number.parseInt(String(value ?? '').trim(), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return parsed;
}

function clampInteger(value, min, max) {
  const parsed = Number.parseInt(String(value ?? '').trim(), 10);
  if (!Number.isFinite(parsed)) return null;
  return Math.min(max, Math.max(min, parsed));
}

function normalizeText(value, maxLength = 4000) {
  return String(value || '').trim().slice(0, maxLength);
}

function toClientLabel(row) {
  return row.display_name || row.company || row.email || `Client ${row.client_user_id}`;
}

function normalizeChoice(value) {
  if (value === null || value === undefined) return null;

  if (typeof value === 'number' && Number.isFinite(value)) {
    const byIndex = QUIZ_CHOICE_KEYS[value];
    return byIndex || null;
  }

  const normalized = String(value || '').trim().toLowerCase();
  return QUIZ_CHOICE_KEYS.includes(normalized) ? normalized : null;
}

function normalizePassingPercent(value) {
  if (value === null || value === undefined || String(value).trim() === '') {
    return 70;
  }

  return clampInteger(value, 1, 100);
}

function normalizeGuideId(value) {
  return toPositiveInt(value);
}

function normalizeClientUserIds(values) {
  if (!Array.isArray(values)) return [];

  const deduped = new Set();

  for (const value of values) {
    const parsed = toPositiveInt(value);
    if (!parsed) continue;
    deduped.add(parsed);
  }

  return Array.from(deduped.values());
}

function invalidInputError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

function normalizeQuizQuestion(rawQuestion, index) {
  const prompt = normalizeText(rawQuestion?.prompt, 2000);
  if (!prompt) {
    throw invalidInputError('invalid_quiz_question', `Question ${index + 1} prompt is required.`);
  }

  const choicesFromArray = Array.isArray(rawQuestion?.choices) ? rawQuestion.choices : null;
  const choices = choicesFromArray || [
    rawQuestion?.optionA,
    rawQuestion?.optionB,
    rawQuestion?.optionC,
    rawQuestion?.optionD,
  ];

  const optionA = normalizeText(choices?.[0], 600);
  const optionB = normalizeText(choices?.[1], 600);
  const optionC = normalizeText(choices?.[2], 600);
  const optionD = normalizeText(choices?.[3], 600);

  if (!optionA || !optionB || !optionC || !optionD) {
    throw invalidInputError(
      'invalid_quiz_question',
      `Question ${index + 1} must include exactly 4 non-empty answer options.`
    );
  }

  const correctOption = normalizeChoice(rawQuestion?.correctOption);
  if (!correctOption) {
    throw invalidInputError(
      'invalid_quiz_question',
      `Question ${index + 1} must define a valid correct option (a, b, c, or d).`
    );
  }

  return {
    position: index + 1,
    prompt,
    optionA,
    optionB,
    optionC,
    optionD,
    correctOption,
    explanation: normalizeText(rawQuestion?.explanation, 2000) || null,
  };
}

function normalizeGuideDraft({
  title,
  summary,
  contentMarkdown,
  passingPercent,
  quizQuestions,
}) {
  const normalizedTitle = normalizeText(title, 180);
  if (!normalizedTitle) {
    throw invalidInputError('invalid_title', 'Guide title is required.');
  }

  const normalizedPassingPercent = normalizePassingPercent(passingPercent);
  if (!normalizedPassingPercent) {
    throw invalidInputError('invalid_passing_percent', 'Passing percent must be between 1 and 100.');
  }

  if (!Array.isArray(quizQuestions) || quizQuestions.length === 0) {
    throw invalidInputError('invalid_quiz_questions', 'Add at least one quiz question.');
  }

  if (quizQuestions.length > 20) {
    throw invalidInputError('invalid_quiz_questions', 'Quiz cannot exceed 20 questions.');
  }

  const normalizedQuizQuestions = quizQuestions.map(normalizeQuizQuestion);

  return {
    title: normalizedTitle,
    summary: normalizeText(summary, 2000) || null,
    contentMarkdown: normalizeText(contentMarkdown, 50000),
    passingPercent: normalizedPassingPercent,
    quizQuestions: normalizedQuizQuestions,
  };
}

async function ensureGuideExists(guideId) {
  const result = await portalSql`
    SELECT id
    FROM education_guides
    WHERE id = ${guideId}
      AND is_active = TRUE
    LIMIT 1
  `;

  if (result.rowCount === 0) {
    throw invalidInputError('guide_not_found', 'Education guide not found.');
  }
}

async function ensureClientUsersExist(clientUserIds) {
  for (const clientUserId of clientUserIds) {
    const result = await portalSql`
      SELECT id
      FROM portal_users
      WHERE id = ${clientUserId}
        AND role = 'client'
      LIMIT 1
    `;

    if (result.rowCount === 0) {
      throw invalidInputError(
        'invalid_client_ids',
        `Client ${clientUserId} does not exist or is not a client account.`
      );
    }
  }
}

function mapAdminQuizQuestion(row) {
  return {
    id: toNumber(row.id),
    position: toNumber(row.position),
    prompt: row.prompt || '',
    choices: {
      a: row.option_a || '',
      b: row.option_b || '',
      c: row.option_c || '',
      d: row.option_d || '',
    },
    correctOption: row.correct_option || 'a',
    explanation: row.explanation || '',
  };
}

function mapClientQuizQuestion(row) {
  return {
    id: toNumber(row.id),
    position: toNumber(row.position),
    prompt: row.prompt || '',
    choices: {
      a: row.option_a || '',
      b: row.option_b || '',
      c: row.option_c || '',
      d: row.option_d || '',
    },
  };
}

async function fetchGuideQuestions(guideId) {
  const result = await portalSql`
    SELECT
      id,
      guide_id,
      position,
      prompt,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_option,
      explanation
    FROM education_quiz_questions
    WHERE guide_id = ${guideId}
    ORDER BY position ASC, id ASC
  `;

  return result.rows;
}

async function fetchGuideAssignmentsForAdmin(guideId) {
  const result = await portalSql`
    SELECT
      a.id,
      a.guide_id,
      a.client_user_id,
      a.assigned_at,
      a.completed_at,
      a.latest_score_percent,
      a.latest_correct_count,
      a.latest_total_count,
      a.updated_at,
      u.email,
      cp.display_name,
      cp.company
    FROM client_education_assignments a
    INNER JOIN portal_users u ON u.id = a.client_user_id
    LEFT JOIN client_profiles cp ON cp.user_id = a.client_user_id
    WHERE a.guide_id = ${guideId}
    ORDER BY a.assigned_at DESC, a.id DESC
  `;

  return result.rows.map((row) => ({
    assignmentId: toNumber(row.id),
    guideId: toNumber(row.guide_id),
    clientUserId: toNumber(row.client_user_id),
    clientEmail: row.email || '',
    clientLabel: toClientLabel(row),
    assignedAt: toIso(row.assigned_at),
    completedAt: toIso(row.completed_at),
    latestScorePercent: row.latest_score_percent === null ? null : toNumber(row.latest_score_percent),
    latestCorrectCount: row.latest_correct_count === null ? null : toNumber(row.latest_correct_count),
    latestTotalCount: row.latest_total_count === null ? null : toNumber(row.latest_total_count),
    status: row.completed_at ? 'completed' : 'assigned',
    updatedAt: toIso(row.updated_at),
  }));
}

function summarizeGuideAssignments(assignments) {
  const totalAssigned = assignments.length;
  const completedCount = assignments.filter((assignment) => assignment.completedAt).length;
  const completionPercent = totalAssigned > 0
    ? Math.round((completedCount / totalAssigned) * 100)
    : 0;

  return {
    totalAssigned,
    completedCount,
    completionPercent,
  };
}

export async function listAdminEducationGuides() {
  await ensurePortalTables();

  const guidesResult = await portalSql`
    SELECT
      id,
      title,
      summary,
      content_markdown,
      passing_percent,
      is_active,
      created_by_user_id,
      created_at,
      updated_at
    FROM education_guides
    WHERE is_active = TRUE
    ORDER BY updated_at DESC, id DESC
  `;

  const guides = await Promise.all(
    guidesResult.rows.map(async (guideRow) => {
      const guideId = toNumber(guideRow.id);
      const [questionRows, assignments] = await Promise.all([
        fetchGuideQuestions(guideId),
        fetchGuideAssignmentsForAdmin(guideId),
      ]);

      const questions = questionRows.map(mapAdminQuizQuestion);
      const assignmentSummary = summarizeGuideAssignments(assignments);

      return {
        id: guideId,
        title: guideRow.title || '',
        summary: guideRow.summary || '',
        contentMarkdown: guideRow.content_markdown || '',
        passingPercent: toNumber(guideRow.passing_percent, 70),
        isActive: Boolean(guideRow.is_active),
        questionCount: questions.length,
        questions,
        assignments,
        assignmentSummary,
        createdByUserId: guideRow.created_by_user_id ? toNumber(guideRow.created_by_user_id) : null,
        createdAt: toIso(guideRow.created_at),
        updatedAt: toIso(guideRow.updated_at),
      };
    })
  );

  const summary = guides.reduce(
    (accumulator, guide) => {
      accumulator.totalGuides += 1;
      accumulator.totalQuestions += guide.questionCount;
      accumulator.totalAssignments += guide.assignmentSummary.totalAssigned;
      accumulator.totalCompleted += guide.assignmentSummary.completedCount;
      return accumulator;
    },
    {
      totalGuides: 0,
      totalQuestions: 0,
      totalAssignments: 0,
      totalCompleted: 0,
    }
  );

  summary.completionPercent = summary.totalAssignments > 0
    ? Math.round((summary.totalCompleted / summary.totalAssignments) * 100)
    : 0;

  return {
    guides,
    summary,
  };
}

export async function createEducationGuide({
  title,
  summary,
  contentMarkdown,
  passingPercent,
  quizQuestions,
  assignedClientUserIds = [],
  createdByUserId = null,
}) {
  await ensurePortalTables();

  const normalizedGuide = normalizeGuideDraft({
    title,
    summary,
    contentMarkdown,
    passingPercent,
    quizQuestions,
  });

  const normalizedClientUserIds = normalizeClientUserIds(assignedClientUserIds);
  await ensureClientUsersExist(normalizedClientUserIds);

  const guideInsert = await portalSql`
    INSERT INTO education_guides (
      title,
      summary,
      content_markdown,
      passing_percent,
      created_by_user_id
    ) VALUES (
      ${normalizedGuide.title},
      ${normalizedGuide.summary},
      ${normalizedGuide.contentMarkdown},
      ${normalizedGuide.passingPercent},
      ${createdByUserId || null}
    )
    RETURNING id
  `;

  const guideId = toNumber(guideInsert.rows[0]?.id);

  for (const question of normalizedGuide.quizQuestions) {
    await portalSql`
      INSERT INTO education_quiz_questions (
        guide_id,
        position,
        prompt,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_option,
        explanation
      ) VALUES (
        ${guideId},
        ${question.position},
        ${question.prompt},
        ${question.optionA},
        ${question.optionB},
        ${question.optionC},
        ${question.optionD},
        ${question.correctOption},
        ${question.explanation}
      )
    `;
  }

  if (normalizedClientUserIds.length > 0) {
    for (const clientUserId of normalizedClientUserIds) {
      await portalSql`
        INSERT INTO client_education_assignments (
          guide_id,
          client_user_id,
          assigned_by_user_id
        ) VALUES (
          ${guideId},
          ${clientUserId},
          ${createdByUserId || null}
        )
        ON CONFLICT (guide_id, client_user_id)
        DO NOTHING
      `;
    }
  }

  return {
    id: guideId,
  };
}

export async function setGuideClientAssignments({
  guideId,
  clientUserIds = [],
  assignedByUserId = null,
}) {
  await ensurePortalTables();

  const normalizedGuideId = normalizeGuideId(guideId);
  if (!normalizedGuideId) {
    throw invalidInputError('invalid_guide_id', 'Guide id must be numeric.');
  }

  await ensureGuideExists(normalizedGuideId);

  const normalizedClientUserIds = normalizeClientUserIds(clientUserIds);
  await ensureClientUsersExist(normalizedClientUserIds);

  if (normalizedClientUserIds.length === 0) {
    await portalSql`
      DELETE FROM client_education_assignments
      WHERE guide_id = ${normalizedGuideId}
    `;
  } else {
    const existingAssignments = await portalSql`
      SELECT id, client_user_id
      FROM client_education_assignments
      WHERE guide_id = ${normalizedGuideId}
    `;

    const allowedClientIds = new Set(normalizedClientUserIds.map((value) => String(value)));

    for (const assignment of existingAssignments.rows) {
      const currentClientId = String(assignment.client_user_id);
      if (allowedClientIds.has(currentClientId)) continue;

      await portalSql`
        DELETE FROM client_education_assignments
        WHERE id = ${assignment.id}
          AND guide_id = ${normalizedGuideId}
      `;
    }

    for (const clientUserId of normalizedClientUserIds) {
      await portalSql`
        INSERT INTO client_education_assignments (
          guide_id,
          client_user_id,
          assigned_by_user_id
        ) VALUES (
          ${normalizedGuideId},
          ${clientUserId},
          ${assignedByUserId || null}
        )
        ON CONFLICT (guide_id, client_user_id)
        DO UPDATE SET
          assigned_by_user_id = COALESCE(client_education_assignments.assigned_by_user_id, EXCLUDED.assigned_by_user_id),
          updated_at = NOW()
      `;
    }
  }

  const assignments = await fetchGuideAssignmentsForAdmin(normalizedGuideId);

  return {
    guideId: normalizedGuideId,
    assignments,
    assignmentSummary: summarizeGuideAssignments(assignments),
  };
}

export async function listClientAssignedEducation({ clientUserId }) {
  await ensurePortalTables();

  const result = await portalSql`
    SELECT
      a.id AS assignment_id,
      a.guide_id,
      a.assigned_at,
      a.completed_at,
      a.latest_score_percent,
      a.latest_correct_count,
      a.latest_total_count,
      g.title,
      g.summary,
      g.content_markdown,
      g.passing_percent,
      g.updated_at AS guide_updated_at,
      (
        SELECT COUNT(*)::int
        FROM client_education_attempts attempts
        WHERE attempts.assignment_id = a.id
      ) AS attempt_count
    FROM client_education_assignments a
    INNER JOIN education_guides g ON g.id = a.guide_id
    WHERE a.client_user_id = ${clientUserId}
      AND g.is_active = TRUE
    ORDER BY COALESCE(a.completed_at, a.assigned_at) DESC, a.id DESC
  `;

  const questionsByGuide = new Map();

  for (const row of result.rows) {
    const guideId = toNumber(row.guide_id);
    if (questionsByGuide.has(guideId)) continue;

    const questionRows = await fetchGuideQuestions(guideId);
    questionsByGuide.set(guideId, questionRows.map(mapClientQuizQuestion));
  }

  const assignments = result.rows.map((row) => {
    const guideId = toNumber(row.guide_id);
    const questions = questionsByGuide.get(guideId) || [];
    const totalQuestions = questions.length;

    return {
      assignmentId: toNumber(row.assignment_id),
      guideId,
      assignedAt: toIso(row.assigned_at),
      completedAt: toIso(row.completed_at),
      latestScorePercent: row.latest_score_percent === null ? null : toNumber(row.latest_score_percent),
      latestCorrectCount: row.latest_correct_count === null ? null : toNumber(row.latest_correct_count),
      latestTotalCount: row.latest_total_count === null ? totalQuestions : toNumber(row.latest_total_count),
      attemptCount: toNumber(row.attempt_count),
      status: row.completed_at ? 'completed' : 'assigned',
      guide: {
        id: guideId,
        title: row.title || '',
        summary: row.summary || '',
        contentMarkdown: row.content_markdown || '',
        passingPercent: toNumber(row.passing_percent, 70),
        updatedAt: toIso(row.guide_updated_at),
        questions,
      },
    };
  });

  const summary = assignments.reduce(
    (accumulator, assignment) => {
      accumulator.assignedCount += 1;
      if (assignment.completedAt) accumulator.completedCount += 1;
      if (assignment.latestScorePercent !== null) {
        accumulator.totalScored += 1;
        accumulator.totalScorePercent += assignment.latestScorePercent;
      }
      return accumulator;
    },
    {
      assignedCount: 0,
      completedCount: 0,
      completionPercent: 0,
      totalScored: 0,
      totalScorePercent: 0,
      averageScorePercent: 0,
    }
  );

  summary.completionPercent = summary.assignedCount > 0
    ? Math.round((summary.completedCount / summary.assignedCount) * 100)
    : 0;
  summary.averageScorePercent = summary.totalScored > 0
    ? Math.round(summary.totalScorePercent / summary.totalScored)
    : 0;

  return {
    summary,
    assignments,
  };
}

function normalizeAnswerMap(rawAnswers) {
  if (!rawAnswers || typeof rawAnswers !== 'object' || Array.isArray(rawAnswers)) {
    throw invalidInputError('invalid_answers', 'Answers payload must be an object keyed by question id.');
  }

  const normalized = new Map();

  for (const [questionIdRaw, selectedChoiceRaw] of Object.entries(rawAnswers)) {
    const questionId = toPositiveInt(questionIdRaw);
    if (!questionId) continue;

    const selectedChoice = normalizeChoice(selectedChoiceRaw);
    if (!selectedChoice) continue;

    normalized.set(questionId, selectedChoice);
  }

  if (normalized.size === 0) {
    throw invalidInputError('invalid_answers', 'At least one answer must be selected.');
  }

  return normalized;
}

export async function submitClientEducationQuiz({
  assignmentId,
  clientUserId,
  answers,
}) {
  await ensurePortalTables();

  const normalizedAssignmentId = toPositiveInt(assignmentId);
  if (!normalizedAssignmentId) {
    throw invalidInputError('invalid_assignment_id', 'Assignment id must be numeric.');
  }

  const assignmentResult = await portalSql`
    SELECT
      a.id,
      a.guide_id,
      a.client_user_id,
      a.completed_at,
      g.passing_percent
    FROM client_education_assignments a
    INNER JOIN education_guides g ON g.id = a.guide_id
    WHERE a.id = ${normalizedAssignmentId}
      AND a.client_user_id = ${clientUserId}
      AND g.is_active = TRUE
    LIMIT 1
  `;

  if (assignmentResult.rowCount === 0) {
    return null;
  }

  const assignment = assignmentResult.rows[0];
  const questionRows = await fetchGuideQuestions(toNumber(assignment.guide_id));

  if (questionRows.length === 0) {
    throw invalidInputError('invalid_quiz_questions', 'This guide has no quiz questions configured.');
  }

  const answerMap = normalizeAnswerMap(answers);
  const totalCount = questionRows.length;
  let correctCount = 0;

  const serializedAnswers = {};

  for (const row of questionRows) {
    const questionId = toNumber(row.id);
    const selectedChoice = answerMap.get(questionId) || null;

    if (selectedChoice && selectedChoice === row.correct_option) {
      correctCount += 1;
    }

    if (selectedChoice) {
      serializedAnswers[String(questionId)] = selectedChoice;
    }
  }

  const scorePercent = Math.round((correctCount / totalCount) * 100);
  const passingPercent = toNumber(assignment.passing_percent, 70);
  const passed = scorePercent >= passingPercent;

  const attemptInsert = await portalSql`
    INSERT INTO client_education_attempts (
      assignment_id,
      client_user_id,
      score_percent,
      correct_count,
      total_count,
      answers_json
    ) VALUES (
      ${normalizedAssignmentId},
      ${clientUserId},
      ${scorePercent},
      ${correctCount},
      ${totalCount},
      ${JSON.stringify(serializedAnswers)}
    )
    RETURNING id, submitted_at
  `;

  const assignmentUpdate = await portalSql`
    UPDATE client_education_assignments
    SET
      latest_score_percent = ${scorePercent},
      latest_correct_count = ${correctCount},
      latest_total_count = ${totalCount},
      completed_at = CASE
        WHEN completed_at IS NULL AND ${passed} = TRUE
          THEN NOW()
        ELSE completed_at
      END,
      updated_at = NOW()
    WHERE id = ${normalizedAssignmentId}
      AND client_user_id = ${clientUserId}
    RETURNING completed_at
  `;

  return {
    assignmentId: normalizedAssignmentId,
    attemptId: toNumber(attemptInsert.rows[0]?.id),
    submittedAt: toIso(attemptInsert.rows[0]?.submitted_at),
    scorePercent,
    correctCount,
    totalCount,
    passingPercent,
    passed,
    completedAt: toIso(assignmentUpdate.rows[0]?.completed_at),
  };
}
