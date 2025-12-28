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

/* 4) Signup handler (replace existing signup handler) */
if (signupBtn) {
  signupBtn.addEventListener('click', function (e) {
    e.preventDefault();
    const email = signupEmailInput?.value?.trim() || '';
    const password = signupPasswordInput?.value || '';
    const name = signupNameInput?.value?.trim() || '';

    if (!email || !password) {
      alert('Please enter an email and a password.');
      return;
    }

    auth.createUserWithEmailAndPassword(email, password)
    .then((userCred) => {
      console.log('Signed up:', userCred.user.uid);

      const user = userCred.user;

      const afterProfileUpdate = () => {
        // 🔽 Send data to Google Sheet (Option 2)
        fetch('https://script.google.com/macros/s/AKfycbwREMjsRY9TLYhhXrOlqLv114QAhnTQzPWM4lzxFgmT8m49uiSt-IMY5yRgYSQjxWy_1A/exec', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            secret: 'dDJNhj324_78374sbK_SBsdb249sf_QCd',
            uid: user.uid,
            name: name,
            email: user.email,
            createdAt: new Date().toISOString()
          })
        }).catch(() => {}); // fail silently

        window.location.href = 'dashboard.html';
      };

      if (name) {
        return user.updateProfile({ displayName: name })
          .then(afterProfileUpdate);
      } else {
        afterProfileUpdate();
      }
    })
    .catch((error) => {
      console.error(error);
      switch (error.code) {
        case 'auth/email-already-in-use':
          alert('An account with this email already exists. Try logging in or using a different email.');
          break;
        case 'auth/invalid-email':
          alert('That email address is invalid. Please check and try again.');
          break;
        case 'auth/weak-password':
          alert('Password is too weak. Please use at least 6 characters.');
          break;
        default:
          alert(error.message || 'Signup failed. Please try again.');
      }
    });
  });
}

/* 5) Login handler (replace existing login handler) */
if (loginBtn) {
  loginBtn.addEventListener('click', function (e) {
    e.preventDefault();
    const email = loginEmailInput?.value?.trim() || '';
    const password = loginPasswordInput?.value || '';

    if (!email || !password) {
      alert('Please enter an email and password.');
      return;
    }

    auth.signInWithEmailAndPassword(email, password)
      .then((userCred) => {
        console.log('Signed in:', userCred.user.uid);
        // successful sign-in — redirect to dashboard
        window.location.href = 'dashboard.html';
      })
      .catch((error) => {
        console.error(error);
        switch (error.code) {
          case 'auth/user-not-found':
            alert('No account found with this email. Please sign up first.');
            break;
          case 'auth/wrong-password':
            alert('Password is incorrect. Please try again.');
            break;
          case 'auth/invalid-email':
            alert('That email address is invalid. Please check and try again.');
            break;
          case 'auth/too-many-requests':
            alert('Too many attempts. Please try again later or click "Forgot Password".');
            break;
          case 'auth/invalid-login-credentials':
            alert('Incorrect email or password. Please re-enter, or click "Forgot Password".');
            break;
          default:
            alert(error.message || 'Login failed. Please try again.');
        }
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
