(function() {
  const first = document.querySelector("#next-1");
  const second = document.querySelector("#next-2")
  const registerForm = document.querySelector("#register");
  registerForm.addEventListener('input', function(event){
      if(document.querySelector("#username").checkValidity() &&
      document.querySelector("#email").checkValidity() &&
      document.querySelector("#password").checkValidity()){
          first.removeAttribute("disabled")
      }
      if(document.querySelector("#ageGroup").checkValidity() &&
      document.querySelector("#gender").checkValidity() &&
      document.querySelector("#countryName").checkValidity()){
          second.removeAttribute("disabled")
      }
  }, false)
}
)()