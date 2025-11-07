// Global State
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

// Audio Context for Sound Effects
let audioContext;

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Sound Effects Functions
function playSound(type) {
    if (!gameState.soundEnabled) return;
    
    initAudio();
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch(type) {
        case 'correct':
            // Sonido alegre de acierto
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
            oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
            break;
            
        case 'incorrect':
            // Sonido de error (descendente)
            oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.3);
            oscillator.type = 'sawtooth';
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
            break;
            
        case 'click':
            // Click suave
            oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
            break;
            
        case 'achievement':
            // Fanfarria de logro
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
            oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
            oscillator.frequency.setValueAtTime(1046.50, audioContext.currentTime + 0.3); // C6
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
            break;
            
        case 'complete':
            // Sonido de completar quiz
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.15);
            oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.3);
            oscillator.frequency.setValueAtTime(1046.50, audioContext.currentTime + 0.45);
            gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.6);
            break;
            
        case 'start':
            // Sonido de inicio
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(554.37, audioContext.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
            break;
    }
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

// Questions Database
const questionsDB = {
    matematicas: [
        {
            question: '¿Cuánto es 5 + 3?',
            answers: ['7', '8', '9', '10'],
            correct: 1,
            difficulty: 1
        },
        {
            question: '¿Cuánto es 12 - 7?',
            answers: ['4', '5', '6', '7'],
            correct: 1,
            difficulty: 1
        },
        {
            question: '¿Cuánto es 6 × 4?',
            answers: ['20', '22', '24', '26'],
            correct: 2,
            difficulty: 2
        },
        {
            question: '¿Cuánto es 15 ÷ 3?',
            answers: ['3', '4', '5', '6'],
            correct: 2,
            difficulty: 2
        },
        {
            question: 'Si tienes 10 caramelos y le das 3 a tu amigo, ¿cuántos te quedan?',
            answers: ['6', '7', '8', '9'],
            correct: 1,
            difficulty: 1
        },
        {
            question: '¿Qué número viene después del 19?',
            answers: ['18', '20', '21', '22'],
            correct: 1,
            difficulty: 1
        },
        {
            question: '¿Cuántos lados tiene un triángulo?',
            answers: ['2', '3', '4', '5'],
            correct: 1,
            difficulty: 1
        },
        {
            question: '¿Cuánto es 8 + 8?',
            answers: ['14', '15', '16', '17'],
            correct: 2,
            difficulty: 1
        }
    ],
    ciencias: [
        {
            question: '¿Qué planeta es conocido como el planeta rojo?',
            answers: ['Venus', 'Marte', 'Júpiter', 'Saturno'],
            correct: 1,
            difficulty: 1
        },
        {
            question: '¿Cuántas patas tiene una araña?',
            answers: ['6', '8', '10', '12'],
            correct: 1,
            difficulty: 1
        },
        {
            question: '¿Qué necesitan las plantas para hacer la fotosíntesis?',
            answers: ['Agua y oscuridad', 'Luz solar y agua', 'Solo tierra', 'Solo aire'],
            correct: 1,
            difficulty: 2
        },
        {
            question: '¿Cuál es el órgano más grande del cuerpo humano?',
            answers: ['El corazón', 'El cerebro', 'La piel', 'El estómago'],
            correct: 2,
            difficulty: 2
        },
        {
            question: '¿Qué animal es conocido por cambiar de color?',
            answers: ['El perro', 'El gato', 'El camaleón', 'El conejo'],
            correct: 2,
            difficulty: 1
        },
        {
            question: '¿En qué estado se encuentra el agua cuando hierve?',
            answers: ['Sólido', 'Líquido', 'Gaseoso', 'Plasma'],
            correct: 2,
            difficulty: 2
        },
        {
            question: '¿Cuántos huesos tiene aproximadamente el cuerpo humano adulto?',
            answers: ['150', '206', '300', '400'],
            correct: 1,
            difficulty: 3
        }
    ],
    lengua: [
        {
            question: '¿Cuántas vocales tiene el abecedario español?',
            answers: ['3', '4', '5', '6'],
            correct: 2,
            difficulty: 1
        },
        {
            question: '¿Qué tipo de palabra es "correr"?',
            answers: ['Sustantivo', 'Verbo', 'Adjetivo', 'Artículo'],
            correct: 1,
            difficulty: 2
        },
        {
            question: '¿Cómo se llama el signo de puntuación que indica una pausa?',
            answers: ['Punto', 'Coma', 'Punto y coma', 'Dos puntos'],
            correct: 1,
            difficulty: 1
        },
        {
            question: '¿Cuál es el plural de "lápiz"?',
            answers: ['Lápizes', 'Lápices', 'Lápis', 'Lapizes'],
            correct: 1,
            difficulty: 2
        },
        {
            question: '¿Qué letra es una consonante?',
            answers: ['A', 'E', 'B', 'I'],
            correct: 2,
            difficulty: 1
        },
        {
            question: '¿Cuál es el sinónimo de "feliz"?',
            answers: ['Triste', 'Contento', 'Enojado', 'Cansado'],
            correct: 1,
            difficulty: 1
        },
        {
            question: '¿Qué palabra está correctamente escrita?',
            answers: ['Hola', 'Ola', 'Ambas', 'Ninguna'],
            correct: 2,
            difficulty: 2
        }
    ],
    historia: [
        {
            question: '¿En qué año se descubrió América?',
            answers: ['1492', '1500', '1400', '1600'],
            correct: 0,
            difficulty: 2
        },
        {
            question: '¿Quién pintó la Mona Lisa?',
            answers: ['Picasso', 'Da Vinci', 'Van Gogh', 'Dalí'],
            correct: 1,
            difficulty: 2
        },
        {
            question: '¿Cuál era el medio de transporte más común en la antigüedad?',
            answers: ['Carro', 'Caballo', 'Barco', 'Caminando'],
            correct: 3,
            difficulty: 1
        },
        {
            question: '¿En qué continente se encuentran las pirámides de Egipto?',
            answers: ['Asia', 'Europa', 'África', 'América'],
            correct: 2,
            difficulty: 1
        },
        {
            question: '¿Cómo se llamaban los guerreros japoneses antiguos?',
            answers: ['Ninjas', 'Samurais', 'Vikingos', 'Gladiadores'],
            correct: 1,
            difficulty: 2
        },
        {
            question: '¿Qué civilización construyó Machu Picchu?',
            answers: ['Los Mayas', 'Los Aztecas', 'Los Incas', 'Los Egipcios'],
            correct: 2,
            difficulty: 2
        },
        {
            question: '¿En qué país se encuentra la Torre Eiffel?',
            answers: ['Italia', 'España', 'Francia', 'Alemania'],
            correct: 2,
            difficulty: 1
        }
    ]
};

