/*
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import type {
  GrievanceActorRole,
  GrievanceDetail,
  GrievanceStatus,
  GrievanceSubmissionInput,
  GrievanceTimelineEntry,
} from '../../../types/grievance'
import { DATA_PROTECTION_OFFICER_NAME, GRIEVANCE_CATEGORY_PRIORITY } from '../constants'

export const CURRENT_DATA_PRINCIPAL_NAME = 'Asha Fernando'

const NOW = Date.now()
const HOUR_IN_MS = 1000 * 60 * 60
const STATUTORY_SLA_DAYS = 90

function fromNow(hoursOffset: number): string {
  return new Date(NOW + hoursOffset * HOUR_IN_MS).toISOString()
}

function statutoryDueDateFor(daysAgo: number): string {
  return fromNow((STATUTORY_SLA_DAYS - daysAgo) * 24)
}

function timelineEntry(
  entry: Omit<GrievanceTimelineEntry, 'timestamp'> & { hoursOffset: number },
): GrievanceTimelineEntry {
  const { hoursOffset, ...rest } = entry

  return { ...rest, timestamp: fromNow(hoursOffset) }
}

export const MOCK_GRIEVANCES: GrievanceDetail[] = [
  {
    id: 'grv-04821',
    referenceId: 'GRV-2026-04821',
    category: 'unauthorizedDataSharing',
    priority: 'P0',
    status: 'AwaitingInfo',
    dataPrincipalName: CURRENT_DATA_PRINCIPAL_NAME,
    submittedAt: fromNow(-48),
    updatedAt: fromNow(-5),
    statutoryDueDate: statutoryDueDateFor(2),
    description:
      'My personal information was shared with another organization without my permission due to a security incident on the platform. I received a breach notification email on the morning of Jul 15 stating that a subset of customer records, including my name, mobile number, and partial bank account details, may have been exposed to an unauthorized third party sometime between Jul 10 and Jul 13. The email did not specify whether my specific account was part of the confirmed exposure, what data of mine was affected, or what containment steps have been taken. I have also since received two suspicious phone calls from an unknown number referencing a loan application I never discussed with anyone outside this platform, which makes me believe my data may already be circulating. I would like a full explanation of what was compromised, confirmation of whether my account was affected, and details of the remedial steps being taken, including whether this has been reported to the Data Protection Board of India as required under the DPDP Rules.',
    attachments: [
      { id: 'att-1', fileName: 'breach-notification-email.pdf', fileSizeLabel: '212 KB' },
      { id: 'att-2', fileName: 'suspicious-call-log-screenshot.png', fileSizeLabel: '1.1 MB' },
      {
        id: 'att-3',
        fileName: 'loan-application-reference-screenshot.jpg',
        fileSizeLabel: '890 KB',
      },
    ],
    timeline: [
      timelineEntry({
        id: 'tl-1',
        type: 'systemAcknowledgement',
        actorName: 'System',
        actorRole: 'System',
        visibility: 'shared',
        hoursOffset: -48,
        message:
          'Grievance received and reference ID GRV-2026-04821 generated. Acknowledgement sent by email.',
      }),
      timelineEntry({
        id: 'tl-2',
        type: 'statusChange',
        actorName: DATA_PROTECTION_OFFICER_NAME,
        actorRole: 'GrievanceOfficer',
        visibility: 'shared',
        hoursOffset: -28,
        fromStatus: 'Open',
        toStatus: 'Investigation',
        message:
          'Investigation started. Reviewing consent and access logs linked to the reported incident, and cross-referencing against the security team’s incident report INC-8842 to determine which accounts were within the confirmed exposure window.',
      }),
      timelineEntry({
        id: 'tl-3',
        type: 'note',
        actorName: DATA_PROTECTION_OFFICER_NAME,
        actorRole: 'GrievanceOfficer',
        visibility: 'internal',
        hoursOffset: -26,
        message:
          'Cross-checking with the security team incident report INC-8842 before responding to the Data Principal. Initial scope from the security team lists roughly 4,200 affected accounts; need to confirm if this Data Principal’s account ID falls within the exposed range before making any public statement.',
      }),
      timelineEntry({
        id: 'tl-4',
        type: 'communication',
        actorName: DATA_PROTECTION_OFFICER_NAME,
        actorRole: 'GrievanceOfficer',
        visibility: 'shared',
        hoursOffset: -22,
        message:
          'Thank you for the detailed report. Could you share screenshots or call logs for the suspicious calls you mentioned, along with the approximate dates and times you received them? This will help us determine whether they are connected to the exposed dataset or a separate, unrelated attempt.',
      }),
      timelineEntry({
        id: 'tl-5',
        type: 'statusChange',
        actorName: DATA_PROTECTION_OFFICER_NAME,
        actorRole: 'GrievanceOfficer',
        visibility: 'shared',
        hoursOffset: -21,
        fromStatus: 'Investigation',
        toStatus: 'AwaitingInfo',
        message:
          'Marked as awaiting information from the Data Principal regarding the suspicious calls before proceeding further.',
      }),
      timelineEntry({
        id: 'tl-6',
        type: 'communication',
        actorName: CURRENT_DATA_PRINCIPAL_NAME,
        actorRole: 'DataPrincipal',
        visibility: 'shared',
        hoursOffset: -19,
        message:
          'I received the first call on Jul 16 around 11:40 AM and the second on Jul 17 around 6:15 PM, both from the same number (+94 77 XXX 4821). The caller referenced a personal loan application and asked me to confirm my account number "to proceed", which I refused to share. I have attached a screenshot of my call log showing both call timestamps, and a separate screenshot of the loan reference number the caller mentioned, which I do not recognize as anything I applied for.',
        attachments: [
          { id: 'tl-6-att-1', fileName: 'call-log-jul16-jul17.png', fileSizeLabel: '640 KB' },
          { id: 'tl-6-att-2', fileName: 'loan-reference-number.jpg', fileSizeLabel: '410 KB' },
        ],
      }),
      timelineEntry({
        id: 'tl-7',
        type: 'statusChange',
        actorName: 'System',
        actorRole: 'System',
        visibility: 'shared',
        hoursOffset: -18.9997,
        fromStatus: 'AwaitingInfo',
        toStatus: 'WaitingOnDpo',
        message: 'The Data Principal responded. Awaiting review by the Grievance Officer.',
      }),
      timelineEntry({
        id: 'tl-8',
        type: 'note',
        actorName: DATA_PROTECTION_OFFICER_NAME,
        actorRole: 'GrievanceOfficer',
        visibility: 'internal',
        hoursOffset: -16,
        message:
          'Confirmed this account ID is within the exposed range per the security team’s list. Escalating the call-log and loan-reference attachments to the fraud investigation team for correlation with INC-8842, and flagging for possible Data Protection Board notification given confirmed downstream misuse.',
      }),
      timelineEntry({
        id: 'tl-9',
        type: 'statusChange',
        actorName: DATA_PROTECTION_OFFICER_NAME,
        actorRole: 'GrievanceOfficer',
        visibility: 'shared',
        hoursOffset: -15,
        fromStatus: 'WaitingOnDpo',
        toStatus: 'Investigation',
        message: 'Resuming active investigation after reviewing the additional evidence.',
      }),
      timelineEntry({
        id: 'tl-10',
        type: 'communication',
        actorName: DATA_PROTECTION_OFFICER_NAME,
        actorRole: 'GrievanceOfficer',
        visibility: 'shared',
        hoursOffset: -6,
        message:
          'Update: we have confirmed your account was within the affected dataset for incident INC-8842, and the exposed fields were limited to name, mobile number, and partial bank account details — no passwords or full account numbers were included. The suspicious calls you reported have been forwarded to our fraud team for correlation, and we are preparing a notification to the Data Protection Board of India as required under Rule 7. We will follow up with the outcome of the fraud-team review and any further containment steps within the next few days.',
      }),
      timelineEntry({
        id: 'tl-11',
        type: 'statusChange',
        actorName: DATA_PROTECTION_OFFICER_NAME,
        actorRole: 'GrievanceOfficer',
        visibility: 'shared',
        hoursOffset: -5,
        fromStatus: 'Investigation',
        toStatus: 'AwaitingInfo',
        message:
          'Marked as awaiting confirmation from the Data Principal on whether any further suspicious calls have been received before we close out the fraud-team review.',
      }),
    ],
  },
  {
    id: 'grv-04799',
    referenceId: 'GRV-2026-04799',
    category: 'unauthorizedDataSharing',
    priority: 'P0',
    status: 'Investigation',
    dataPrincipalName: 'Ravi Kumar',
    submittedAt: fromNow(-92 * 24),
    updatedAt: fromNow(-29),
    statutoryDueDate: statutoryDueDateFor(92),
    description:
      'My personal data was shared with a third party without my consent, and I only found out when it was reported publicly on a local news channel, which named this platform as the source of a data leak affecting thousands of users. I have not received any direct communication from the organization about whether my specific account was part of this leak, what data of mine was exposed, or what is being done about it. It has now been over three months since I first raised this complaint, and I am extremely concerned that it still has not been resolved and that my data may still be at risk.',
    attachments: [
      { id: 'att-1', fileName: 'news-report-screenshot.png', fileSizeLabel: '1.3 MB' },
      { id: 'att-2', fileName: 'leak-notice-forum-post.png', fileSizeLabel: '860 KB' },
    ],
    timeline: [
      timelineEntry({
        id: 'tl-1',
        type: 'systemAcknowledgement',
        actorName: 'System',
        actorRole: 'System',
        visibility: 'shared',
        hoursOffset: -92 * 24,
        message:
          'Grievance received and reference ID GRV-2026-04799 generated. Acknowledgement sent by SMS and email.',
      }),
      timelineEntry({
        id: 'tl-2',
        type: 'statusChange',
        actorName: DATA_PROTECTION_OFFICER_NAME,
        actorRole: 'GrievanceOfficer',
        visibility: 'shared',
        hoursOffset: -90 * 24,
        fromStatus: 'Open',
        toStatus: 'Investigation',
        message: 'Investigation started, given the severity of this report.',
      }),
      timelineEntry({
        id: 'tl-3',
        type: 'note',
        actorName: DATA_PROTECTION_OFFICER_NAME,
        actorRole: 'GrievanceOfficer',
        visibility: 'internal',
        hoursOffset: -60 * 24,
        message:
          'Awaiting confirmation from legal on whether Rule 14 notification obligations were met.',
      }),
      timelineEntry({
        id: 'tl-4',
        type: 'communication',
        actorName: 'Ravi Kumar',
        actorRole: 'DataPrincipal',
        visibility: 'shared',
        hoursOffset: -720,
        message:
          'It has been over a month since I last heard anything about this. Can someone please confirm whether my account was part of the leak reported in the news, and what is being done? I am worried about identity theft at this point.',
      }),
      timelineEntry({
        id: 'tl-5',
        type: 'statusChange',
        actorName: 'System',
        actorRole: 'System',
        visibility: 'shared',
        hoursOffset: -719.9997,
        fromStatus: 'Investigation',
        toStatus: 'WaitingOnDpo',
        message: 'The Data Principal responded. Awaiting review by the Grievance Officer.',
      }),
      timelineEntry({
        id: 'tl-6',
        type: 'note',
        actorName: DATA_PROTECTION_OFFICER_NAME,
        actorRole: 'GrievanceOfficer',
        visibility: 'internal',
        hoursOffset: -30,
        message:
          'The 90-day statutory deadline has now passed. This needs to be resolved immediately and reported to the Data Protection Board.',
      }),
      timelineEntry({
        id: 'tl-7',
        type: 'statusChange',
        actorName: DATA_PROTECTION_OFFICER_NAME,
        actorRole: 'GrievanceOfficer',
        visibility: 'shared',
        hoursOffset: -29,
        fromStatus: 'WaitingOnDpo',
        toStatus: 'Investigation',
        message:
          'Escalating internally given the missed statutory deadline. Resuming active investigation and preparing a Data Protection Board notification.',
      }),
    ],
  },
  {
    id: 'grv-04763',
    referenceId: 'GRV-2026-04763',
    category: 'unauthorizedDataSharing',
    priority: 'P0',
    status: 'AwaitingInfo',
    dataPrincipalName: CURRENT_DATA_PRINCIPAL_NAME,
    submittedAt: fromNow(-96),
    updatedAt: fromNow(-4),
    statutoryDueDate: statutoryDueDateFor(4),
    relatedConsentId: 'cnst-2026-00104',
    relatedConsentPurposeName: 'Claim Verification',
    description:
      'My personal data was shared with another organization without my permission, in connection with an insurance claim I never filed. I received a letter and a follow-up email from Nova Insurance referencing a claim under my name, addressed to my current residence, but I have never had any dealings with this insurer and never authorized my Claim Verification consent to be used to disclose my information to them. I am concerned someone may have used my identity to file a fraudulent claim, and I would like to understand exactly what data was shared, when, and under what authorization.',
    attachments: [
      { id: 'att-1', fileName: 'claim-notice-screenshot.png', fileSizeLabel: '1.4 MB' },
      { id: 'att-2', fileName: 'nova-insurance-letter.pdf', fileSizeLabel: '540 KB' },
    ],
    timeline: [
      timelineEntry({
        id: 'tl-1',
        type: 'systemAcknowledgement',
        actorName: 'System',
        actorRole: 'System',
        visibility: 'shared',
        hoursOffset: -96,
        message:
          'Grievance received and reference ID GRV-2026-04763 generated. Acknowledgement sent by email.',
      }),
      timelineEntry({
        id: 'tl-2',
        type: 'statusChange',
        actorName: DATA_PROTECTION_OFFICER_NAME,
        actorRole: 'GrievanceOfficer',
        visibility: 'shared',
        hoursOffset: -70,
        fromStatus: 'Open',
        toStatus: 'Investigation',
        message:
          'Reviewing the linked consent record to check whether disclosure to Nova Insurance was authorized.',
      }),
      timelineEntry({
        id: 'tl-3',
        type: 'statusChange',
        actorName: DATA_PROTECTION_OFFICER_NAME,
        actorRole: 'GrievanceOfficer',
        visibility: 'shared',
        hoursOffset: -4,
        fromStatus: 'Investigation',
        toStatus: 'AwaitingInfo',
        message:
          'Marked as awaiting clarification from the Data Principal. See the message thread for the question.',
      }),
      timelineEntry({
        id: 'tl-4',
        type: 'communication',
        actorName: DATA_PROTECTION_OFFICER_NAME,
        actorRole: 'GrievanceOfficer',
        visibility: 'shared',
        hoursOffset: -4,
        message:
          'Could you share the date you received the claim notice, and the name of the organization that contacted you?',
      }),
    ],
  },
  {
    id: 'grv-04701',
    referenceId: 'GRV-2026-04701',
    category: 'consentWithdrawalIssue',
    priority: 'P1',
    status: 'Investigation',
    dataPrincipalName: CURRENT_DATA_PRINCIPAL_NAME,
    submittedAt: fromNow(-72),
    updatedAt: fromNow(-12),
    statutoryDueDate: statutoryDueDateFor(3),
    relatedConsentId: 'cnst-2026-00231',
    relatedConsentPurposeName: 'Account Aggregation',
    description:
      "I withdrew my consent for Acme Bank two weeks ago but my transaction data is still being fetched by their app. I revoked the Account Aggregation consent from the Consent Manager dashboard on Jul 8, and received a confirmation that it was withdrawn. However, I noticed on Jul 20 that Acme Bank's app still shows my latest transactions from my primary savings account, which suggests they are still pulling data through the aggregator even though the consent should have been revoked nearly two weeks ago. I would like this confirmed and stopped immediately, as I no longer trust Acme Bank with continued access to my financial data.",
    attachments: [
      {
        id: 'att-1',
        fileName: 'acme-bank-app-transactions-screenshot.png',
        fileSizeLabel: '920 KB',
      },
    ],
    timeline: [
      timelineEntry({
        id: 'tl-1',
        type: 'systemAcknowledgement',
        actorName: 'System',
        actorRole: 'System',
        visibility: 'shared',
        hoursOffset: -72,
        message:
          'Grievance received and reference ID GRV-2026-04701 generated. Acknowledgement sent by email.',
      }),
      timelineEntry({
        id: 'tl-2',
        type: 'statusChange',
        actorName: DATA_PROTECTION_OFFICER_NAME,
        actorRole: 'GrievanceOfficer',
        visibility: 'shared',
        hoursOffset: -50,
        fromStatus: 'Open',
        toStatus: 'Investigation',
        message:
          'Checking the consent lifecycle events for CNST-2026-00231 against the revocation timestamp.',
      }),
      timelineEntry({
        id: 'tl-3',
        type: 'note',
        actorName: DATA_PROTECTION_OFFICER_NAME,
        actorRole: 'GrievanceOfficer',
        visibility: 'internal',
        hoursOffset: -12,
        message:
          'Consent shows REVOKED in the registry but the fiduciary access logs need to be requested to confirm processing stopped.',
      }),
      timelineEntry({
        id: 'tl-4',
        type: 'communication',
        actorName: DATA_PROTECTION_OFFICER_NAME,
        actorRole: 'GrievanceOfficer',
        visibility: 'shared',
        hoursOffset: -8,
        message:
          "Thanks for the screenshot — could you confirm the exact date and time you took it, and whether the account shown is the same one linked under the Account Aggregation consent? We have requested Acme Bank's access logs and want to make sure we are comparing against the right time window.",
      }),
    ],
  },
  {
    id: 'grv-04688',
    referenceId: 'GRV-2026-04688',
    category: 'consentManagerIssue',
    priority: 'P2',
    status: 'Open',
    dataPrincipalName: 'Meera Nair',
    submittedAt: fromNow(-20),
    updatedAt: fromNow(-20),
    statutoryDueDate: statutoryDueDateFor(1),
    description:
      'The Consent Manager shows an active consent record under my name that I never actually approved. When I logged into the Consent Manager dashboard on Jul 19 to review my active consents, I found one linked to "QuickCredit Finance" for a "Loan Eligibility Check" purpose, dated Jul 5, which I have no memory of ever approving. I have never used or heard of QuickCredit Finance before seeing this record. I would like this consent investigated and removed if it was indeed never approved by me, along with an explanation of how it was created.',
    attachments: [
      { id: 'att-1', fileName: 'consent-manager-record-screenshot.png', fileSizeLabel: '610 KB' },
    ],
    timeline: [
      timelineEntry({
        id: 'tl-1',
        type: 'systemAcknowledgement',
        actorName: 'System',
        actorRole: 'System',
        visibility: 'shared',
        hoursOffset: -20,
        message:
          'Grievance received and reference ID GRV-2026-04688 generated. Acknowledgement sent by email.',
      }),
    ],
  },
  {
    id: 'grv-04652',
    referenceId: 'GRV-2026-04652',
    category: 'other',
    priority: 'P3',
    status: 'Investigation',
    dataPrincipalName: 'Suresh Iyer',
    submittedAt: fromNow(-80 * 24),
    updatedAt: fromNow(-10),
    statutoryDueDate: statutoryDueDateFor(80),
    description:
      "My child's data was processed by a learning app without the required verifiable parental consent. My 9-year-old signed up for the \"BrightPath Learning\" app using our shared family tablet on Jun 2, and the sign-up flow only asked for a name, a grade level, and a parent email address for a welcome message — at no point was I asked to verify my identity as a parent or explicitly approve the processing of my child's data, as required for children's data under the DPDP Act. I have attached the app's sign-up confirmation record and a screenshot of the sign-up screens showing no parental verification step.",
    attachments: [
      { id: 'att-1', fileName: 'app-signup-record.pdf', fileSizeLabel: '340 KB' },
      { id: 'att-2', fileName: 'signup-flow-screenshots.png', fileSizeLabel: '1.2 MB' },
    ],
    timeline: [
      timelineEntry({
        id: 'tl-1',
        type: 'systemAcknowledgement',
        actorName: 'System',
        actorRole: 'System',
        visibility: 'shared',
        hoursOffset: -80 * 24,
        message:
          'Grievance received and reference ID GRV-2026-04652 generated. Acknowledgement sent by email.',
      }),
      timelineEntry({
        id: 'tl-2',
        type: 'statusChange',
        actorName: DATA_PROTECTION_OFFICER_NAME,
        actorRole: 'GrievanceOfficer',
        visibility: 'shared',
        hoursOffset: -78 * 24,
        fromStatus: 'Open',
        toStatus: 'Investigation',
        message:
          'Reviewing age-verification and parental consent capture flow for the reported application.',
      }),
      timelineEntry({
        id: 'tl-3',
        type: 'note',
        actorName: DATA_PROTECTION_OFFICER_NAME,
        actorRole: 'GrievanceOfficer',
        visibility: 'internal',
        hoursOffset: -40 * 24,
        message:
          "Confirmed with the product team that BrightPath Learning's sign-up flow does not currently include an age-gate or verifiable parental consent step. Requesting a fix timeline and a list of all accounts created without this step for retroactive consent collection.",
      }),
      timelineEntry({
        id: 'tl-4',
        type: 'communication',
        actorName: DATA_PROTECTION_OFFICER_NAME,
        actorRole: 'GrievanceOfficer',
        visibility: 'shared',
        hoursOffset: -10,
        message:
          "Thank you for the detailed report and screenshots. We have confirmed this app is missing the required verifiable parental consent step and are working with the product team on both a fix and retroactive consent collection for existing child accounts, including your child's. We will follow up once this is completed.",
      }),
    ],
  },
  {
    id: 'grv-04590',
    referenceId: 'GRV-2026-04590',
    category: 'purposeViolation',
    priority: 'P1',
    status: 'Resolved',
    dataPrincipalName: CURRENT_DATA_PRINCIPAL_NAME,
    submittedAt: fromNow(-288),
    updatedAt: fromNow(-18),
    statutoryDueDate: statutoryDueDateFor(12),
    description:
      'My data is being used for marketing emails, but I only consented to it being used for account security notifications. I have been receiving promotional emails about credit card offers and cashback deals roughly once a week since March, even though when I reviewed my original consent record on the portal, the only approved purpose listed was "Account Security Notifications" — nothing related to marketing. I have attached screenshots of two of the promotional emails I received, along with a screenshot of my consent history page showing the single approved purpose. I would like this to stop immediately, and I would also like an explanation of how my contact details ended up on a marketing list I never consented to.',
    attachments: [
      { id: 'att-1', fileName: 'marketing-email-1.png', fileSizeLabel: '780 KB' },
      { id: 'att-2', fileName: 'marketing-email-2.png', fileSizeLabel: '705 KB' },
      { id: 'att-3', fileName: 'consent-history-screenshot.png', fileSizeLabel: '340 KB' },
    ],
    timeline: [
      timelineEntry({
        id: 'tl-1',
        type: 'systemAcknowledgement',
        actorName: 'System',
        actorRole: 'System',
        visibility: 'shared',
        hoursOffset: -288,
        message:
          'Grievance received and reference ID GRV-2026-04590 generated. Acknowledgement sent by email.',
      }),
      timelineEntry({
        id: 'tl-2',
        type: 'statusChange',
        actorName: DATA_PROTECTION_OFFICER_NAME,
        actorRole: 'GrievanceOfficer',
        visibility: 'shared',
        hoursOffset: -240,
        fromStatus: 'Open',
        toStatus: 'Investigation',
        message:
          'Comparing the purposes on the consent record against the marketing campaign logs to determine how this contact was added to the mailing list.',
      }),
      timelineEntry({
        id: 'tl-3',
        type: 'communication',
        actorName: DATA_PROTECTION_OFFICER_NAME,
        actorRole: 'GrievanceOfficer',
        visibility: 'shared',
        hoursOffset: -210,
        message:
          'Thanks for flagging this. Could you forward the marketing emails you received, or share screenshots of the sender address and subject line? That will help us trace which campaign list your contact was pulled into.',
      }),
      timelineEntry({
        id: 'tl-4',
        type: 'communication',
        actorName: CURRENT_DATA_PRINCIPAL_NAME,
        actorRole: 'DataPrincipal',
        visibility: 'shared',
        hoursOffset: -190,
        message:
          'Attached two examples — both sent from "offers@ourbank-promos.com", one on Mar 14 about a cashback credit card and another on Mar 21 about a personal loan offer. Neither of these relate to account security, which is the only thing I approved.',
        attachments: [
          { id: 'tl-4-att-1', fileName: 'marketing-email-mar14.png', fileSizeLabel: '780 KB' },
          { id: 'tl-4-att-2', fileName: 'marketing-email-mar21.png', fileSizeLabel: '705 KB' },
        ],
      }),
      timelineEntry({
        id: 'tl-5',
        type: 'statusChange',
        actorName: 'System',
        actorRole: 'System',
        visibility: 'shared',
        hoursOffset: -189.9997,
        fromStatus: 'Investigation',
        toStatus: 'WaitingOnDpo',
        message: 'The Data Principal responded. Awaiting review by the Grievance Officer.',
      }),
      timelineEntry({
        id: 'tl-6',
        type: 'note',
        actorName: DATA_PROTECTION_OFFICER_NAME,
        actorRole: 'GrievanceOfficer',
        visibility: 'internal',
        hoursOffset: -120,
        message:
          'Traced the sender domain to the Q1 cashback-offers campaign run by the marketing team. Their segment list was built from the full customer table rather than filtering by approved purpose — confirmed with marketing lead that this contact should not have been included. Requesting removal from all active campaign lists and a fix to their segment-build query.',
      }),
      timelineEntry({
        id: 'tl-7',
        type: 'resolution',
        actorName: DATA_PROTECTION_OFFICER_NAME,
        actorRole: 'GrievanceOfficer',
        visibility: 'shared',
        hoursOffset: -18,
        fromStatus: 'WaitingOnDpo',
        toStatus: 'Resolved',
        message:
          'Confirmed the marketing purpose was not part of your consent — your contact was included in a campaign segment that incorrectly pulled from the full customer table instead of filtering by approved purpose. Your contact has been removed from all active marketing lists, and the marketing team has corrected their segment-build query to filter strictly by approved consent purpose going forward. Attached is the removal confirmation from the campaign platform.',
        attachments: [
          {
            id: 'tl-7-att-1',
            fileName: 'marketing-list-removal-confirmation.pdf',
            fileSizeLabel: '128 KB',
          },
        ],
      }),
    ],
  },
  {
    id: 'grv-04533',
    referenceId: 'GRV-2026-04533',
    category: 'dataErasureRequestNotFulfilled',
    priority: 'P1',
    status: 'Resolved',
    dataPrincipalName: 'Ravi Kumar',
    submittedAt: fromNow(-25 * 24),
    updatedAt: fromNow(-80),
    statutoryDueDate: statutoryDueDateFor(25),
    description:
      'I requested deletion of my personal data three months ago, but it is still retained by the data fiduciary. I submitted an erasure request to HealthSync Labs on Apr 10 after closing my account with them, and received an automated confirmation that the request was received, but as of today I can still log into their portal and see my old lab reports and personal details. I have attached the original erasure request confirmation email and a recent screenshot showing my data is still accessible.',
    attachments: [
      { id: 'att-1', fileName: 'erasure-request-confirmation.pdf', fileSizeLabel: '156 KB' },
      {
        id: 'att-2',
        fileName: 'portal-data-still-visible-screenshot.png',
        fileSizeLabel: '480 KB',
      },
    ],
    timeline: [
      timelineEntry({
        id: 'tl-1',
        type: 'systemAcknowledgement',
        actorName: 'System',
        actorRole: 'System',
        visibility: 'shared',
        hoursOffset: -25 * 24,
        message:
          'Grievance received and reference ID GRV-2026-04533 generated. Acknowledgement sent by email.',
      }),
      timelineEntry({
        id: 'tl-1b',
        type: 'statusChange',
        actorName: DATA_PROTECTION_OFFICER_NAME,
        actorRole: 'GrievanceOfficer',
        visibility: 'shared',
        hoursOffset: -24 * 24,
        fromStatus: 'Open',
        toStatus: 'Investigation',
        message:
          'Reaching out to HealthSync Labs to confirm the status of the original erasure request and why the data remains visible in their portal.',
      }),
      timelineEntry({
        id: 'tl-2',
        type: 'resolution',
        actorName: DATA_PROTECTION_OFFICER_NAME,
        actorRole: 'GrievanceOfficer',
        visibility: 'shared',
        hoursOffset: -96,
        fromStatus: 'Investigation',
        toStatus: 'Resolved',
        message:
          'The erasure request has been completed by the fiduciary — HealthSync Labs confirmed a backend sync issue had prevented the deletion from reflecting in their patient portal, which has now been fixed and your records purged. Deletion confirmation attached to your account records.',
      }),
      timelineEntry({
        id: 'tl-3',
        type: 'communication',
        actorName: 'Ravi Kumar',
        actorRole: 'DataPrincipal',
        visibility: 'shared',
        hoursOffset: -80,
        message: 'Thank you, I can confirm the data no longer appears in the app.',
      }),
    ],
  },
  {
    id: 'grv-04410',
    referenceId: 'GRV-2026-04410',
    category: 'dataCorrectionRequestNotFulfilled',
    priority: 'P2',
    status: 'Open',
    dataPrincipalName: CURRENT_DATA_PRINCIPAL_NAME,
    submittedAt: fromNow(-3),
    updatedAt: fromNow(-3),
    statutoryDueDate: statutoryDueDateFor(0.125),
    description:
      'I requested a correction to my registered mobile number two weeks ago but the organization has not updated it. I moved to a new number after losing my old SIM, and submitted a correction request through the app on Jul 6 along with a screenshot of my new SIM activation as proof. As of today, OTPs and account alerts are still being sent to my old, deactivated number, which means I am not receiving important notifications and someone who now owns my old number could potentially intercept them.',
    attachments: [
      { id: 'att-1', fileName: 'correction-request-confirmation.png', fileSizeLabel: '310 KB' },
      { id: 'att-2', fileName: 'new-sim-activation-proof.jpg', fileSizeLabel: '520 KB' },
    ],
    timeline: [
      timelineEntry({
        id: 'tl-1',
        type: 'systemAcknowledgement',
        actorName: 'System',
        actorRole: 'System',
        visibility: 'shared',
        hoursOffset: -3,
        message:
          'Grievance received and reference ID GRV-2026-04410 generated. Acknowledgement sent by email.',
      }),
    ],
  },
  {
    id: 'grv-04355',
    referenceId: 'GRV-2026-04355',
    category: 'consentManagerIssue',
    priority: 'P2',
    status: 'Open',
    dataPrincipalName: 'Meera Nair',
    submittedAt: fromNow(-40),
    updatedAt: fromNow(-40),
    statutoryDueDate: statutoryDueDateFor(2),
    relatedConsentId: 'cnst-2026-00187',
    relatedConsentPurposeName: 'Lab Report Sharing',
    description:
      'The consent history shown for HealthSync Labs shows a purpose I never approved. My consent record for HealthSync Labs lists "Lab Report Sharing" as an active approved purpose, but I only ever approved sharing my lab reports with my primary physician\'s clinic for a one-time referral in January — I never agreed to ongoing sharing beyond that single referral. I have attached a screenshot of the consent history page showing the discrepancy.',
    attachments: [
      {
        id: 'att-1',
        fileName: 'consent-history-discrepancy-screenshot.png',
        fileSizeLabel: '390 KB',
      },
    ],
    timeline: [
      timelineEntry({
        id: 'tl-1',
        type: 'systemAcknowledgement',
        actorName: 'System',
        actorRole: 'System',
        visibility: 'shared',
        hoursOffset: -40,
        message:
          'Grievance received and reference ID GRV-2026-04355 generated. Acknowledgement sent by email.',
      }),
    ],
  },
  {
    id: 'grv-04290',
    referenceId: 'GRV-2026-04290',
    category: 'other',
    priority: 'P3',
    status: 'Investigation',
    dataPrincipalName: 'Suresh Iyer',
    submittedAt: fromNow(-144),
    updatedAt: fromNow(-6),
    statutoryDueDate: statutoryDueDateFor(6),
    description:
      'The mobile application asked for access to my full contact list for a feature that only needed one phone number. When I tried to use the "Invite a Friend" feature, the app requested full read access to my entire address book — including names, emails, and physical addresses saved for each contact — when all it needed was to look up one phone number I chose to enter manually. This feels like far more data collection than is necessary for the stated purpose, and I would like to know why this level of access is being requested and whether it can be scoped down.',
    attachments: [
      {
        id: 'att-1',
        fileName: 'contact-permission-request-screenshot.png',
        fileSizeLabel: '450 KB',
      },
    ],
    timeline: [
      timelineEntry({
        id: 'tl-1',
        type: 'systemAcknowledgement',
        actorName: 'System',
        actorRole: 'System',
        visibility: 'shared',
        hoursOffset: -144,
        message:
          'Grievance received and reference ID GRV-2026-04290 generated. Acknowledgement sent by email.',
      }),
      timelineEntry({
        id: 'tl-2',
        type: 'statusChange',
        actorName: DATA_PROTECTION_OFFICER_NAME,
        actorRole: 'GrievanceOfficer',
        visibility: 'shared',
        hoursOffset: -100,
        fromStatus: 'Open',
        toStatus: 'Investigation',
        message:
          'Requested a data minimization assessment from the product team for the reported feature.',
      }),
      timelineEntry({
        id: 'tl-3',
        type: 'note',
        actorName: DATA_PROTECTION_OFFICER_NAME,
        actorRole: 'GrievanceOfficer',
        visibility: 'internal',
        hoursOffset: -30,
        message:
          'Product team confirmed the full contact-list permission was a leftover from an older implementation of the invite feature and is no longer necessary now that manual phone-number entry is supported. Requesting a scoped-down permission request in the next app release.',
      }),
      timelineEntry({
        id: 'tl-4',
        type: 'communication',
        actorName: DATA_PROTECTION_OFFICER_NAME,
        actorRole: 'GrievanceOfficer',
        visibility: 'shared',
        hoursOffset: -6,
        message:
          'Thanks for flagging this — you were right that the full contact-list access was unnecessary. The product team has confirmed this will be scoped down to only request access when explicitly needed, in the next app release. We will follow up once that update ships.',
      }),
    ],
  },
  {
    id: 'grv-04187',
    referenceId: 'GRV-2026-04187',
    category: 'other',
    priority: 'P3',
    status: 'WaitingOnDpo',
    dataPrincipalName: CURRENT_DATA_PRINCIPAL_NAME,
    submittedAt: fromNow(-83 * 24),
    updatedAt: fromNow(-17.9997),
    statutoryDueDate: statutoryDueDateFor(83),
    description:
      'My previous privacy complaint (GRV-2025-09912) was not resolved within the timeline I was given. I raised that complaint back in late 2025 regarding an unauthorized data-sharing issue, and was told at the time it would be resolved within 90 days as required by the DPDP Rules. That deadline passed with no resolution communicated to me, and when I checked the status recently it still shows as open with no update in months. I would like to know the current status of that complaint and why the statutory timeline was missed.',
    attachments: [
      { id: 'att-1', fileName: 'previous-complaint-confirmation.pdf', fileSizeLabel: '190 KB' },
    ],
    timeline: [
      timelineEntry({
        id: 'tl-1',
        type: 'systemAcknowledgement',
        actorName: 'System',
        actorRole: 'System',
        visibility: 'shared',
        hoursOffset: -83 * 24,
        message:
          'Grievance received and reference ID GRV-2026-04187 generated. Acknowledgement sent by email.',
      }),
      timelineEntry({
        id: 'tl-2',
        type: 'statusChange',
        actorName: DATA_PROTECTION_OFFICER_NAME,
        actorRole: 'GrievanceOfficer',
        visibility: 'shared',
        hoursOffset: -20,
        fromStatus: 'Investigation',
        toStatus: 'AwaitingInfo',
        message:
          'Marked as awaiting clarification from the Data Principal. See the message thread for the question.',
      }),
      timelineEntry({
        id: 'tl-3',
        type: 'communication',
        actorName: DATA_PROTECTION_OFFICER_NAME,
        actorRole: 'GrievanceOfficer',
        visibility: 'shared',
        hoursOffset: -20,
        message:
          'Could you confirm the exact reference ID of the earlier complaint so we can pull up its resolution history?',
      }),
      timelineEntry({
        id: 'tl-4',
        type: 'communication',
        actorName: CURRENT_DATA_PRINCIPAL_NAME,
        actorRole: 'DataPrincipal',
        visibility: 'shared',
        hoursOffset: -18,
        message: 'The reference ID for the earlier complaint was GRV-2025-09912.',
      }),
      timelineEntry({
        id: 'tl-5',
        type: 'statusChange',
        actorName: 'System',
        actorRole: 'System',
        visibility: 'shared',
        hoursOffset: -17.9997,
        fromStatus: 'AwaitingInfo',
        toStatus: 'WaitingOnDpo',
        message: 'The Data Principal responded. Awaiting review by the Grievance Officer.',
      }),
    ],
  },
]

export function findGrievanceById(id: string | undefined): GrievanceDetail | undefined {
  return MOCK_GRIEVANCES.find((grievance) => grievance.id === id)
}

let submissionSequence = MOCK_GRIEVANCES.length

export function createGrievanceFromSubmission(input: GrievanceSubmissionInput): GrievanceDetail {
  submissionSequence += 1

  const referenceId = `GRV-2026-${String(90000 + submissionSequence)}`
  const priority = GRIEVANCE_CATEGORY_PRIORITY[input.category]
  const submittedAt = new Date(NOW).toISOString()

  const newGrievance: GrievanceDetail = {
    id: `grv-submission-${submissionSequence}`,
    referenceId,
    category: input.category,
    priority,
    status: 'Open',
    dataPrincipalName: CURRENT_DATA_PRINCIPAL_NAME,
    submittedAt,
    updatedAt: submittedAt,
    statutoryDueDate: fromNow(24 * STATUTORY_SLA_DAYS),
    description: input.description,
    attachments: input.attachmentNames.map((fileName, index) => ({
      id: `att-submission-${submissionSequence}-${index}`,
      fileName,
      fileSizeLabel: '—',
    })),
    timeline: [
      {
        id: `tl-submission-${submissionSequence}`,
        type: 'systemAcknowledgement',
        actorName: 'System',
        actorRole: 'System',
        visibility: 'shared',
        timestamp: submittedAt,
        message: `Grievance received and reference ID ${referenceId} generated. Acknowledgement sent by email.`,
      },
    ],
  }

  MOCK_GRIEVANCES.unshift(newGrievance)

  return newGrievance
}

let timelineSequence = 0

function nextTimelineId(): string {
  timelineSequence += 1
  return `tl-added-${timelineSequence}`
}

export function addMessage(
  grievanceId: string,
  message: string,
  senderRole: Extract<GrievanceActorRole, 'DataPrincipal' | 'GrievanceOfficer'>,
  attachmentNames: string[] = [],
): GrievanceDetail | undefined {
  const grievance = findGrievanceById(grievanceId)

  if (!grievance) {
    return undefined
  }

  const timestamp = new Date().toISOString()
  const timelineId = nextTimelineId()

  grievance.timeline.push({
    id: timelineId,
    type: 'communication',
    actorName:
      senderRole === 'DataPrincipal' ? grievance.dataPrincipalName : DATA_PROTECTION_OFFICER_NAME,
    actorRole: senderRole,
    visibility: 'shared',
    timestamp,
    message,
    attachments: attachmentNames.map((fileName, index) => ({
      id: `${timelineId}-att-${index}`,
      fileName,
      fileSizeLabel: '—',
    })),
  })
  grievance.updatedAt = timestamp

  const previousStatus = grievance.status

  if (senderRole === 'DataPrincipal' && previousStatus !== 'WaitingOnDpo') {
    const statusChangeTimestamp = new Date(new Date(timestamp).getTime() + 1000).toISOString()

    grievance.timeline.push({
      id: nextTimelineId(),
      type: 'statusChange',
      actorName: 'System',
      actorRole: 'System',
      visibility: 'shared',
      timestamp: statusChangeTimestamp,
      fromStatus: previousStatus,
      toStatus: 'WaitingOnDpo',
      message:
        previousStatus === 'Resolved'
          ? 'The Data Principal reopened this complaint by responding. Awaiting review by the Grievance Officer.'
          : 'The Data Principal responded. Awaiting review by the Grievance Officer.',
    })
    grievance.status = 'WaitingOnDpo'
    grievance.updatedAt = statusChangeTimestamp
  }

  return grievance
}

export function addInternalNote(
  grievanceId: string,
  message: string,
  attachmentNames: string[] = [],
): GrievanceDetail | undefined {
  const grievance = findGrievanceById(grievanceId)

  if (!grievance) {
    return undefined
  }

  const timestamp = new Date().toISOString()
  const timelineId = nextTimelineId()

  grievance.timeline.push({
    id: timelineId,
    type: 'note',
    actorName: DATA_PROTECTION_OFFICER_NAME,
    actorRole: 'GrievanceOfficer',
    visibility: 'internal',
    timestamp,
    message,
    attachments: attachmentNames.map((fileName, index) => ({
      id: `${timelineId}-att-${index}`,
      fileName,
      fileSizeLabel: '—',
    })),
  })
  grievance.updatedAt = timestamp

  return grievance
}

export function updateGrievanceStatus(
  grievanceId: string,
  nextStatus: GrievanceStatus,
): GrievanceDetail | undefined {
  const grievance = findGrievanceById(grievanceId)

  if (!grievance) {
    return undefined
  }

  const timestamp = new Date().toISOString()
  const previousStatus = grievance.status

  grievance.timeline.push({
    id: nextTimelineId(),
    type: nextStatus === 'Resolved' ? 'resolution' : 'statusChange',
    actorName: DATA_PROTECTION_OFFICER_NAME,
    actorRole: 'GrievanceOfficer',
    visibility: 'shared',
    timestamp,
    message: '',
    fromStatus: previousStatus,
    toStatus: nextStatus,
  })
  grievance.status = nextStatus
  grievance.updatedAt = timestamp

  return grievance
}
