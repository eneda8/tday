// module.exports.getToday = function() {
//     const date = new Date() 
//     const today = (date.getMonth() +1).toString()+ '/' + date.getDate().toString()+ "/" + date.getFullYear().toString().slice(2)  
//     return today;
//   }

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
  