module.exports.getToday = function() {
    const date = new Date() 
    const today = (date.getMonth() +1).toString()+ '/' + date.getDate().toString()+ "/" + date.getFullYear().toString().slice(2)  
    return today;
  }

  