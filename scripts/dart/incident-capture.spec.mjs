import { test, expect } from "@playwright/test";
import { randomUUID } from "node:crypto";
import AxeBuilder from "@axe-core/playwright";
test.setTimeout(240000);
const day = (offset = 0) =>
  new Date(Date.now() + offset * 86400000).toISOString().slice(0, 10);

async function prepareResponder(request) {
  const post = async (data) => {
    const response = await request.post("/api/readiness", {
      headers: { Origin: "http://127.0.0.1:3311" },
      data: { person_id: "P-000002", request_id: randomUUID(), ...data },
    });
    const result = await response.json();
    expect(response.ok(), JSON.stringify(result)).toBe(true);
    return result;
  };
  const who = (id) => post({ action: "development_identity", person_id: id });
  const read = async () =>
    (await request.get("/api/readiness?person_id=P-000002")).json();
  await who("P-000001");
  let data = await read();
  if (!data.credentials.length) {
    let a = data.assignments.find((a) => a.qualification_id === "LOGS");
    if (!a) {
      await who("P-000001");
      await post({
        action: "assign",
        qualification_id: "LOGS",
        qualification_version: 1,
      });
    }
    for (const task_id of ["LOG-1", "LOG-2"]) {
      await who("P-000002");
      a = (await read()).assignments.find((a) => a.qualification_id === "LOGS");
      const evidence = await post({
        action: "evidence",
        assignment_id: a.id,
        version: a.version,
        task_id,
        narrative: "Checked the test field work against its source.",
        observed_on: day(),
      });
      await who("P-000001");
      a = (await read()).assignments.find((a) => a.qualification_id === "LOGS");
      await post({
        action: "review_evidence",
        assignment_id: a.id,
        version: a.version,
        evidence_id: evidence.id,
        decision: "Verified",
        reason: "The test reviewer checked the work",
      });
    }
    for (const course_id of ["IS-100", "IS-200"])
      await post({
        action: "training",
        source_id: "SYNTHETIC",
        external_id: `OPS-${course_id}`,
        revision: 1,
        course_id,
        course_name: course_id,
        completed_on: day(),
        expires_on: day(90),
        verification: "Verified",
        issuer: "Test course provider",
        certificate_id: `OPS-CERT-${course_id}`,
        reason: "The test provider checked completion",
      });
    await who("P-000002");
    a = (await read()).assignments.find((a) => a.qualification_id === "LOGS");
    await post({
      action: "submit",
      assignment_id: a.id,
      version: a.version,
      reason: "Please review the finished work",
    });
    await who("P-000001");
    a = (await read()).assignments.find((a) => a.qualification_id === "LOGS");
    await post({
      action: "decide",
      assignment_id: a.id,
      version: a.version,
      decision: "Approved",
      expires_on: day(60),
      reason: "All required test work was checked",
    });
  }
  data = await read();
  const credential = data.credentials[0];
  if (credential.state === "Suspended")
    await post({
      action: "credential",
      credential_id: credential.id,
      version: credential.sequence,
      state: "Active",
      reason: "The test reviewer checked the source again",
    });
  if (!data.availability.some((a) => a.status === "Approved")) {
    await who("P-000002");
    const availability = await post({
      action: "availability",
      starts_on: day(),
      ends_on: day(7),
      timezone: "UTC",
      availability: "Available",
      reason_category: "Other",
    });
    await who("P-000001");
    await post({
      action: "decide_availability",
      availability_id: availability.id,
      version: 1,
      decision: "Approved",
      reason: "The supervisor checked these dates",
    });
  }
  await who("P-000001");
}
const captures = [];
async function capture(page, name, caption) {
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: process.env.DART_CAPTURE_OUTPUT + "/" + name + ".png",
    animations: "disabled",
  });
  captures.push({ name, caption, url: page.url() });
}
async function save(page, name) {
  const dialog = page.locator("dialog:not(.record-dialog)");
  await dialog.locator('button[type="submit"]').click();
  await expect(dialog)
    .not.toBeVisible()
    .catch(async (e) => {
      console.log(
        "Workflow dialog error",
        await dialog.locator('[role="alert"]').allTextContents(),
      );
      throw e;
    });
}
async function act(page, name, reason = "Checked the test field work") {
  await page.getByRole("button", { name, exact: true }).click();
  const field = page
    .locator("dialog:not(.record-dialog)")
    .locator('[name="reason"]');
  if (await field.count()) await field.fill(reason);
  const selection = page
    .locator("dialog:not(.record-dialog)")
    .locator('[name="selection_note"]');
  if (await selection.count())
    await selection.fill(
      "Choose the ready responder after reviewing the unconfirmed history",
    );
  await save(page, name);
}
async function tab(page, name) {
  const record = page.locator("dialog.record-dialog[open]");
  if (await record.count())
    await record.getByRole("button", { name: "Close record" }).click();
  await page.getByRole("tab", { name, exact: true }).click();
  if (["Orders", "Deployments"].includes(name)) {
    await expect(record).toHaveCount(0);
    await page
      .getByRole("table", {
        name: name === "Orders" ? "Deployment orders" : "Deployments",
        exact: true,
      })
      .locator("tbody button")
      .first()
      .click();
  }
}
async function actor(page, id) {
  const record = page.locator("dialog.record-dialog[open]");
  if (await record.count())
    await record.getByRole("button", { name: "Close record" }).click();
  await Promise.all([
    page.waitForEvent("load"),
    page.getByLabel("Test user").selectOption(id),
  ]);
  await expect(page.getByLabel("Test user")).toHaveValue(id);
  await expect(
    page.getByRole("heading", { name: "Harbor flood response", exact: true }),
  ).toBeVisible();
}

