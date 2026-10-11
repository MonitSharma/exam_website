// Shared by the Progress plan and standalone dashboard.
(function () {
  const dates = Object.freeze({
    notification: '2027-01-13',
    applicationDeadline: '2027-02-02',
    prelims: '2027-05-23',
    mains: '2027-08-20',
  });
  function localDate(isoDate) { return new Date(`${isoDate}T00:00:00`); }
  function dayNumber(date) {
    return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000;
  }
  function daysUntil(isoDate, today = new Date()) {
    return dayNumber(localDate(isoDate)) - dayNumber(today);
  }
  const milestones = Object.freeze([
    { label: 'Official notification', date: dates.notification, note: 'Tentative · UPSC CSE 2027' },
    { label: 'Last date to apply', date: dates.applicationDeadline, note: 'Tentative · Application deadline' },
    { label: 'Prelims exam', date: dates.prelims, note: 'Tentative · Sunday' },
    { label: 'Mains begins', date: dates.mains, note: 'Tentative · 5 days duration' },
  ]);
  window.UPSC_EXAM_CALENDAR = Object.freeze({ dates, milestones, localDate, daysUntil });
})();
