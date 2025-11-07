// EDUFLEX - Aplicación educativa optimizada
'use strict';

// Estado global simplificado
let gameState = {
    username: '',
    totalPoints: 0,
    streak: 0,
    currentSubject: '',
    soundEnabled: true,
    subjects: {
        matematicas: { level: 1, points: 0, progress: 10 },
        ciencias: { level: 1, points: 0, progress: 10 },
        lengua: { level: 1, points: 0, progress: 10 },
        historia: { level: 1, points: 0, progress: 10 }
    },
    achievements: [],
    currentQuiz: {
        questions: [],
        currentIndex: 0,
        correctAnswers: 0,
        points: 0
    }
};

// Contexto de audio optimizado
let audioContext;
const initAudio = () => {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
};

// Sistema de sonidos mejorado
function playSound(type) {
    if (!gameState.soundEnabled) return;

    initAudio();

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    const sounds = {
        correct: { freq: [523.25, 659.25, 783.99], duration: 0.3, gain: 0.3 },
        incorrect: { freq: [300], duration: 0.3, gain: 0.2, type: 'sawtooth' },
        click: { freq: [400], duration: 0.1, gain: 0.15 },
        achievement: { freq: [523.25, 659.25, 783.99, 1046.50], duration: 0.5, gain: 0.3 },
        complete: { freq: [523.25, 659.25, 783.99, 1046.50], duration: 0.6, gain: 0.25 },
        start: { freq: [440, 554.37], duration: 0.2, gain: 0.2 }
    };

    const sound = sounds[type];
    if (!sound) return;

    oscillator.type = sound.type || 'sine';
    oscillator.frequency.setValueAtTime(sound.freq[0], audioContext.currentTime);

    sound.freq.forEach((freq, i) => {
        if (i > 0) {
            oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + (i * 0.1));
        }
    });

    gainNode.gain.setValueAtTime(sound.gain, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + sound.duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + sound.duration);
}

function toggleSound() {
    gameState.soundEnabled = !gameState.soundEnabled;
    saveGameState();

    const icon = document.getElementById('sound-icon');
    if (icon) {
        icon.textContent = gameState.soundEnabled ? '🔊' : '🔇';
    }

    if (gameState.soundEnabled) {
        playSound('click');
        showToast('Sonido activado 🔊');
    } else {
        showToast('Sonido desactivado 🔇');
    }
}