// Achievements Database
const achievementsDB = [
    { id: 'first_steps', icon: '👣', name: 'Primeros Pasos', description: 'Completa tu primer quiz', unlocked: false },
    { id: 'perfect_score', icon: '💯', name: 'Perfección', description: 'Obtén 100% en un quiz', unlocked: false },
    { id: 'points_100', icon: '⭐', name: 'Coleccionista', description: 'Acumula 100 puntos', unlocked: false },
    { id: 'all_subjects', icon: '🎓', name: 'Estudiante Completo', description: 'Completa un quiz de cada materia', unlocked: false },
    { id: 'streak_3', icon: '🔥', name: 'En Racha', description: 'Mantén una racha de 3 días', unlocked: false },
    { id: 'level_5', icon: '🚀', name: 'Subiendo Nivel', description: 'Alcanza nivel 5 en cualquier materia', unlocked: false },
    { id: 'quick_learner', icon: '⚡', name: 'Aprendiz Rápido', description: 'Responde 5 preguntas seguidas correctamente', unlocked: false },
    { id: 'dedicated', icon: '💪', name: 'Dedicación', description: 'Completa 10 quizzes', unlocked: false }
];

// Initialize App
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

// Screen Management
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Subject Selection
function selectSubject(subject) {
    playSound('click');
    gameState.currentSubject = subject;
    startQuiz(subject);
}

// Quiz Management
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

function getRandomQuestions(questions, count) {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, questions.length));
}

function displayQuestion() {
    const quiz = gameState.currentQuiz;
    const question = quiz.questions[quiz.currentIndex];
    
    document.getElementById('current-question').textContent = quiz.currentIndex + 1;
    document.getElementById('total-questions').textContent = quiz.questions.length;
    document.getElementById('quiz-points').textContent = quiz.points;
    document.getElementById('question-text').textContent = question.question;
    
    const answersContainer = document.getElementById('answers-container');
    answersContainer.innerHTML = '';
    
    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.textContent = answer;
        button.onclick = () => checkAnswer(index);
        answersContainer.appendChild(button);
    });
    
    const feedbackBox = document.getElementById('feedback-box');
    feedbackBox.classList.remove('d-block', 'alert-success', 'alert-danger');
    feedbackBox.classList.add('d-none');
}

