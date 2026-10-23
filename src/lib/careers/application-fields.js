export const MAX_RESUME_BYTES = 3 * 1024 * 1024;
export const MAX_APPLICATION_BYTES = MAX_RESUME_BYTES + 128 * 1024;
export const RESUME_ACCEPT = '.pdf,.doc,.docx';
export const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Japanese', 'Cantonese', 'Mandarin', 'Dutch', 'Hindi', 'Arabic', 'Danish', 'Turkish', 'Portuguese', 'Hebrew', 'Swedish', 'Norwegian', 'Italian', 'Vietnamese', 'Tagalog', 'Khmer', 'Hmong', 'Telugu', 'Bengali', 'Marathi', 'Urdu', 'Gujarati', 'Lithuanian', 'Korean', 'American Sign Language', 'British Sign Language', 'Polish', 'Other', 'Prefer not to disclose'];
const yesNo = ['Yes', 'No'];
const preference = ['Yes', 'No', 'Open to discussion'];

// Shared by the form, server validation, and the authenticated application inbox.
export const APPLICATION_SECTIONS = [
  { title: 'Personal information', fields: [
    { name: 'fullName', label: 'Full name', required: true, max: 120, autoComplete: 'name' },
    { name: 'preferredName', label: 'Preferred name', max: 120, autoComplete: 'nickname' },
    { name: 'pronunciation', label: 'Name pronunciation', max: 200 },
    { name: 'email', label: 'Email address', type: 'email', required: true, max: 255, autoComplete: 'email' },
    { name: 'phone', label: 'Phone number', type: 'tel', max: 60, autoComplete: 'tel' },
    { name: 'currentLocation', label: 'Current city, state, and country', required: true, max: 200, autoComplete: 'address-level2' },
    { name: 'currentCompany', label: 'Current employer', max: 200, autoComplete: 'organization' },
  ] },
  { title: 'Links', fields: [
    { name: 'linkedin', label: 'LinkedIn profile', type: 'url', max: 500 },
    { name: 'github', label: 'GitHub profile', type: 'url', max: 500 },
    { name: 'portfolio', label: 'Portfolio or personal website', type: 'url', max: 500 },
  ] },
  { title: 'Background', fields: [
    { name: 'languages', label: 'Languages', type: 'languages', required: true },
    { name: 'otherLanguages', label: 'Other languages', max: 300 },
    { name: 'university', label: 'Most recent university or school', required: true, max: 300, help: 'Enter “Not applicable” if you did not attend a university or school. Equivalent professional experience is welcome.' },
    { name: 'source', label: 'How did you hear about this role?', required: true, options: ['USATII website', 'LinkedIn', 'Job board', 'Employee referral', 'Industry or government partner', 'Event', 'Search engine', 'Other'] },
    { name: 'sourceDetails', label: 'Referral name or additional source details', max: 500 },
  ] },
  { title: 'Work authorization', fields: [
    { name: 'workAuthorization', label: 'Are you currently authorized to work in the United States?', required: true, options: yesNo },
    { name: 'sponsorship', label: 'Will you need employment visa sponsorship now or in the future?', required: true, options: yesNo },
  ] },
  { title: 'Federal engagement', fields: [
    { name: 'activeClearance', label: 'Do you currently hold an active U.S. security clearance?', required: true, options: ['Yes', 'No', 'Prefer not to disclose'] },
    { name: 'clearanceDiscussion', label: 'Are you willing to discuss customer-specific suitability or clearance requirements once they are established?', required: true, options: preference, help: 'No clearance requirement has been established for this anticipated role. Do not provide classified information, clearance identifiers, or sensitive government details.' },
    { name: 'clearanceInterest', label: 'Clearance experience or interest in pursuing a clearance', type: 'textarea', max: 1500, help: 'Optional. Provide only general, unclassified information.' },
    { name: 'travel', label: 'Can you accommodate the travel described in this posting?', required: true, options: preference },
    { name: 'relocation', label: 'Can you meet the work-location requirements, or would you consider relocation?', required: true, options: ['I can meet the stated work-location requirements', 'I would consider relocation', 'I would need to discuss arrangements', 'I cannot meet these requirements'] },
    { name: 'futureLocations', label: 'Other locations you would consider for future opportunities', max: 500 },
    { name: 'internationalTravel', label: 'Would you consider international business travel for future opportunities?', options: preference },
    { name: 'compensation', label: 'Are you comfortable with the proposed base salary in this posting?', required: true, options: preference },
    { name: 'interviewTimeline', label: 'Are you interviewing elsewhere, and what is your preferred decision or start timeline?', required: true, type: 'textarea', max: 2000, help: 'You do not need to name other employers. “Not currently interviewing” is a valid response.' },
  ] },
  { title: 'Your experience', fields: [
    { name: 'challenge', label: 'Describe a difficult technical, delivery, or customer challenge you worked through. What did you do, and what was the outcome?', type: 'textarea', required: true, max: 4000, help: 'A short response of approximately 3–5 sentences is sufficient.' },
    { name: 'proudestProject', label: 'What project or accomplishment are you proudest of, and why?', type: 'textarea', max: 4000 },
    { name: 'motivation', label: 'Why are you interested in USATII and this DART role?', type: 'textarea', max: 4000 },
    { name: 'additionalInformation', label: 'Cover letter or additional information', type: 'textarea', max: 5000 },
  ] },
  { title: 'Preferences', fields: [
    { name: 'partnerSharing', label: 'May USATII share your résumé and contact information with prospective delivery partners for recruiting?', options: ['Yes, I opt in', 'No, keep my application with USATII'], help: 'Optional. Declining does not affect your application.' },
    { name: 'californiaResident', label: 'Are you a California resident?', options: ['Yes', 'No', 'Prefer not to disclose'] },
    { name: 'aiNotes', label: 'If proposed for a future interview, would you consent to AI-assisted transcription?', options: ['Yes, I opt in', 'No, I do not consent'], help: 'Optional. This records a preference only; it does not start recording or transcription. Declining does not affect your application.' },
    { name: 'accommodation', label: 'Would you like recruiting to contact you about an accommodation?', options: ['Yes', 'No'], help: 'Optional. Do not include medical details.' },
  ] },
];

export const DEMOGRAPHIC_FIELDS = [
  { name: 'veteranStatus', label: 'Protected veteran status', options: ['I identify as a protected veteran', 'I do not identify as a protected veteran', 'Prefer not to disclose'] },
  { name: 'disabilityStatus', label: 'Disability status', options: ['I have or have had a disability', 'I do not have a disability', 'Prefer not to disclose'] },
];
export const APPLICATION_FIELDS = APPLICATION_SECTIONS.flatMap(section => section.fields);
