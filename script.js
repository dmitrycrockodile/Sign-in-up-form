const container = document.querySelector('.container');
const signUpBtn = document.querySelector('.signUp-btn');
const signInBtn = document.querySelector('.signIn-btn');
const headingSpan2 = document.querySelector('.heading__span-2');
const formBtn = document.querySelector('.form-btn');

const form = document.querySelector('.form');
const formWrapper = document.querySelectorAll('.form-input__wrapper');

const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');
const inputsArr = [username, email, password, password2];

//Clear form function
const clearForm = () => {
   formWrapper.forEach(item => {
      item.className = 'form-input__wrapper';
   });
   form.reset();
   if (formBtn.disabled) {
      formBtn.disabled = false;
   };
   if (document.querySelector('.success-message')) {
      document.querySelector('.success-message').remove();
   }
};

//Error function
const error = (input, message) => {
   const inputWrapper = input.parentElement;
   inputWrapper.className = 'form-input__wrapper error';
   inputWrapper.querySelector('.message').textContent = message;
};

//Success function
const success = (input) => {
   const inputWrapper = input.parentElement;
   inputWrapper.className = 'form-input__wrapper success';
};

const successfullyInst = (input, form) => {
   //show user that signing is successfull
   const message = document.createElement('div');
   message.classList.add('success-message');
   message.innerHTML = `
      <i class="fas fa-check"></i>
      <p class="success-message__text">Successfully signed ${form.classList[1] === 'sign-in' ? 'in' : 'up'}</p>
   `;
   form.append(message);
   //disabling form button
   input.disabled = true;
}

//Check length function
const checkLength = (input, min, max) => {
   if (input.value.length < min) {
      error(input, `${input.id} must be at list ${min} characters`);
   } else if (input.value.length > max) {
      error(input, `${input.id} must be less than ${max} characters`);
   } else {
      success(input);
   };
}; 

//Function that checks required fields
const checkRequiredFields = (inputArr) => {
   inputArr.forEach(input => {
      if (input.value.trim() === "") {
         if (input.id === 'password2') {
            error(input, 'Password confirmation is required');
         } else {
            error(input, `${input.id} is required`);
         }
      } else {
         success(input);
      }
   });
};

//Function that cheks if passwars are the same
const passwordsMatch = (input1, input2) => {
   if (input1.value !== input2.value) {
      error(input2, 'Passwords do not match');
   }
};

//Open sign in version
const showSignIn = () => {
   signUpBtn.addEventListener('click', () => {
      container.classList.add('change');
      setTimeout(() => {
         headingSpan2.textContent = 'Up';
      }, 200);
      form.className = 'form sign-up';
      clearForm();
   });
};
showSignIn();

//Open sign up version
const showSignUp = () => {
   signInBtn.addEventListener('click', () => {
      container.classList.remove('change');
      setTimeout(() => {
         headingSpan2.textContent = 'In';
      }, 200);
      form.className = 'form sign-in';
      clearForm();
   });
};
showSignUp()

//Function that checks the correctness of the form inputs values
const isCorrect = (form) => {
   if (form.classList[1] === 'sign-in') {
      checkRequiredFields([inputsArr[1], inputsArr[2]]);
      checkLength(password, 5, 25);
   } else {
      checkRequiredFields(inputsArr);
      checkLength(username, 2, 15);
      checkLength(password, 5, 25);
      passwordsMatch(password, password2);
   }

   let errorArr = [];

   formWrapper.forEach(input => {
      if (input.classList.contains('error')) errorArr.push(input);
   });

   if (errorArr.length === 0) {
      return true;
   } else {
      return false;
   }
}

//Posting
function postData(form) {
   form.addEventListener('submit', (e) => {
      e.preventDefault();
      //check correctness
      if (isCorrect(form)) {
         //creating xml http request
         const request = new XMLHttpRequest();
         //request initialization
         request.open('POST', 'server.php')
         //setting header request to json data
         request.setRequestHeader('Content-type', 'application/json');
         //structure form data into key-value object
         const formData = new FormData(form);
         //turning FormData into JSON format
         const obj = {};
         formData.forEach((value, key) => {
            obj[key] = value;
         });
         const json = JSON.stringify(obj);
         //sending formData object
         request.send(json);
         //Actions when request loaded
         request.addEventListener('load', () => {
            //checking if request status is successful
            if (request.status === 200) {
               successfullyInst(formBtn, form);
            };
         });
      };
   });
};

postData(form);