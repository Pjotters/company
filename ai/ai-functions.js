// Gebruik de Transformers.js pipeline
import { pipeline } from '@xenova/transformers';

let model;
async function loadModel() {
    try {
        // Gebruik een Nederlands GPT2 model
        model = await pipeline('text-generation', 'GroNLP/gpt2-small-dutch');
    } catch (error) {
        console.error('Model laden mislukt:', error);
    }
}

loadModel();

// Initialiseer de chatbot
async function initializeAI() {
    try {
        model = await pipeline('text-generation', 'Xenova/gpt2');
        console.log('AI model geladen!');
    } catch (error) {
        console.error('Error bij laden AI:', error);
    }
}

// Start initialisatie
initializeAI();

// Chatbot functie met Hugging Face
async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value;
    if (!message) return;

    // Toon gebruikersbericht
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML += `<div class="user-message">${message}</div>`;
    userInput.value = '';

    try {
        // Genereer antwoord met Hugging Face model
        const result = await model(message, {
            max_length: 50,
            temperature: 0.7
        });
        
        // Toon AI antwoord
        chatMessages.innerHTML += `<div class="bot-message">${result[0].generated_text}</div>`;
        chatMessages.scrollTop = chatMessages.scrollHeight;
    } catch (error) {
        console.error('Error:', error);
    }
}

// Beeldherkenning met TensorFlow.js
async function analyzeImage() {
    const imageInput = document.getElementById('imageInput');
    const file = imageInput.files[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);
    
    img.onload = async () => {
        // Laad MobileNet model
        const model = await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');
        
        // Voorbewerk de afbeelding
        const tensor = tf.browser.fromPixels(img)
            .resizeNearestNeighbor([224, 224])
            .toFloat()
            .expandDims();

        // Maak voorspelling
        const predictions = await model.predict(tensor).data();
        displayImageResults(predictions);
    };
}

// Beeldbewerking met OpenCV.js
function applyFilter(filterType) {
    const canvas = document.getElementById('imageCanvas');
    const ctx = canvas.getContext('2d');
    
    let src = cv.imread(canvas);
    let dst = new cv.Mat();

    switch(filterType) {
        case 'brightness':
            src.convertTo(dst, -1, 1.2, 20);
            break;
        case 'contrast':
            src.convertTo(dst, -1, 1.5, 0);
            break;
        case 'blur':
            cv.GaussianBlur(src, dst, new cv.Size(5, 5), 0, 0);
            break;
        case 'edge':
            cv.Canny(src, dst, 50, 150);
            break;
    }

    cv.imshow(canvas, dst);
    src.delete();
    dst.delete();
} 