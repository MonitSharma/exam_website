const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const esbuild = require('esbuild');
const { loadBrowserModule, ROOT } = require('./helpers');
const model = require('../app/content-model');
const { window } = loadBrowserModule('app/exam-calendar.js');
const calendar = window.UPSC_EXAM_CALENDAR;

test('Prelims countdown advances daily and reaches zero on May 23', () => {
  assert.equal(calendar.daysUntil(calendar.dates.prelims, new Date(2026, 9, 12)), 223);
  assert.equal(calendar.daysUntil(calendar.dates.prelims, new Date(2026, 9, 13)), 222);
  assert.equal(calendar.daysUntil(calendar.dates.prelims, new Date(2027, 4, 22, 23, 59)), 1);
  assert.equal(calendar.daysUntil(calendar.dates.prelims, new Date(2027, 4, 23)), 0);
  assert.equal(calendar.localDate(calendar.dates.prelims).getDay(), 0);
});

test('countdown uses calendar days across daylight saving and time zones', () => {
  const source = fs.readFileSync(path.join(ROOT, 'app/exam-calendar.js'), 'utf8');
  const code = `const window = {}; ${source}; const c = window.UPSC_EXAM_CALENDAR; process.stdout.write(JSON.stringify([c.daysUntil(c.dates.prelims,new Date(2026,9,12,23,59)), c.daysUntil('2027-03-15',new Date(2027,2,13,23,59))]));`;
  for (const TZ of ['Asia/Singapore', 'Asia/Kolkata', 'America/New_York']) {
    assert.deepEqual(JSON.parse(execFileSync(process.execPath, ['-e', code], { env: { ...process.env, TZ }, encoding: 'utf8' })), [223, 2], TZ);
  }
});

test('Progress uses the new date for its countdown, final block and Mains transition', () => {
  const source = esbuild.transformSync(fs.readFileSync(path.join(ROOT, 'app/workflow.jsx'), 'utf8'), { loader: 'jsx' }).code;
  const api = new Function('window', `${source}; return { getWorkflowContext, WORKFLOW_FORTNIGHTS, WORKFLOW_MILESTONES };`)({ UPSC_CONTENT: model, UPSC_EXAM_CALENDAR: calendar });
  assert.equal(api.getWorkflowContext(new Date(2026, 9, 12)).days, 223);
  assert.equal(api.WORKFLOW_FORTNIGHTS.at(-1)[2], calendar.dates.prelims);
  const examDay = api.getWorkflowContext(new Date(2027, 4, 23));
  assert.equal(examDay.days, 0);
  assert.equal(examDay.phase, 'Prelims Mode');
  const after = api.getWorkflowContext(new Date(2027, 4, 24));
  assert.equal(after.days, 0);
  assert.equal(after.phase, 'Mains Factory');
  assert.match(after.fnDates, /20 Aug 2027.*tentative.*5 days/);
  assert.ok(calendar.milestones.every((m) => api.WORKFLOW_MILESTONES.includes(m)));
});

test('standalone dashboard and production artifact share the same exam calendar', () => {
  const html = fs.readFileSync(path.join(ROOT, 'dist/upsc_dashboard.html'), 'utf8');
  assert.match(html, /src="app\/exam-calendar\.js\?v=1"/);
  assert.match(html, /UPSC CSE 2027 Key Dates · Tentative/);
  assert.ok(fs.readFileSync(path.join(ROOT, 'dist/app/exam-calendar.js')).equals(fs.readFileSync(path.join(ROOT, 'app/exam-calendar.js'))));
});
