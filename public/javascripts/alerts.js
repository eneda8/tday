(function () {
    window.setTimeout(function() {
        let alerts = document.querySelectorAll(".msg");
        for(let alert of alerts){
          $(".alert").alert('close')
        }
      }, 3000);
})()

