import { getAuth, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { getDatabase, ref, set } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js';

// Gebruik de bestaande Firebase app instance
const auth = getAuth(window.firebaseApp);
const database = getDatabase(window.firebaseApp);

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
    const name = document.getElementById('name').value;
    const subscription = document.getElementById('subscription').value;
    
    try {
        // Maak gebruiker aan in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Sla gebruikersgegevens op in Realtime Database
        await set(ref(database, 'users/' + user.uid), {
            email: email,
            name: name,
            subscription: {
                type: subscription,
                startDate: new Date().toISOString(),
                plan: subscriptionPlans[subscription],
                active: true
            },
            accessibleCompanies: [],
            createdAt: new Date().toISOString()
        });
        
        updateAccessibleCompanies(user.uid, subscription);
        
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

function updateAccessibleCompanies(userId, subscriptionType) {
  let accessibleCompanies = [];
  
  if (subscriptionType === 'basic') {
    accessibleCompanies = ['bedrijf1', 'bedrijf2', 'bedrijf3']; // Vervang door echte bedrijfs-ID's
  } else if (subscriptionType === 'pro') {
    accessibleCompanies = ['bedrijf1', 'bedrijf2', 'bedrijf3', 'bedrijf4', 'bedrijf5', 'bedrijf6', 'bedrijf7', 'bedrijf8', 'bedrijf9', 'bedrijf10'];
  } else if (subscriptionType === 'premium') {
    accessibleCompanies = ['bedrijf1', 'bedrijf2', 'bedrijf3', 'bedrijf4', 'bedrijf5', 'bedrijf6', 'bedrijf7', 'bedrijf8', 'bedrijf9', 'bedrijf10', 'bedrijf11', 'bedrijf12']; // Voeg alle bedrijfs-ID's toe
  }
  
  set(ref(database, 'users/' + userId + '/accessibleCompanies'), accessibleCompanies);
} 