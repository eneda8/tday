(function(){
    ///set time-keeping cookies
    function correctDate(date){  //account for date formats in mobile browsers which leave out the last space
        if(date.lastIndexOf(" ") == 3){
        let spaceIdx = date.length - 4;
        return date.slice(0, spaceIdx) + " " + date.slice(spaceIdx);
        } else return date
    }    

    let today =  correctDate(new Date().toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric'}));
    document.cookie = `today=${today}`; // set user's today in cookie
    if(document.title === "t'day"){
        document.querySelector("#today").innerText = today;
    }
    console.log("TODAY'S DATE SET TO:", today); 
    let yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() -1)
    yesterday = correctDate(yesterday.toLocaleDateString('en-US',{year: 'numeric', month: 'short', day: 'numeric'}));
    document.cookie = `yesterday=${yesterday}`

    //set timestamps
    const timestamps = document.querySelectorAll(".timestamp");
    for (let timestamp of timestamps){
        const stamp = timestamp.innerText;
        const correctedStamp = new Date(stamp).toLocaleString();
        timestamp.innerText = correctedStamp;
        timestamp.setAttribute("title", correctedStamp);
    }
    const edited = document.querySelectorAll(".edited");
    for (let stamp of edited){
        const editedAt = stamp.getAttribute("title");
        stamp.setAttribute("title", new Date(editedAt).toLocaleString())
    }

    //set database timezones
    if(document.title.includes("Register") || document.title.includes("Login")){
        const timezone = new Date().toLocaleTimeString('en-us',{timeZoneName:'short'}).split(' ')[2];
        document.getElementById("tz").value = timezone; // set user timezone in the database
        document.cookie = `timezone=${timezone}`; // set user timezone in cookie
        console.log("TIME ZONE SET TO:", timezone); 
        // pre-select default timezone on register page
        if(document.title.includes("Register")){
            const options = document.getElementById("timezone").getElementsByTagName('option');
            for (let option of options){
                if (option.value === timezone) {
                    option.selected = 'selected'
                }
            }
        }
    }
    //set day of the week and date headers
    if(document.getElementById("today-header")){
        document.getElementById("today-header").innerText = new Date().toLocaleDateString( 'en-US', {year: 'numeric', month: 'long', day: 'numeric'})
    }
    if(document.getElementById("dayOfTheWeek")){
        document.getElementById("dayOfTheWeek").textContent = new Date().toLocaleString('en-us', {weekday:'long'});
    }

    //set journal and rating/post date inputs
    if(document.querySelectorAll(".postDate")){
        const inputs = document.querySelectorAll(".postDate");
        for (let input of inputs) {
            input.value = new Date().toLocaleDateString('en-US',{year: 'numeric', month: 'short',day: 'numeric'});
        }
    }
    
    if(document.getElementById("journalDate")){
        document.getElementById("journalDate").value = new Date().toLocaleString();
        document.getElementById("journalLabel").innerText = new Date().toLocaleString();
    }
})()

