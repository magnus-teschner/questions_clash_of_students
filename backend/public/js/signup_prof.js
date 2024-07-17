const submitBtn = document.querySelector('#submitBtn'),
      password = document.querySelector('#first-password'),
      firstname = document.querySelector('#fname'),
      lastname = document.querySelector('#lname'),
      passwordConfirm = document.querySelector('#second-password'),
      email = document.querySelector('#email'),
      errorDisplayers = document.getElementsByClassName('error');

let validationFlags = {
    fname: false,
    lname: false,
    email: false,
    password: false,
    passwordConfirm: false
};

function updateSubmitButtonState() {
    const allValid = Object.values(validationFlags).every(flag => flag);
    submitBtn.disabled = !allValid;
}

function onValidation(current, messageString, booleanTest, fieldName) {
    current.textContent = messageString;
    validationFlags[fieldName] = booleanTest;
    updateSubmitButtonState();
}

firstname.addEventListener('keyup', (e) => {
    let message = errorDisplayers[0];
    e.target.value !== "" ? onValidation(message, '', true, 'fname') : onValidation(message, '*This field is Required', false, 'fname');
});

lastname.addEventListener('keyup', (e) => {
    let message = errorDisplayers[1];
    e.target.value !== "" ? onValidation(message, '', true, 'lname') : onValidation(message, '*This field is Required', false, 'lname');
});

email.addEventListener('keyup', (e) => {
    
    let message = errorDisplayers[2];
    /*
    let email_str = email.value;
    email_str = email_str.toLowerCase();

    const emailPattern = /^[a-zA-Z0-9._%+-]+@reutlingen-university\.de$/;
    console.log(emailPattern.test(email_str));
    emailPattern.test(email_str) ? 
        onValidation(message, '', true, 'email') : 
        onValidation(message, '*Please provide a valid HHZ Professor Email', false, 'email');
    */
   console.log(validationFlags)
    onValidation(message, '', true, 'email')
});


password.addEventListener('keyup', (e) => {
    let message = errorDisplayers[3];
    password.value.length >= 8 ? onValidation(message, '', true, 'password') : onValidation(message, 'Password requires minimum 8 characters', false, 'password');
    let message2 = errorDisplayers[4];
    password.value === passwordConfirm.value ? onValidation(message2, '', true, 'passwordConfirm') : onValidation(message2, '*Password did not match', false, 'passwordConfirm');
});

passwordConfirm.addEventListener('keyup', (e) => {
    let message = errorDisplayers[4];
    password.value === e.target.value ? onValidation(message, '', true, 'passwordConfirm') : onValidation(message, '*Password did not match', false, 'passwordConfirm');
});
