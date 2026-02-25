function parseIsoDate(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) {
    return null;
  }

  const date = new Date(`${dateString}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  if (date.toISOString().slice(0, 10) !== dateString) {
    return null;
  }

  return date;
}

function calculateNights(checkInDate, checkOutDate) {
  const start = parseIsoDate(checkInDate);
  const end = parseIsoDate(checkOutDate);

  if (!start || !end) {
    return 0;
  }

  const diffMs = end.getTime() - start.getTime();
  const oneNightMs = 24 * 60 * 60 * 1000;
  return Math.floor(diffMs / oneNightMs);
}

module.exports = {
  parseIsoDate,
  calculateNights,
};
