import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { getDatabase, ref, get } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js';

const firebaseConfig = {
    // Je bestaande Firebase configuratie
    apiKey: "AIzaSyBCXaYJI9dxwqKD1Qsb_9AOdsnVTPG2uHM",
    authDomain: "pjotters-company.firebaseapp.com",
    databaseURL: "https://pjotters-company-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "pjotters-company",
    storageBucket: "pjotters-company.appspot.com",
    messagingSenderId: "64413422793",
    appId: "1:64413422793:web:4025770645944818d6e918"
};

// Initialiseer Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Check authentication status
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // Gebruiker is ingelogd
        const userRef = ref(database, 'users/' + user.uid);
        const snapshot = await get(userRef);
        
        if (snapshot.exists()) {
            const userData = snapshot.val();
            document.getElementById('userEmail').textContent = userData.email;
            document.getElementById('userSubscription').textContent = userData.subscription.type;
            
            // Toon features based op abonnement
            displayFeatures(userData.subscription.type);
        }
    } else {
        // Niet ingelogd, redirect naar login pagina
        window.location.href = 'login.html';
    }
});

// Uitlog functionaliteit
document.getElementById('logoutBtn').addEventListener('click', async () => {
    try {
        await signOut(auth);
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Uitloggen mislukt:', error);
    }
});

// Helper functie om features te tonen
function displayFeatures(subscriptionType) {
    const featuresList = document.getElementById('featuresList');
    featuresList.innerHTML = ''; // Clear existing content
    
    const features = {
        basic: [
            'Toegang tot basis content',
            'Community forums'
        ],
        pro: [
            'Alles van Basic',
            'Priority support',
            'Extra functies',
            'Pro content'
        ],
        premium: [
            'Alles van Pro',
            'VIP support',
            'Exclusieve content',
            'Early access'
        ]
    };
    
    const userFeatures = features[subscriptionType];
    userFeatures.forEach(feature => {
        const div = document.createElement('div');
        div.className = 'feature-item';
        div.innerHTML = `<span class="checkmark">✓</span> ${feature}`;
        featuresList.appendChild(div);
    });
} 