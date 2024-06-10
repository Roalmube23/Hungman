document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-game');
    const categorySelect = document.getElementById('category');
    const difficultySelect = document.getElementById('difficulty');
    const wordContainer = document.getElementById('word-container');
    const messageDiv = document.getElementById('message');
    const wrongLettersDiv = document.getElementById('wrong-letters');
    const keyboardGrid = document.querySelector('.keyboard-grid');
    const canvas = document.getElementById('hangman-canvas');
    const ctx = canvas.getContext('2d');

    const words = {
        figuras: ["circulo", "triangulo", "cuadrado"],
        paises: ["mexico", "canada", "argentina"],
        colores: ["rojo", "azul", "verde"]
    };

    let chosenWord = '';
    let displayedWord = '';
    let wrongLetters = [];
    let correctLetters = [];
    let maxWrongGuesses = 0;

    startButton.addEventListener('click', startGame);

    function startGame() {
        const category = categorySelect.value;
        const difficulty = difficultySelect.value;

        chosenWord = words[category][Math.floor(Math.random() * words[category].length)];
        displayedWord = '_'.repeat(chosenWord.length);
        correctLetters = [];
        wrongLetters = [];
        clearCanvas();
        setMaxWrongGuesses(difficulty);

        updateDisplayedWord();
        updateWrongLetters();
        messageDiv.textContent = '';
        generateKeyboard();
    }

    function setMaxWrongGuesses(difficulty) {
        switch (difficulty) {
            case 'easy':
                maxWrongGuesses = 8;
                break;
            case 'medium':
                maxWrongGuesses = 5;
                break;
            case 'hard':
                maxWrongGuesses = 3;
                break;
        }
    }

    function updateDisplayedWord() {
        wordContainer.textContent = displayedWord.split('').join(' ');
    }

    function updateWrongLetters() {
        wrongLettersDiv.textContent = `Letras incorrectas: ${wrongLetters.join(', ')}`;
        drawHangman();
    }

    function generateKeyboard() {
        keyboardGrid.innerHTML = '';
        for (let i = 65; i <= 90; i++) {
            const button = document.createElement('button');
            button.textContent = String.fromCharCode(i);
            button.addEventListener('click', () => handleGuess(button.textContent.toLowerCase()));
            keyboardGrid.appendChild(button);
        }
    }

    function handleGuess(letter) {
        if (correctLetters.includes(letter) || wrongLetters.includes(letter)) {
            return; // La letra ya fue adivinada
        }

        if (chosenWord.includes(letter)) {
            correctLetters.push(letter);
            updateDisplayedWordState();
        } else {
            wrongLetters.push(letter);
            updateWrongLetters();
        }
        checkGameState();
    }

    function updateDisplayedWordState() {
        displayedWord = chosenWord.split('').map(letter => correctLetters.includes(letter) ? letter : '_').join('');
        updateDisplayedWord();
    }

    function checkGameState() {
        if (displayedWord === chosenWord) {
            messageDiv.textContent = '¡Ganaste!';
            disableKeyboard();
        } else if (wrongLetters.length >= maxWrongGuesses) {
            messageDiv.textContent = `Perdiste. La palabra era "${chosenWord}".`;
            disableKeyboard();
        }
    }

    function drawHangman() {
        const errors = wrongLetters.length;
        clearCanvas();

        if (errors > 0) {
            // Base
            ctx.beginPath();
            ctx.moveTo(10, 190);
            ctx.lineTo(190, 190);
            ctx.stroke();
        }
        if (errors > 1) {
            // Poste
            ctx.beginPath();
            ctx.moveTo(30, 190);
            ctx.lineTo(30, 10);
            ctx.lineTo(100, 10);
            ctx.lineTo(100, 30);
            ctx.stroke();
        }
        if (errors > 2) {
            // Cabeza
            ctx.beginPath();
            ctx.arc(100, 50, 20, 0, Math.PI * 2, true);
            ctx.stroke();
        }
        if (errors > 3) {
            // Cuerpo
            ctx.beginPath();
            ctx.moveTo(100, 70);
            ctx.lineTo(100, 130);
            ctx.stroke();
        }
        if (errors > 4) {
            // Pierna izquierda
            ctx.beginPath();
            ctx.moveTo(100, 130);
            ctx.lineTo(80, 170);
            ctx.stroke();
        }
        if (errors > 5) {
            // Pierna derecha
            ctx.beginPath();
            ctx.moveTo(100, 130);
            ctx.lineTo(120, 170);
            ctx.stroke();
        }
        if (errors > 6) {
            // Brazo izquierdo
            ctx.beginPath();
            ctx.moveTo(100, 90);
            ctx.lineTo(80, 110);
            ctx.stroke();
        }
        if (errors > 7) {
            // Brazo derecho
            ctx.beginPath();
            ctx.moveTo(100, 90);
            ctx.lineTo(120, 110);
            ctx.stroke();
        }
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function disableKeyboard() {
        Array.from(keyboardGrid.children).forEach(button => button.disabled = true);
    }
});
