// Firebase configuratie
import { getAuth, signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { getDatabase, ref, get } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js';

// Gebruik de bestaande Firebase app instance
const auth = getAuth(window.firebaseApp);
const database = getDatabase(window.firebaseApp);

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
        
        // Haal gebruikersdata op uit Realtime Database
        const userRef = ref(database, 'users/' + user.uid);
        const snapshot = await get(userRef);
        
        if (snapshot.exists()) {
            const userData = snapshot.val();
            // Sla gebruikersdata op in localStorage als "remember me" is aangevinkt
            if (rememberMe) {
                localStorage.setItem('userData', JSON.stringify(userData));
            }
            
            console.log('Succesvol ingelogd:', user.email);
            console.log('Abonnement:', userData.subscription.type);
            
            // Redirect naar dashboard/homepage
            window.location.href = 'dashboard.html';
        }
        
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