function checkAnswer(selectedIndex) {
    const quiz = gameState.currentQuiz;
    const question = quiz.questions[quiz.currentIndex];
    const isCorrect = selectedIndex === question.correct;
    
    // Play sound
    playSound(isCorrect ? 'correct' : 'incorrect');
    
    // Disable all buttons
    const buttons = document.querySelectorAll('.answer-btn');
    buttons.forEach((btn, index) => {
        btn.disabled = true;
        if (index === question.correct) {
            btn.classList.add('correct');
        } else if (index === selectedIndex && !isCorrect) {
            btn.classList.add('incorrect');
        }
    });
    
    // Update score
    if (isCorrect) {
        quiz.correctAnswers++;
        const points = question.difficulty * 10;
        quiz.points += points;
        showFeedback(true, `¡Correcto! +${points} puntos ⭐`);
    } else {
        showFeedback(false, '¡Ups! Esa no es la respuesta correcta 😅');
    }
}

function showFeedback(isCorrect, message) {
    const feedbackBox = document.getElementById('feedback-box');
    const feedbackText = document.getElementById('feedback-text');
    
    feedbackBox.classList.remove('d-none', 'alert-success', 'alert-danger');
    feedbackBox.classList.add('d-block', 'alert', isCorrect ? 'alert-success' : 'alert-danger');
    feedbackText.textContent = message;
}

function nextQuestion() {
    playSound('click');
    const quiz = gameState.currentQuiz;
    quiz.currentIndex++;
    
    if (quiz.currentIndex < quiz.questions.length) {
        displayQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    const quiz = gameState.currentQuiz;
    const totalQuestions = quiz.questions.length;
    const correctAnswers = quiz.correctAnswers;
    const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
    const earnedPoints = quiz.points;
    
    // Play completion sound
    playSound('complete');
    
    // Update game state
    gameState.totalPoints += earnedPoints;
    gameState.subjects[gameState.currentSubject].points += earnedPoints;
    gameState.subjects[gameState.currentSubject].level = Math.floor(gameState.subjects[gameState.currentSubject].points / 50) + 1;
    gameState.subjects[gameState.currentSubject].progress = Math.min((gameState.subjects[gameState.currentSubject].level / 10) * 100, 100);
    
    // Check achievements
    checkAchievements(correctAnswers, totalQuestions, earnedPoints);
    
    // Display results
    document.getElementById('results-title').textContent = 
        accuracy === 100 ? '¡Perfecto! 🌟' :
        accuracy >= 80 ? '¡Excelente trabajo! 🎉' :
        accuracy >= 60 ? '¡Muy bien! 👏' :
        '¡Sigue practicando! 💪';
    
    const starsContainer = document.getElementById('results-stars');
    starsContainer.innerHTML = '';
    const stars = accuracy === 100 ? 3 : accuracy >= 60 ? 2 : 1;
    for (let i = 0; i < stars; i++) {
        starsContainer.innerHTML += '⭐';
    }
    
    document.getElementById('earned-points').textContent = `${earnedPoints} ⭐`;
    document.getElementById('correct-answers').textContent = `${correctAnswers} / ${totalQuestions}`;
    document.getElementById('accuracy').textContent = `${accuracy}%`;
    
    saveGameState();
    updateUI();
    showScreen('results-screen');
}

function retryQuiz() {
    playSound('click');
    startQuiz(gameState.currentSubject);
}

function backToSubjects() {
    playSound('click');
    showScreen('subjects-screen');
}

// Achievements
function checkAchievements(correctAnswers, totalQuestions, earnedPoints) {
    const newAchievements = [];
    
    // First quiz
    if (!gameState.achievements.includes('first_steps')) {
        newAchievements.push('first_steps');
    }
    
    // Perfect score
    if (correctAnswers === totalQuestions && !gameState.achievements.includes('perfect_score')) {
        newAchievements.push('perfect_score');
    }
    
    // 100 points
    if (gameState.totalPoints >= 100 && !gameState.achievements.includes('points_100')) {
        newAchievements.push('points_100');
    }
    
    // All subjects
    const completedSubjects = Object.values(gameState.subjects).filter(s => s.points > 0).length;
    if (completedSubjects === 4 && !gameState.achievements.includes('all_subjects')) {
        newAchievements.push('all_subjects');
    }
    
    // Level 5
    const hasLevel5 = Object.values(gameState.subjects).some(s => s.level >= 5);
    if (hasLevel5 && !gameState.achievements.includes('level_5')) {
        newAchievements.push('level_5');
    }
    
    // Add new achievements
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
    container.innerHTML = '';
    
    achievementsDB.forEach(achievement => {
        const isUnlocked = gameState.achievements.includes(achievement.id);
        const col = document.createElement('div');
        col.className = 'col-6 col-md-4 col-lg-3';
        col.innerHTML = `
            <div class="card achievement-card ${isUnlocked ? '' : 'locked'}">
                <div class="card-body">
                    <div class="fs-1 mb-2">${achievement.icon}</div>
                    <h4 class="h6">${achievement.name}</h4>
                    <p class="small text-muted mb-0">${achievement.description}</p>
                </div>
            </div>
        `;
        container.appendChild(col);
    });
    
    showScreen('achievements-screen');
}

// UI Updates
function updateUI() {
    // Update header stats
    document.getElementById('total-points').textContent = gameState.totalPoints;
    document.getElementById('streak').textContent = gameState.streak;
    document.getElementById('achievements').textContent = gameState.achievements.length;
    
    // Update sound icon
    const soundIcon = document.getElementById('sound-icon');
    if (soundIcon) {
        soundIcon.textContent = gameState.soundEnabled ? '🔊' : '🔇';
    }
    
    // Update subject cards
    Object.keys(gameState.subjects).forEach(subject => {
        const data = gameState.subjects[subject];
        const levelElement = document.querySelector(`[data-level="${subject}"]`);
        const pointsElement = document.querySelector(`[data-points="${subject}"]`);
        const progressElement = document.querySelector(`[data-progress="${subject}"]`);
        
        if (levelElement) levelElement.textContent = data.level;
        if (pointsElement) pointsElement.textContent = data.points;
        if (progressElement) progressElement.style.width = `${data.progress}%`;
    });
}

// Toast Notifications
function showToast(message) {
    const toastEl = document.getElementById('toast');
    const toastText = document.getElementById('toast-text');
    
    toastText.textContent = message;
    
    // Use Bootstrap Toast
    const toast = new bootstrap.Toast(toastEl, {
        autohide: true,
        delay: 3000
    });
    toast.show();
}

// Local Storage
function saveGameState() {
    localStorage.setItem('eduflexGameState', JSON.stringify(gameState));
}

function loadGameState() {
    const saved = localStorage.getItem('eduflexGameState');
    if (saved) {
        const loaded = JSON.parse(saved);
        gameState = { ...gameState, ...loaded };
    }
}

// PWA Install Prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show custom install prompt after 3 seconds
    setTimeout(() => {
        showInstallPrompt();
    }, 3000);
});

