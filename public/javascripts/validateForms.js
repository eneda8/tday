(function () {
    'use strict'

    bsCustomFileInput.init()
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.validated-form')

    // Loop over them and prevent submission
    Array.from(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }
                form.classList.add('was-validated')
            }, false);
        })
    // register form
    if(document.title=== "Register / t'day"){
        const registerForm = document.querySelector("#register");
        registerForm.addEventListener('input', function(event){
            if(!registerForm.checkValidity()){
                event.preventDefault()
                event.stopPropagation()
            }
            registerForm.classList.add('was-validated');
        }, false)
    }
})()