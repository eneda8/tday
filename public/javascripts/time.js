(function(){
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

    if(document.title.includes("Register") || document.title.includes("Login")){
        const timezone = new Date().toLocaleTimeString('en-us',{timeZoneName:'short'}).split(' ')[2];
        document.getElementById("tz").value = timezone; // set user timezone in the database
        document.cookie = `timezone=${timezone}`; // set user timezone in cookie
        console.log("TIME ZONE SET TO:", document.getElementById("tz").value); // for transparency purposes
    }
    if(document.getElementById("today-header")){
        document.getElementById("today-header").innerText = new Date().toLocaleDateString( 'en-US', {year: 'numeric', month: 'long', day: 'numeric'})
    }
    if(document.getElementById("dayOfTheWeek")){
        document.getElementById("dayOfTheWeek").textContent = new Date().toLocaleString('en-us', {weekday:'long'});
    }
    if(document.querySelector("#postDate")){
        document.querySelector("#postDate").value = new Date().toLocaleDateString('en-US',{year: 'numeric', month: 'short',day: 'numeric'});
    }
    if(document.getElementById("journalDate")){
        document.getElementById("journalDate").value = new Date().toLocaleString();
        document.getElementById("journalLabel").innerText = new Date().toLocaleString();
    }
})()

