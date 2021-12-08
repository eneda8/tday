// module.exports.getToday = function(user) {
//   try{
//     const today = new Date().toLocaleDateString(
//       'en-US',
//       {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//         timeZone: user.timezone || user.defaultTimezone
//       });
//       console.log("getToday function computes:", today)
//       return today;
//   } catch(e){
//     console.log(`Time zone invalid: Timezone set to UTC. Today's date: ${new Date().toLocaleDateString(
//     'en-US',{year: 'numeric', month: 'short', day: 'numeric'})} `)
//     return new Date().toLocaleDateString('en-US',{year: 'numeric', month: 'short', day: 'numeric'})  
//   }
// }

module.exports.within24Hours = function(post) {
  let now = new Date().getTime();
  let then = new Date(post.createdAt).getTime();
  const result = now - then;
  return result < 86400000; // 24 hours in milliseconds
}
