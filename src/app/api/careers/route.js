import { createCareerApplicationHandler } from '@/lib/careers/submit-application';
import { saveCareerApplication } from '@/lib/careers/applications';
import { verifyCareerHuman } from '@/lib/careers/human-verification';
import { recordTelemetryApiRequest } from '@/lib/portal/telemetry';

import { deliverPendingCareerNotifications } from '@/lib/careers/notifications';

export const runtime = 'nodejs';
export const POST = createCareerApplicationHandler({
  verifyHuman: verifyCareerHuman,
  saveApplication: saveCareerApplication,
  notifyApplication: deliverPendingCareerNotifications,
  recordTelemetry: recordTelemetryApiRequest,
});
