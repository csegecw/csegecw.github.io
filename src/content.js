// All the words on the page live here, so content changes don't touch the components.
export const site = {
  fullName: 'Association of Computer Engineers',
  college: 'Government Engineering College Wayanad',
  place: 'Mananthavady · Wayanad',
  tagline:
    'The computer science student association of GEC Wayanad. Workshops, hackathons and talks, built by students for students.',
  hint: 'Click the logo',

  ticker: ['Association of Computer Engineers', 'Government Engineering College Wayanad', 'Computer Science and Engineering'],
};

// The /execom/call form. `endpoint` is a Google Apps Script web app that appends each entry to a sheet.
export const execomCall = {
  endpoint:
    'https://script.google.com/macros/s/AKfycbwCfASpFpGFP33FksCx-oULwJ2C2o91REaHyMVxAfj3GpA_PPPcLNp5VuRDLvsAdRWPSw/exec',
  title: 'Execom call',
  intro: 'Want to help run ACE? Tell us a little about yourself and we will get in touch.',
  submit: 'Submit',
  sending: 'Sending…',
  doneTitle: 'Thank you',
  doneText: 'Your entry is in. We will be in touch soon.',
  another: 'Submit another',
  error: 'Something went wrong. Please try again.',
  fields: [
    { key: 'name', label: 'Name', type: 'text', autoComplete: 'name', required: true },
    { key: 'email', label: 'Email', type: 'email', autoComplete: 'email', required: true },
    { key: 'phone', label: 'Phone', type: 'tel', autoComplete: 'tel' },
    { key: 'role', label: 'Role / position', type: 'text' },
    { key: 'message', label: 'Message', type: 'textarea', rows: 4 },
  ],
};
