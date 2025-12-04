/*===== LOGIN SHOW and HIDDEN =====*/
const signUp = document.getElementById('sign-up'),
    signIn = document.getElementById('sign-in'),
    loginIn = document.getElementById('login-in'),
    loginUp = document.getElementById('login-up')


signUp.addEventListener('click', ()=>{
    // Remove classes first if they exist
    loginIn.classList.remove('block')
    loginUp.classList.remove('none')

    // Add classes
    loginIn.classList.toggle('none')
    loginUp.classList.toggle('block')
})

signIn.addEventListener('click', ()=>{
    // Remove classes first if they exist
    loginIn.classList.remove('none')
    loginUp.classList.remove('block')

    // Add classes
    loginIn.classList.toggle('block')
    loginUp.classList.toggle('none')
})

/* ===== Firebase Auth (Email & Password) ===== */

// 1) Your Firebase config – replace these values with your real config
const firebaseConfig = {
  apiKey: "AIzaSyCb6I_YlWQGJJIiswMtowLdWoXXI1yU02k",
  authDomain: "tgrssdi-auth.firebaseapp.com",   // e.g. tgrssdi-auth.firebaseapp.com
  projectId: "tgrssdi-auth",
  storageBucket: "tgrssdi-auth.firebasestorage.app",
  messagingSenderId: "1050877324976",
  appId: "1:1050877324976:web:f2ba89d3edb0b912acd575"
};

// 2) Initialize Firebase app & auth (using compat SDK),
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();

// 3) Get references to inputs & buttons
const signupEmailInput = document.getElementById('signup-email');
const signupPasswordInput = document.getElementById('signup-password');
const signupNameInput = document.getElementById('signup-name');
const signupBtn = document.getElementById('signup-submit');

const loginEmailInput = document.getElementById('login-email');
const loginPasswordInput = document.getElementById('login-password');
const loginBtn = document.getElementById('login-submit');

const abstractLink = document.getElementById('abstract-link');

// 4) Signup handler
if (signupBtn) {
  signupBtn.addEventListener('click', function (e) {
    e.preventDefault();
    const email = signupEmailInput?.value || '';
    const password = signupPasswordInput?.value || '';

    if (!email || !password) {
      alert('Please enter email and password.');
      return;
    }

    auth.createUserWithEmailAndPassword(email, password)
      .then((userCred) => {
        console.log('Signed up:', userCred.user.uid);
        // Optional: save display name in user profile
        const name = signupNameInput?.value || '';
        if (name) {
          return userCred.user.updateProfile({ displayName: name });
        }
      })
      .catch((error) => {
        console.error(error);
        alert(error.message);
      });
  });
}

// 5) Login handler
if (loginBtn) {
  loginBtn.addEventListener('click', function (e) {
    e.preventDefault();
    const email = loginEmailInput?.value || '';
    const password = loginPasswordInput?.value || '';

    if (!email || !password) {
      alert('Please enter email and password.');
      return;
    }

    auth.signInWithEmailAndPassword(email, password)
      .then((userCred) => {
        console.log('Signed in:', userCred.user.uid);
        // On success we do nothing here; onAuthStateChanged below will run
      })
      .catch((error) => {
        console.error(error);
        alert(error.message);
      });
  });
}

// 6) Show/hide the Google Form link based on auth state
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log('User logged in:', user.uid);
    if (abstractLink) {
      abstractLink.style.display = 'inline-block';
    }
  } else {
    console.log('No user logged in');
    if (abstractLink) {
      abstractLink.style.display = 'none';
    }
  }
});