// Base de datos de preguntas optimizada
const questionsDB = {
    matematicas: [
        { question: '¿Cuánto es 5 + 3?', answers: ['7', '8', '9', '10'], correct: 1, difficulty: 1 },
        { question: '¿Cuánto es 12 - 7?', answers: ['4', '5', '6', '7'], correct: 1, difficulty: 1 },
        { question: '¿Cuánto es 6 × 4?', answers: ['20', '22', '24', '26'], correct: 2, difficulty: 2 },
        { question: '¿Cuánto es 15 ÷ 3?', answers: ['3', '4', '5', '6'], correct: 2, difficulty: 2 },
        { question: 'Si tienes 10 caramelos y le das 3 a tu amigo, ¿cuántos te quedan?', answers: ['6', '7', '8', '9'], correct: 1, difficulty: 1 },
        { question: '¿Qué número viene después del 19?', answers: ['18', '20', '21', '22'], correct: 1, difficulty: 1 },
        { question: '¿Cuántos lados tiene un triángulo?', answers: ['2', '3', '4', '5'], correct: 1, difficulty: 1 },
        { question: '¿Cuánto es 8 + 8?', answers: ['14', '15', '16', '17'], correct: 2, difficulty: 1 }
    ],
    ciencias: [
        { question: '¿Qué planeta es conocido como el planeta rojo?', answers: ['Venus', 'Marte', 'Júpiter', 'Saturno'], correct: 1, difficulty: 1 },
        { question: '¿Cuántas patas tiene una araña?', answers: ['6', '8', '10', '12'], correct: 1, difficulty: 1 },
        { question: '¿Qué necesitan las plantas para hacer la fotosíntesis?', answers: ['Agua y oscuridad', 'Luz solar y agua', 'Solo tierra', 'Solo aire'], correct: 1, difficulty: 2 },
        { question: '¿Cuál es el órgano más grande del cuerpo humano?', answers: ['El corazón', 'El cerebro', 'La piel', 'El estómago'], correct: 2, difficulty: 2 },
        { question: '¿Qué animal es conocido por cambiar de color?', answers: ['El perro', 'El gato', 'El camaleón', 'El conejo'], correct: 2, difficulty: 1 },
        { question: '¿En qué estado se encuentra el agua cuando hierve?', answers: ['Sólido', 'Líquido', 'Gaseoso', 'Plasma'], correct: 2, difficulty: 2 },
        { question: '¿Cuántos huesos tiene aproximadamente el cuerpo humano adulto?', answers: ['150', '206', '300', '400'], correct: 1, difficulty: 3 }
    ],
    lengua: [
        { question: '¿Cuántas vocales tiene el abecedario español?', answers: ['3', '4', '5', '6'], correct: 2, difficulty: 1 },
        { question: '¿Qué tipo de palabra es "correr"?', answers: ['Sustantivo', 'Verbo', 'Adjetivo', 'Artículo'], correct: 1, difficulty: 2 },
        { question: '¿Cómo se llama el signo de puntuación que indica una pausa?', answers: ['Punto', 'Coma', 'Punto y coma', 'Dos puntos'], correct: 1, difficulty: 1 },
        { question: '¿Cuál es el plural de "lápiz"?', answers: ['Lápizes', 'Lápices', 'Lápis', 'Lapizes'], correct: 1, difficulty: 2 },
        { question: '¿Qué letra es una consonante?', answers: ['A', 'E', 'B', 'I'], correct: 2, difficulty: 1 },
        { question: '¿Cuál es el sinónimo de "feliz"?', answers: ['Triste', 'Contento', 'Enojado', 'Cansado'], correct: 1, difficulty: 1 },
        { question: '¿Qué palabra está correctamente escrita?', answers: ['Hola', 'Ola', 'Ambas', 'Ninguna'], correct: 2, difficulty: 2 }
    ],
    historia: [
        { question: '¿En qué año se descubrió América?', answers: ['1492', '1500', '1400', '1600'], correct: 0, difficulty: 2 },
        { question: '¿Quién pintó la Mona Lisa?', answers: ['Picasso', 'Da Vinci', 'Van Gogh', 'Dalí'], correct: 1, difficulty: 2 },
        { question: '¿Cuál era el medio de transporte más común en la antigüedad?', answers: ['Carro', 'Caballo', 'Barco', 'Caminando'], correct: 3, difficulty: 1 },
        { question: '¿En qué continente se encuentran las pirámides de Egipto?', answers: ['Asia', 'Europa', 'África', 'América'], correct: 2, difficulty: 1 },
        { question: '¿Cómo se llamaban los guerreros japoneses antiguos?', answers: ['Ninjas', 'Samurais', 'Vikingos', 'Gladiadores'], correct: 1, difficulty: 2 },
        { question: '¿Qué civilización construyó Machu Picchu?', answers: ['Los Mayas', 'Los Aztecas', 'Los Incas', 'Los Egipcios'], correct: 2, difficulty: 2 },
        { question: '¿En qué país se encuentra la Torre Eiffel?', answers: ['Italia', 'España', 'Francia', 'Alemania'], correct: 2, difficulty: 1 }
    ]
};

