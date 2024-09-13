const deck = [];
const suits = ['♠', '♥', '♦', '♣'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
let playerHand = [];
let dealerHand = [];
let playerScore = 0;
let dealerScore = 0;
let gameOver = false;

// Criando o baralho
function createDeck() {
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ value, suit });
        }
    }
}

// Embaralhando o baralho
function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// Função para calcular o valor da mão
function calculateHandValue(hand) {
    let sum = 0;
    let aceCount = 0;

    for (let card of hand) {
        if (['J', 'Q', 'K'].includes(card.value)) {
            sum += 10;
        } else if (card.value === 'A') {
            sum += 11;
            aceCount++;
        } else {
            sum += parseInt(card.value);
        }
    }

    // Ajusta o valor do Ás se a soma for maior que 21
    while (sum > 21 && aceCount > 0) {
        sum -= 10;
        aceCount--;
    }

    return sum;
}

// Função para atualizar a tela
function updateDisplay() {
    document.getElementById('player-cards').textContent = playerHand.map(card => card.value + card.suit).join(', ');
    document.getElementById('dealer-cards').textContent = dealerHand.map(card => card.value + card.suit).join(', ');

    playerScore = calculateHandValue(playerHand);
    dealerScore = calculateHandValue(dealerHand);

    document.getElementById('player-score').textContent = `Pontos: ${playerScore}`;
    document.getElementById('dealer-score').textContent = `Pontos: ${dealerScore}`;
}

// Iniciar o jogo
function startGame() {
    createDeck();
    shuffleDeck();

    // Dealer e jogador recebem duas cartas
    playerHand.push(deck.pop(), deck.pop());
    dealerHand.push(deck.pop(), deck.pop());

    updateDisplay();

    document.getElementById('message').textContent = '';
    document.getElementById('hit').disabled = false;
    document.getElementById('stand').disabled = false;
    document.getElementById('reset').style.display = 'none';
    gameOver = false;
}

// Função para "Pedir Carta"
document.getElementById('hit').addEventListener('click', function () {
    if (!gameOver) {
        playerHand.push(deck.pop());
        playerScore = calculateHandValue(playerHand);
        updateDisplay();

        // Se o jogador ultrapassar 21, ele perde
        if (playerScore > 21) {
            endGame('Você perdeu! Ultrapassou 21.');
        }
    }
});

// Função para "Parar"
document.getElementById('stand').addEventListener('click', function () {
    if (!gameOver) {
        // Dealer compra cartas até ter 17 ou mais pontos
        while (dealerScore < 17) {
            dealerHand.push(deck.pop());
            dealerScore = calculateHandValue(dealerHand);
        }

        updateDisplay();

        // Verificar o resultado
        if (dealerScore > 21) {
            endGame('Você ganhou! A banca ultrapassou 21.');
        } else if (dealerScore > playerScore) {
            endGame('Você perdeu! A banca tem mais pontos.');
        } else if (dealerScore < playerScore) {
            endGame('Você ganhou!');
        } else {
            endGame('Empate!');
        }
    }
});

// Função para finalizar o jogo
function endGame(message) {
    gameOver = true;
    document.getElementById('message').textContent = message;
    document.getElementById('hit').disabled = true;
    document.getElementById('stand').disabled = true;
    document.getElementById('reset').style.display = 'block';
}

// Reiniciar o jogo
document.getElementById('reset').addEventListener('click', function () {
    playerHand = [];
    dealerHand = [];
    playerScore = 0;
    dealerScore = 0;
    deck.length = 0;
    startGame();
});

// Inicia o jogo ao carregar a página
startGame();
