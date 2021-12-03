module.exports.getToday = function(userTZ) {
  return new Date().toLocaleDateString(
    'en-US',
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: userTZ
    }
  );
}

module.exports.within24Hours = function(post) {
  let now = new Date().getTime();
  let then = new Date(post.createdAt).getTime();
  const result = now - then;
  return result < 86400000; // 24 hours in milliseconds
}
