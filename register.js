import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { getDatabase, ref, set } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js';

const firebaseConfig = {
    apiKey: "AIzaSyBCXaYJI9dxwqKD1Qsb_9AOdsnVTPG2uHM",
    authDomain: "pjotters-company.firebaseapp.com",
    databaseURL: "https://pjotters-company-default-rtdb.firebaseio.com",
    projectId: "pjotters-company",
    storageBucket: "pjotters-company.firebasestorage.app",
    messagingSenderId: "64413422793",
    appId: "1:64413422793:web:4025770645944818d6e918",
    measurementId: "G-EEB3BWHK35"
};

// Initialiseer Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Abonnement details
const subscriptionPlans = {
    basic: {
        name: 'Basis',
        price: 0,
        features: ['Basis toegang', 'Beperkte functies']
    },
    pro: {
        name: 'Pro',
        price: 9.99,
        features: ['Volledige toegang', 'Priority support', 'Extra functies']
    },
    premium: {
        name: 'Premium',
        price: 19.99,
        features: ['Alles van Pro', 'VIP support', 'Exclusieve content']
    }
};

document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const subscriptionType = document.getElementById('subscription').value;
    
    try {
        // Maak gebruiker aan in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Sla gebruikersgegevens op in Realtime Database
        await set(ref(database, 'users/' + user.uid), {
            email: email,
            subscription: {
                type: subscriptionType,
                startDate: new Date().toISOString(),
                plan: subscriptionPlans[subscriptionType],
                active: true
            },
            createdAt: new Date().toISOString()
        });
        
        alert('Registratie succesvol! Je wordt nu doorgestuurd.');
        window.location.href = 'dashboard.html';
        
    } catch (error) {
        let errorMessage;
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = 'Dit e-mailadres is al in gebruik.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Ongeldig e-mailadres.';
                break;
            case 'auth/weak-password':
                errorMessage = 'Wachtwoord moet minimaal 6 tekens bevatten.';
                break;
            default:
                errorMessage = 'Er is een fout opgetreden bij het registreren.';
                console.error(error);
        }
        alert(errorMessage);
    }
}); 