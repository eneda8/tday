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
})()