function showInstallPrompt() {
    const installPrompt = document.getElementById('install-prompt');
    if (installPrompt && deferredPrompt) {
        installPrompt.style.transform = 'translateY(0)';
    }
}

document.getElementById('install-btn')?.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        deferredPrompt = null;
        document.getElementById('install-prompt').style.transform = 'translateY(100%)';
    }
});

document.getElementById('cancel-install-btn')?.addEventListener('click', () => {
    document.getElementById('install-prompt').style.transform = 'translateY(100%)';
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registrado correctamente:', registration.scope);
            })
            .catch(error => {
                console.log('Error al registrar ServiceWorker:', error);
            });
    });
}

// Prevent pull-to-refresh on mobile
let startY = 0;
document.addEventListener('touchstart', (e) => {
    startY = e.touches[0].pageY;
}, { passive: true });

document.addEventListener('touchmove', (e) => {
    const y = e.touches[0].pageY;
    if (window.scrollY === 0 && y > startY && e.cancelable) {
        e.preventDefault();
    }
}, { passive: false });

// Vibration feedback for mobile
function vibrate(duration = 10) {
    if ('vibrate' in navigator) {
        navigator.vibrate(duration);
    }
}

// Enhance vibration with sound awareness
function vibrateWithSound(duration = 15) {
    if (gameState.soundEnabled) {
        vibrate(duration);
    }
}

// Optimize for mobile performance
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        // Preload images or other resources
        console.log('App optimizada para móvil');
    });
}

// Handle online/offline status
window.addEventListener('online', () => {
    showToast('¡Conexión restaurada! 🌐');
});

window.addEventListener('offline', () => {
    showToast('Modo sin conexión 📡');
});

// Initialize on load
window.addEventListener('load', () => {
    const saved = localStorage.getItem('eduflexGameState');
    if (saved) {
        gameState = JSON.parse(saved);
        if (gameState.username) {
            showScreen('subjects-screen');
            updateUI();
        }
    }
    
    // Check if running as PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        window.navigator.standalone === true;
    
    if (isStandalone) {
        console.log('App ejecutándose como PWA');
    }
});
