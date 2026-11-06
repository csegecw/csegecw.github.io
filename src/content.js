// All the words on the page live here, so content changes don't touch the components.
export const site = {
  fullName: 'Association of Computer Engineers',
  college: 'Government Engineering College Wayanad',
  place: 'Mananthavady · Wayanad',
  tagline:
    'The computer science student association of GEC Wayanad. Workshops, hackathons and talks, built by students for students.',
  hint: 'Click the logo',
  cta: { label: 'Placement data', href: '/placement/' },

  ticker: ['Association of Computer Engineers', 'Government Engineering College Wayanad', 'Computer Science and Engineering'],
};

// The /placement form. `endpoint` is the Google Apps Script web app (apps-script/placement.gs) that
// appends each entry to a sheet and stores the resume in Drive. Paste the "/exec" URL here.
export const placement = {
  endpoint: 'https://script.google.com/macros/s/AKfycbyOWQuqvtq2gShXpotWmbbw2e5i8wYpB86UT54JeT04YJL-8ycASJBvvzGH3w2yyM2ApQ/exec',
  title: 'Placement data collection',
  intro:
    'Fill this in once. The placement cell of GEC Wayanad uses it to invite you to company drives, trainings and campus opportunities that match your skills.',
  points: [
    'Shared only with the CSE placement cell.',
    'Used only to contact you about placement opportunities.',
    'Takes about two minutes.',
  ],
  consent: 'I agree to share these details with the CSE placement cell of GEC Wayanad.',
  steps: [
    { title: 'Your details', hint: 'How the placement cell can reach you.' },
    { title: 'Skills', hint: 'Select everything you are comfortable with.' },
    { title: 'Resume and achievements', hint: 'Attach your resume and tell us what you have done.' },
    { title: 'Review and submit', hint: 'Check your details before sending.' },
  ],
  next: 'Next',
  back: 'Back',
  skillsError: 'Select at least one skill or add your own.',
  submit: 'Submit',
  sending: 'Sending…',
  doneTitle: 'Thank you',
  doneText: 'Your details are with the placement cell. They will reach out when something matches your profile.',
  another: 'Submit another',
  error: 'Something went wrong. Please try again.',
  fileError: 'Please upload a PDF, DOC or DOCX under 5 MB.',
  maxFileMB: 5,
  sems: ['S1', 'S3', 'S5', 'S7'],
  skills: [
    'C / C++', 'Java', 'Python', 'JavaScript', 'React', 'Node.js', 'HTML / CSS', 'SQL / Databases',
    'Data Structures & Algorithms', 'Machine Learning / AI', 'Data Analysis', 'Android / Flutter',
    'Cloud / DevOps', 'Cybersecurity', 'UI / UX Design', 'Git / GitHub', 'Claude Code','Embedded / IoT', 'Competitive Programming',
  ],
};
