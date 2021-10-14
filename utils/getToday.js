module.exports.getToday = function() {
  return new Date().toLocaleDateString(
    'en-US',
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }
  );
}

module.exports.getTimestamp = function() {
  const timestamp = new Date().toLocaleString("en-US");
    return timestamp;
  }
 
module.exports.within24Hours = function(post) {
  let now = new Date();
  let then = new Date(post.createdAt)
  return ((now - then) /1000/60/60) < 24
}
