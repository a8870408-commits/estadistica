// Google Apps Script web app deployed by the teacher with XTEC.
export const submissionEndpoint = 'https://script.google.com/a/macros/xtec.cat/s/AKfycbzbQ4sgFDj-O4dU1dfeHvyFomfF9K00DZdH8w1bPwZW3Bs6Fc2CkLCFm3lzwyAOizYk/exec';
export function isSubmissionEndpoint(url) {
  return /^https:\/\/script\.google\.com\/(?:macros|a\/macros\/[a-zA-Z0-9.-]+)\/s\/[A-Za-z0-9_-]+\/exec$/.test(url);
}
