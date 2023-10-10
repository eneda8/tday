(function() {
  const first = document.querySelector("#next-1");
  const second = document.querySelector("#next-2")
  const registerForm = document.querySelector("#register");
  const passwordInput = document.querySelector("#password");
  
  registerForm.addEventListener('input', function(event){
      if(document.querySelector("#username").checkValidity() &&
      document.querySelector("#email").checkValidity() &&
      passwordInput.checkValidity()){
          first.removeAttribute("disabled")
      }
      if(document.querySelector("#ageGroup").checkValidity() &&
      document.querySelector("#gender").checkValidity() &&
      document.querySelector("#countryName").checkValidity()){
          second.removeAttribute("disabled")
      }
  }, false);

  passwordInput.addEventListener('input', function() {
    validatePassword(passwordInput.value);
  });
  
  function validatePassword(password) {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_.]).{8,20}$/;
    const isValid = passwordPattern.test(password);
  
    if (isValid) {
        passwordInput.setCustomValidity('');
    } else {
        passwordInput.setCustomValidity('Password must be 8-20 characters and must contain at least one number, one uppercase letter, and one special character.');
    }
  }
})();

