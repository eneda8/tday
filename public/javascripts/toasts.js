let copyButtons = document.querySelectorAll(".copy");
    for(let button of copyButtons) {
      button.onclick = function() {
        $('.copyToast').toast('show');
      }
}

let donateButtons = document.querySelectorAll(".donate");
    for(let button of donateButtons) {
      button.onmouseover = function() {
        $('.donateToast').toast('show');
      }
}