// Base de logros optimizada
const achievementsDB = [
    { id: 'first_steps', icon: '👣', name: 'Primeros Pasos', description: 'Completa tu primer quiz' },
    { id: 'perfect_score', icon: '💯', name: 'Perfección', description: 'Obtén 100% en un quiz' },
    { id: 'points_100', icon: '⭐', name: 'Coleccionista', description: 'Acumula 100 puntos' },
    { id: 'all_subjects', icon: '🎓', name: 'Estudiante Completo', description: 'Completa un quiz de cada materia' },
    { id: 'streak_3', icon: '🔥', name: 'En Racha', description: 'Mantén una racha de 3 días' },
    { id: 'level_5', icon: '🚀', name: 'Subiendo Nivel', description: 'Alcanza nivel 5 en cualquier materia' },
    { id: 'quick_learner', icon: '⚡', name: 'Aprendiz Rápido', description: 'Responde 5 preguntas seguidas correctamente' },
    { id: 'dedicated', icon: '💪', name: 'Dedicación', description: 'Completa 10 quizzes' }
];

// Funciones principales optimizadas
function startApp() {
    const username = document.getElementById('username-input').value.trim();

    if (!username) {
        playSound('incorrect');
        showToast('¡Por favor escribe tu nombre! 😊');
        return;
    }

    playSound('start');
    gameState.username = username;
    loadGameState();
    updateUI();
    showScreen('subjects-screen');
    showToast(`¡Bienvenido ${username}! 🎉`);
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function selectSubject(subject) {
    playSound('click');
    gameState.currentSubject = subject;
    startQuiz(subject);
}

function startQuiz(subject) {
    const subjectQuestions = questionsDB[subject];
    const selectedQuestions = getRandomQuestions(subjectQuestions, 5);

    gameState.currentQuiz = {
        questions: selectedQuestions,
        currentIndex: 0,
        correctAnswers: 0,
        points: 0
    };

    showScreen('quiz-screen');
    displayQuestion();
}

const getRandomQuestions = (questions, count) =>
    [...questions].sort(() => Math.random() - 0.5).slice(0, Math.min(count, questions.length));

function displayQuestion() {
    const { currentQuiz } = gameState;
    const question = currentQuiz.questions[currentQuiz.currentIndex];

    document.getElementById('current-question').textContent = currentQuiz.currentIndex + 1;
    document.getElementById('total-questions').textContent = currentQuiz.questions.length;
    document.getElementById('quiz-points').textContent = currentQuiz.points;
    document.getElementById('question-text').textContent = question.question;

    const answersContainer = document.getElementById('answers-container');
    answersContainer.innerHTML = question.answers.map((answer, index) =>
        `<button class="answer-btn" onclick="checkAnswer(${index})">${answer}</button>`
    ).join('');

    const feedbackBox = document.getElementById('feedback-box');
    feedbackBox.classList.remove('d-block', 'alert-success', 'alert-danger');
    feedbackBox.classList.add('d-none');
}

function checkAnswer(selectedIndex) {
    const { currentQuiz } = gameState;
    const question = currentQuiz.questions[currentQuiz.currentIndex];
    const isCorrect = selectedIndex === question.correct;

    playSound(isCorrect ? 'correct' : 'incorrect');

    // Deshabilitar todos los botones y mostrar respuesta correcta
    const buttons = document.querySelectorAll('.answer-btn');
    buttons.forEach((btn, index) => {
        btn.disabled = true;
        if (index === question.correct) {
            btn.classList.add('correct');
        } else if (index === selectedIndex && !isCorrect) {
            btn.classList.add('incorrect');
        }
    });

    // Actualizar puntuación
    if (isCorrect) {
        currentQuiz.correctAnswers++;
        const points = question.difficulty * 10;
        currentQuiz.points += points;
        showFeedback(true, `¡Correcto! +${points} puntos ⭐`);
    } else {
        showFeedback(false, '¡Ups! Esa no es la respuesta correcta 😅');
    }
}

function showFeedback(isCorrect, message) {
    const feedbackBox = document.getElementById('feedback-box');
    const feedbackText = document.getElementById('feedback-text');

    feedbackBox.className = `alert d-block ${isCorrect ? 'alert-success' : 'alert-danger'}`;
    feedbackText.textContent = message;
}

function nextQuestion() {
    playSound('click');
    const { currentQuiz } = gameState;
    currentQuiz.currentIndex++;

    if (currentQuiz.currentIndex < currentQuiz.questions.length) {
        displayQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    const { currentQuiz, currentSubject } = gameState;
    const { correctAnswers, points, questions } = currentQuiz;
    const totalQuestions = questions.length;
    const accuracy = Math.round((correctAnswers / totalQuestions) * 100);

    playSound('complete');

    // Actualizar estado del juego
    gameState.totalPoints += points;
    gameState.subjects[currentSubject].points += points;
    gameState.subjects[currentSubject].level = Math.floor(gameState.subjects[currentSubject].points / 50) + 1;
    gameState.subjects[currentSubject].progress = Math.min((gameState.subjects[currentSubject].level / 10) * 100, 100);

    checkAchievements(correctAnswers, totalQuestions, points);

    // Mostrar resultados
    const titles = {
        100: '¡Perfecto! 🌟',
        80: '¡Excelente trabajo! 🎉',
        60: '¡Muy bien! 👏',
        default: '¡Sigue practicando! 💪'
    };

    document.getElementById('results-title').textContent =
        titles[accuracy] || titles[accuracy >= 80 ? 80 : accuracy >= 60 ? 60 : 'default'];

    const stars = accuracy === 100 ? 3 : accuracy >= 60 ? 2 : 1;
    document.getElementById('results-stars').innerHTML = '⭐'.repeat(stars);
    document.getElementById('earned-points').textContent = `${points} ⭐`;
    document.getElementById('correct-answers').textContent = `${correctAnswers} / ${totalQuestions}`;
    document.getElementById('accuracy').textContent = `${accuracy}%`;

    saveGameState();
    updateUI();
    showScreen('results-screen');
}

function checkAchievements(correctAnswers, totalQuestions) {
    const newAchievements = [];

    // Primer quiz
    if (!gameState.achievements.includes('first_steps')) {
        newAchievements.push('first_steps');
    }

    // Puntuación perfecta
    if (correctAnswers === totalQuestions && !gameState.achievements.includes('perfect_score')) {
        newAchievements.push('perfect_score');
    }

    // 100 puntos
    if (gameState.totalPoints >= 100 && !gameState.achievements.includes('points_100')) {
        newAchievements.push('points_100');
    }

    // Todas las materias
    const completedSubjects = Object.values(gameState.subjects).filter(s => s.points > 0).length;
    if (completedSubjects === 4 && !gameState.achievements.includes('all_subjects')) {
        newAchievements.push('all_subjects');
    }

    // Nivel 5
    const hasLevel5 = Object.values(gameState.subjects).some(s => s.level >= 5);
    if (hasLevel5 && !gameState.achievements.includes('level_5')) {
        newAchievements.push('level_5');
    }

    // Agregar nuevos logros
    newAchievements.forEach(id => {
        if (!gameState.achievements.includes(id)) {
            gameState.achievements.push(id);
            const achievement = achievementsDB.find(a => a.id === id);
            if (achievement) {
                playSound('achievement');
                showToast(`🏆 ¡Logro desbloqueado! ${achievement.name}`);
            }
        }
    });
}

function showAchievements() {
    playSound('click');
    const container = document.getElementById('achievements-container');

    container.innerHTML = achievementsDB.map(achievement => {
        const isUnlocked = gameState.achievements.includes(achievement.id);
        return `
            <div class="col-6 col-md-4 col-lg-3">
                <div class="card achievement-card ${isUnlocked ? '' : 'locked'}">
                    <div class="card-body">
                        <div class="fs-1 mb-2">${achievement.icon}</div>
                        <h4 class="h6">${achievement.name}</h4>
                        <p class="small text-muted mb-0">${achievement.description}</p>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    showScreen('achievements-screen');
}

// Funciones de navegación simplificadas
const retryQuiz = () => { playSound('click'); startQuiz(gameState.currentSubject); };
const backToSubjects = () => { playSound('click'); showScreen('subjects-screen'); };

// Funciones de utilidad
function updateUI() {
    // Actualizar estadísticas del header
    document.getElementById('total-points').textContent = gameState.totalPoints;
    document.getElementById('streak').textContent = gameState.streak;
    document.getElementById('achievements').textContent = gameState.achievements.length;

    // Actualizar icono de sonido
    const soundIcon = document.getElementById('sound-icon');
    if (soundIcon) {
        soundIcon.textContent = gameState.soundEnabled ? '🔊' : '🔇';
    }

    // Actualizar tarjetas de materias
    Object.keys(gameState.subjects).forEach(subject => {
        const data = gameState.subjects[subject];
        const levelEl = document.querySelector(`[data-level="${subject}"]`);
        const pointsEl = document.querySelector(`[data-points="${subject}"]`);
        const progressEl = document.querySelector(`[data-progress="${subject}"]`);

        if (levelEl) levelEl.textContent = data.level;
        if (pointsEl) pointsEl.textContent = data.points;
        if (progressEl) progressEl.style.width = `${data.progress}%`;
    });
}

function showToast(message) {
    const toastEl = document.getElementById('toast');
    const toastText = document.getElementById('toast-text');

    toastText.textContent = message;

    const toast = new bootstrap.Toast(toastEl, { autohide: true, delay: 3000 });
    toast.show();
}

// Almacenamiento local optimizado
const saveGameState = () => localStorage.setItem('eduflexGameState', JSON.stringify(gameState));

function loadGameState() {
    const saved = localStorage.getItem('eduflexGameState');
    if (saved) {
        const loaded = JSON.parse(saved);
        gameState = { ...gameState, ...loaded };
    }
}

// PWA Install Prompt simplificado
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    setTimeout(showInstallPrompt, 3000);
});

function showInstallPrompt() {
    const installPrompt = document.getElementById('install-prompt');
    if (installPrompt && deferredPrompt) {
        installPrompt.style.transform = 'translateY(0)';
    }
}

// Event listeners para PWA
document.getElementById('install-btn')?.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        deferredPrompt = null;
        document.getElementById('install-prompt').style.transform = 'translateY(100%)';
    }
});

document.getElementById('cancel-install-btn')?.addEventListener('click', () => {
    document.getElementById('install-prompt').style.transform = 'translateY(100%)';
});

// Service Worker registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(registration => console.log('ServiceWorker registrado:', registration.scope))
            .catch(error => console.log('Error al registrar ServiceWorker:', error));
    });
}

// Prevenir pull-to-refresh en móvil
let startY = 0;
document.addEventListener('touchstart', (e) => { startY = e.touches[0].pageY; }, { passive: true });
document.addEventListener('touchmove', (e) => {
    const y = e.touches[0].pageY;
    if (window.scrollY === 0 && y > startY && e.cancelable) {
        e.preventDefault();
    }
}, { passive: false });

// Feedback háptico optimizado
const vibrate = (duration = 10) => {
    if ('vibrate' in navigator && gameState.soundEnabled) {
        navigator.vibrate(duration);
    }
};

// Manejo de estado online/offline
window.addEventListener('online', () => showToast('¡Conexión restaurada! 🌐'));
window.addEventListener('offline', () => showToast('Modo sin conexión 📡'));

// Inicialización de la app
window.addEventListener('load', () => {
    const saved = localStorage.getItem('eduflexGameState');
    if (saved) {
        gameState = JSON.parse(saved);
        if (gameState.username) {
            showScreen('subjects-screen');
            updateUI();
        }
    }

    // Detectar si se ejecuta como PWA
    const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true;

    if (isPWA) {
        console.log('EDUFLEX ejecutándose como PWA ✨');
    }
});