test("a responder accepts an approved order and finishes the deployment", async ({
  page,
  request,
}) => {
  await prepareResponder(request);
  await page.goto("/?view=operations");
  await page
    .getByRole("button", { name: "Create incident", exact: true })
    .click();
  await page.getByLabel("Incident name").fill("Harbor flood response");
  await page
    .getByLabel("Work to be done")
    .fill("Keep supplies and field records ready for the response");
  await page
    .locator("dialog:not(.record-dialog)")
    .getByLabel("Time zone", { exact: true })
    .selectOption("UTC");
  await save(page, "Create incident");
  await act(page, "Start incident");
  await page
    .getByRole("button", { name: "Add duty station", exact: true })
    .click();
  await page.getByLabel("Station name").fill("Harbor field office");
  await page.getByLabel("Place ID").fill("HARBOR-OFFICE");
  await save(page, "Add duty station");
  await page
    .getByRole("button", { name: "Add staffing need", exact: true })
    .click();
  await page
    .locator("dialog:not(.record-dialog)")
    .getByLabel("Position", { exact: true })
    .selectOption("LOGS:1");
  await page
    .locator("dialog:not(.record-dialog)")
    .getByLabel("Reason", { exact: true })
    .fill("Fill the field work position");
  await save(page, "Add staffing need");
  await expect(
    page.getByText("1 positions requested", { exact: true }),
  ).toBeVisible();
  await capture(
    page,
    "01-incident",
    "Harbor flood response with its field office and logistics need.",
  );
  const incidentId = new URL(page.url()).searchParams.get("incident");
  await request.post("/api/readiness", {
    headers: { Origin: "http://127.0.0.1:3311" },
    data: { action: "development_identity", person_id: "P-000003" },
  });
  const rules = await request.post("/api/operations", {
    headers: { Origin: "http://127.0.0.1:3311" },
    data: {
      action: "selection_rules",
      request_id: randomUUID(),
      incident_id: incidentId,
      version: 1,
      method: "Less deployment time",
      lookback_days: 365,
      authority: "Approved test comparison rule",
      reason: "Apply the saved comparison rule",
    },
  });
  expect(rules.ok(), await rules.text()).toBeTruthy();
  await request.post("/api/readiness", {
    headers: { Origin: "http://127.0.0.1:3311" },
    data: { action: "development_identity", person_id: "P-000001" },
  });
  await page.reload();
  await tab(page, "Needs");
  await page.getByLabel("Person", { exact: true }).selectOption("P-000002");
  await page.getByRole("button", { name: "Check person", exact: true }).click();
  await expect(
    page.getByText("Jordan Lee · Ready", { exact: true }),
  ).toBeVisible();
  await capture(
    page,
    "02-readiness",
    "Jordan Lee passes the current staffing check.",
  );
  await act(page, "Draft order");
  await tab(page, "Orders");
  await act(page, "Send for review");
  await actor(page, "P-000003");
  await tab(page, "Orders");
  await page.locator("[data-current-comparison]").click();
  await expect(page.locator("[data-current-comparison-results]")).toBeVisible();
  await capture(
    page,
    "03-review",
    "Sam Rivera reviews the saved order comparison before approval.",
  );
  await act(page, "Approve order");
  await actor(page, "P-000001");
  await tab(page, "Orders");
  await act(page, "Send order");
  await actor(page, "P-000002");
  await tab(page, "Orders");
  await capture(
    page,
    "04-offer",
    "Jordan Lee receives the issued order and can accept or decline it.",
  );
  await act(page, "Accept order");
  await tab(page, "Deployments");
  await act(page, "Start travel");
  await act(page, "Check in");
  await expect(page.locator("dialog.record-dialog[open]")).toContainText(
    "State: Active.",
  );
  await capture(
    page,
    "05-arrival",
    "Jordan Lee is checked in at Harbor field office.",
  );
  await actor(page, "P-000001");
  const eq = async (data) => {
    const response = await request.post("/api/equipment", {
      headers: { Origin: "http://127.0.0.1:3311" },
      data: {
        request_id: randomUUID(),
        effective_at: new Date().toISOString(),
        reason: "Checked the Harbor radio and handover",
        ...data,
      },
    });
    const result = await response.json();
    expect(response.ok(), JSON.stringify(result)).toBeTruthy();
    return result;
  };
  const assignment = (
    await (
      await request.get("/api/operations?incident_id=" + incidentId)
    ).json()
  ).deployments.find((d) => d.person_id === "P-000002");
  const radio = await eq({
    action: "create",
    organization_id: "R02",
    asset_tag: "HARBOR-RADIO-01",
    name: "Field radio",
    category: "Radio",
    serial_number: "SAMPLE-001",
    condition: "Good",
    use_kind: "Exercise",
  });
  await eq({
    action: "issue",
    item_id: radio.id,
    version: 1,
    holder_id: "P-000002",
    deployment_id: assignment.id,
    incident_id: incidentId,
    package_id: null,
    due_on: null,
  });
  await page.goto("/?view=equipment&item=" + radio.id);
  await expect(
    page.getByRole("dialog", { name: "Selected equipment" }),
  ).toContainText("Jordan Lee");
  await capture(
    page,
    "07-radio-issued",
    "HARBOR-RADIO-01 is issued to Jordan Lee and linked to this deployment.",
  );
  await page.goto("/?view=operations&incident=" + incidentId);
  await actor(page, "P-000002");
  await tab(page, "Daily checks");
  await page
    .getByRole("button", { name: "Reply", exact: true })
    .first()
    .click();
  await save(page, "Reply to daily check");
  await page.reload();
  await tab(page, "Daily checks");
  await expect(
    page.getByRole("cell", { name: "Responded", exact: true }),
  ).toBeVisible();
  await capture(
    page,
    "06-daily-check",
    "Jordan Lee has replied to the opened daily check.",
  );
  await actor(page, "P-000001");
  await tab(page, "Deployments");
  await act(page, "Assign supervisor");
  await eq({
    action: "return",
    item_id: radio.id,
    version: 2,
    condition: "Good",
  });
  await page.goto("/?view=equipment&item=" + radio.id);
  await expect(
    page.getByRole("dialog", { name: "Selected equipment" }),
  ).toContainText("Inspection");
  await capture(
    page,
    "08-radio-returned",
    "Returning the radio clears custody and moves it to Inspection.",
  );
  await eq({
    action: "inspect",
    item_id: radio.id,
    version: 3,
    condition: "Good",
    state: "Available",
  });
  await page.goto("/?view=operations&incident=" + incidentId);
  await tab(page, "Deployments");
  await act(page, "Plan deployment end");
  for (const name of [
    "Check equipment checked",
    "Check evaluation assigned",
    "Check return travel checked",
  ]) {
    await page.getByRole("button", { name, exact: true }).click();
    await page
      .locator("dialog:not(.record-dialog)")
      .getByLabel("Reason", { exact: true })
      .fill("Checked the test end step");
    await save(page, "Check end step");
  }
  await expect(
    page
      .getByRole("table", { name: "End steps", exact: true })
      .getByRole("cell", { name: "Done", exact: true }),
  ).toHaveCount(3);
  await capture(
    page,
    "09-end-checks",
    "The end plan records three checked steps before completion.",
  );
  await actor(page, "P-000002");
  await tab(page, "Deployments");
  await act(page, "Check out");
  await actor(page, "P-000001");
  await tab(page, "Deployments");
  await act(page, "Record return");
  await act(page, "Finish deployment");
  await expect(
    page.getByRole("cell", { name: "Completed", exact: true }),
  ).toBeVisible();
  await capture(
    page,
    "10-completed",
    "Jordan Lee’s deployment is Completed after checkout and end checks.",
  );
  await page.getByRole("button", { name: "Close record" }).click();
  await act(page, "Wind down incident");
  await act(page, "Close incident");
  await page.reload();
  await expect(page.getByLabel("Incident", { exact: true })).toContainText(
    "Harbor flood response · Closed",
  );
  await capture(
    page,
    "11-closed",
    "Harbor flood response is Closed; its saved work remains available.",
  );
  await page.goto("/?view=development&person=P-000002");
  await tab(page, "Deployment reviews");
  await page.getByRole("button", { name: "Write review", exact: true }).click();
  await page
    .getByLabel("Work completed", { exact: true })
    .selectOption("Meets the task");
  await page
    .getByLabel("Working with others", { exact: true })
    .selectOption("Meets the task");
  await page
    .getByLabel("What you observed")
    .fill("The field records were checked and the team handoff was clear.");
  await page
    .locator("dialog:not(.record-dialog)")
    .getByLabel("Reason", { exact: true })
    .fill("Record the completed field work");
  await save(page, "Write review");
  await page
    .getByRole("button", { name: "Submit review", exact: true })
    .click();
  await page
    .locator("dialog:not(.record-dialog)")
    .getByLabel("Reason", { exact: true })
    .fill("Share the checked review");
  await save(page, "Submit review");
  await page.getByLabel("Test user").selectOption("P-000002");
  await expect(page.getByLabel("Test user")).toHaveValue("P-000002");
  await tab(page, "Deployment reviews");
  await page.locator("summary").filter({ hasText: "Submitted" }).click();
  await expect(
    page.getByText(
      "The field records were checked and the team handoff was clear.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Revise review", exact: true }),
  ).toHaveCount(0);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await capture(
    page,
    "12-review",
    "Jordan Lee can read the submitted review of this same deployment.",
  );
  const { writeFile } = await import("node:fs/promises");
  const final = await (
    await request.get("/api/operations?incident_id=" + incidentId)
  ).json();
  expect(final.incident.state).toBe("Closed");
  const completed = final.deployments.find((d) => d.id === assignment.id);
  expect(completed.state).toBe("Completed");
  expect(completed.returned_at).toBeTruthy();
  expect(
    final.visits
      .filter((v) => v.deployment_id === assignment.id)
      .every((v) => v.left_at),
  ).toBeTruthy();
  await writeFile(
    process.env.DART_CAPTURE_OUTPUT + "/capture-manifest.json",
    JSON.stringify(
      {
        capturedAt: new Date().toISOString(),
        incidentId,
        deploymentId: assignment.id,
        radioId: radio.id,
        captures,
      },
      null,
      2,
    ),
  );
});
