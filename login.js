// Firebase configuratie
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from 'firebase/auth';

const firebaseConfig = {
    // Vul hier je Firebase configuratie in
    apiKey: "JOUW_API_KEY",
    authDomain: "jouw-project.firebaseapp.com",
    projectId: "jouw-project",
    storageBucket: "jouw-project.appspot.com",
    messagingSenderId: "jouw-messaging-id",
    appId: "jouw-app-id"
};

// Initialiseer Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Zet persistence op LOCAL
setPersistence(auth, browserLocalPersistence);

document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.querySelector('input[name="remember"]').checked;
    
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        console.log('Succesvol ingelogd:', user.email);
        
        // Redirect naar dashboard/homepage
        window.location.href = 'index.html';
        
    } catch (error) {
        let errorMessage;
        switch (error.code) {
            case 'auth/invalid-email':
                errorMessage = 'Ongeldig e-mailadres.';
                break;
            case 'auth/user-disabled':
                errorMessage = 'Dit account is uitgeschakeld.';
                break;
            case 'auth/user-not-found':
                errorMessage = 'Geen account gevonden met dit e-mailadres.';
                break;
            case 'auth/wrong-password':
                errorMessage = 'Onjuist wachtwoord.';
                break;
            default:
                errorMessage = 'Er is een fout opgetreden bij het inloggen.';
        }
        alert(errorMessage);
    }
}); 