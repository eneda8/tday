(function () {
    window.setTimeout(function() {
        let alerts = document.querySelectorAll(".alert");
        for(let alert of alerts){
          $(".alert").alert('close')
        }
      }, 2000);
})()

