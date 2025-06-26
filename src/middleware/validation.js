const isValidUrl = (url) => {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch (_) {
    return false;
  }
};

module.exports = { isValidUrl };
