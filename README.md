# 🎓 EDUFLEX - Aplicación Educativa para Primaria

Una aplicación web interactiva de aprendizaje estilo Duolingo, diseñada para estudiantes de nivel primaria.

## ✨ Características

### 📚 Materias Disponibles

- **Matemáticas** 🔢 - Operaciones básicas, problemas y más
- **Ciencias** 🔬 - Naturaleza, cuerpo humano, planetas
- **Lengua** 📖 - Gramática, vocabulario, ortografía
- **Historia** 🏛️ - Eventos históricos, culturas, personajes

### 🎮 Sistema de Gamificación

- ⭐ **Puntos**: Gana puntos por cada respuesta correcta
- 🔥 **Rachas**: Mantén una racha de días estudiando
- 🏆 **Logros**: Desbloquea logros especiales
- 📊 **Progreso**: Sube de nivel en cada materia
- ⭐ **Sistema de Estrellas**: Obtén hasta 3 estrellas por quiz

### 🎯 Características de Aprendizaje

- Preguntas adaptadas al nivel primaria
- Diferentes niveles de dificultad
- Feedback inmediato en cada respuesta
- Sistema de progresión por materia
- Interfaz colorida y amigable

### 🏆 Sistema de Logros

- 👣 **Primeros Pasos**: Completa tu primer quiz
- 💯 **Perfección**: Obtén 100% en un quiz
- ⭐ **Coleccionista**: Acumula 100 puntos
- 🎓 **Estudiante Completo**: Completa un quiz de cada materia
- 🔥 **En Racha**: Mantén una racha de 3 días
- 🚀 **Subiendo Nivel**: Alcanza nivel 5 en cualquier materia
- ⚡ **Aprendiz Rápido**: Responde 5 preguntas seguidas correctamente
- 💪 **Dedicación**: Completa 10 quizzes

## 🚀 Cómo Usar

1. **Abrir la aplicación**: Simplemente abre el archivo `index.html` en tu navegador web

2. **Registrarte**: Ingresa tu nombre en la pantalla de bienvenida

3. **Elegir materia**: Selecciona la materia que quieres practicar

4. **Responder preguntas**: Responde las 5 preguntas del quiz

5. **Ver resultados**: Observa tu puntuación, estrellas ganadas y progreso

6. **Desbloquear logros**: Completa desafíos para obtener logros especiales

## 📁 Estructura del Proyecto

```
EDUFLEX/
│
├── index.html          # Estructura HTML de la aplicación
├── styles.css          # Estilos y diseño responsive
├── script.js           # Lógica del juego y gestión de estado
├── service-worker.js   # Service Worker para PWA
├── manifest.json       # Manifest de la aplicación web
└── README.md          # Este archivo
```

## 💾 Almacenamiento

La aplicación guarda automáticamente tu progreso en el navegador usando `localStorage`:

- Puntos totales y por materia
- Nivel alcanzado en cada materia
- Logros desbloqueados
- Racha de días

## 🎨 Personalización

### Agregar Nuevas Preguntas

Edita el archivo `script.js` y busca el objeto `questionsDB`. Puedes agregar nuevas preguntas siguiendo este formato:

```javascript
{
    question: '¿Tu pregunta aquí?',
    answers: ['Opción 1', 'Opción 2', 'Opción 3', 'Opción 4'],
    correct: 0, // Índice de la respuesta correcta (0-3)
    difficulty: 1 // Nivel de dificultad (1-3)
}
```

### Agregar Nuevos Logros

Busca el array `achievementsDB` en `script.js` y agrega nuevos logros:

```javascript
{
    id: 'mi_logro',
    icon: '🎯',
    name: 'Nombre del Logro',
    description: 'Descripción de cómo desbloquearlo'
}
```

### Cambiar Colores

Modifica las variables de color en `styles.css` y `manifest.json`:

- Color principal: `#667eea`
- Puedes cambiar estos valores por cualquier color que prefieras

## 🌐 Compatibilidad

- ✅ Chrome / Edge (recomendado)
- ✅ Firefox
- ✅ Safari
- ✅ Opera
- 📱 Responsive (funciona en móviles y tablets)
- 🚀 PWA (Progressive Web App)

## 🔧 Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Diseño moderno con Bootstrap 5
- **JavaScript (ES6+)**: Lógica optimizada del juego
- **Service Worker**: Funcionalidad offline
- **PWA**: Instalable como aplicación nativa
- **LocalStorage**: Persistencia de datos

## 📱 PWA Features

EDUFLEX es una Progressive Web App que incluye:

- 📴 **Funciona sin conexión**: Una vez cargada, funciona offline
- 📱 **Instalable**: Se puede instalar como app nativa en móviles
- ⚡ **Rápida**: Cache inteligente para carga instantánea
- 🔄 **Auto-actualizable**: Se actualiza automáticamente

## 📱 Responsive Design

La aplicación está completamente optimizada para:

- 💻 Computadoras de escritorio
- 📱 Teléfonos móviles
- 📱 Tablets

## 🎯 Próximas Características (Ideas)

- [ ] Más preguntas para cada materia
- [ ] Modo multijugador
- [ ] Temporizador para preguntas
- [ ] Tabla de clasificación
- [ ] Avatares personalizables
- [ ] Sonidos y efectos mejorados
- [ ] Modo oscuro
- [ ] Estadísticas detalladas
- [ ] Exportar progreso

## 👨‍💻 Desarrollo

Para modificar la aplicación:

1. Abre los archivos en tu editor de código favorito (VS Code, Sublime Text, etc.)
2. Realiza los cambios deseados
3. Guarda y recarga el navegador para ver los cambios

No se requiere compilación ni instalación de dependencias.

## 📄 Licencia

Este proyecto es de código abierto y está disponible para uso educativo.

## 🤝 Contribuir

¿Tienes ideas para mejorar EDUFLEX? ¡Las sugerencias son bienvenidas!

---

**¡Diviértete aprendiendo con EDUFLEX! 🎉📚**
