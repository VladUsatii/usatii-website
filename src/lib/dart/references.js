// Direct source links. SAM.gov file URLs issue fresh download redirects.
const survey = 'https://sam.gov/api/prod/opps/v3/opportunities/resources/files/07c6ef77d049424985762b532d98dffa/download';
const notice = 'https://sam.gov/opp/a0c2acad204f428585857e6a736d179a/view';
export const dartReferences = [
  ...['FEMA’s survey', 'FEMA’s workforce and deployment survey', 'survey workbook'].map(phrase => ({ phrase, href: survey })),
  { phrase: 'FEMA’s public notice', href: notice },
  { phrase: 'RFI overview', href: 'https://sam.gov/api/prod/opps/v3/opportunities/resources/files/d4f4fd5a31c141a294922a79fc1bc317/download' },
  { phrase: 'FEMA’s Position Task Book templates', href: 'https://www.fema.gov/emergency-managers/nims/components/position-task-books' },
  { phrase: 'National Qualification System', href: 'https://www.usfa.fema.gov/a-z/nims/national-qualification-system.html' },
  { phrase: 'OpenID Connect', href: 'https://openid.net/specs/openid-connect-core-1_0.html' },
  { phrase: 'OAuth', href: 'https://www.rfc-editor.org/rfc/rfc6749' },
  { phrase: 'PKCE', href: 'https://www.rfc-editor.org/rfc/rfc7636' },
  { phrase: 'Section 508', href: 'https://www.section508.gov/' },
  { phrase: 'FedRAMP High', href: 'https://www.fedramp.gov/legacy/playbook/csp/authorization/considerations/#impact-levels' },
  { phrase: 'Authority to Operate', href: 'https://csrc.nist.gov/projects/risk-management/rmf-overview' },
  { phrase: 'CUI', href: 'https://www.archives.gov/cui/registry/category-list' },
  { phrase: 'Kirkpatrick levels', href: 'https://www.kirkpatrickpartners.com/the-kirkpatrick-model/' },
  { phrase: 'SCORM 1.2', href: 'https://github.com/adlnet/Starting-from-SCORM-A-Developers-Guide/blob/master/Instructions.md' },
  { phrase: 'National Weather Service', href: 'https://www.weather.gov/documentation/services-web-api' },
  { phrase: 'NOAA', href: 'https://api.tidesandcurrents.noaa.gov/api/prod/' },
  { phrase: 'AWS GovCloud Translate', href: 'https://docs.aws.amazon.com/govcloud-us/latest/UserGuide/govcloud-translate.html' },
  { phrase: 'GovCloud', href: 'https://docs.aws.amazon.com/govcloud-us/latest/UserGuide/whatis.html' },
  { phrase: 'Next.js', href: 'https://nextjs.org/docs' },
  { phrase: 'React', href: 'https://react.dev/learn' },
  { phrase: 'PostgreSQL', href: 'https://www.postgresql.org/docs/' },
  { phrase: 'DART jobs', href: '/careers/roles' },
];
