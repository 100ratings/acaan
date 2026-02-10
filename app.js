// ============================================================================
// TAMARIZ TRAINER - Vanilla JavaScript
// Webapp para treino da mnemônica de Tamariz
// ============================================================================

// Ordem da mnemônica de Tamariz (52 cartas)
const TAMARIZ_STACK = [
    "4♣", "2♥", "7♦", "3♣", "4♥", "6♦", "A♠", "5♥", "9♠", "2♠",
    "Q♥", "3♦", "Q♣", "8♥", "6♠", "5♠", "9♥", "K♣", "2♦", "J♥",
    "3♠", "8♠", "6♥", "10♣", "5♦", "K♦", "2♣", "3♥", "8♦", "5♣",
    "K♠", "J♦", "8♣", "10♠", "K♥", "J♣", "7♠", "10♥", "A♦", "4♠",
    "7♥", "4♦", "A♣", "9♣", "J♠", "Q♦", "7♣", "Q♠", "10♦", "6♣",
    "A♥", "9♦"
];

// Mapa de cartas para nomes em português
const CARD_NAMES = {
    "A♣": "Ás de Paus", "2♣": "2 de Paus", "3♣": "3 de Paus", "4♣": "4 de Paus",
    "5♣": "5 de Paus", "6♣": "6 de Paus", "7♣": "7 de Paus", "8♣": "8 de Paus",
    "9♣": "9 de Paus", "10♣": "10 de Paus", "J♣": "Valete de Paus", "Q♣": "Dama de Paus",
    "K♣": "Rei de Paus",
    "A♥": "Ás de Copas", "2♥": "2 de Copas", "3♥": "3 de Copas", "4♥": "4 de Copas",
    "5♥": "5 de Copas", "6♥": "6 de Copas", "7♥": "7 de Copas", "8♥": "8 de Copas",
    "9♥": "9 de Copas", "10♥": "10 de Copas", "J♥": "Valete de Copas", "Q♥": "Dama de Copas",
    "K♥": "Rei de Copas",
    "A♦": "Ás de Ouros", "2♦": "2 de Ouros", "3♦": "3 de Ouros", "4♦": "4 de Ouros",
    "5♦": "5 de Ouros", "6♦": "6 de Ouros", "7♦": "7 de Ouros", "8♦": "8 de Ouros",
    "9♦": "9 de Ouros", "10♦": "10 de Ouros", "J♦": "Valete de Ouros", "Q♦": "Dama de Ouros",
    "K♦": "Rei de Ouros",
    "A♠": "Ás de Espadas", "2♠": "2 de Espadas", "3♠": "3 de Espadas", "4♠": "4 de Espadas",
    "5♠": "5 de Espadas", "6♠": "6 de Espadas", "7♠": "7 de Espadas", "8♠": "8 de Espadas",
    "9♠": "9 de Espadas", "10♠": "10 de Espadas", "J♠": "Valete de Espadas", "Q♠": "Dama de Espadas",
    "K♠": "Rei de Espadas"
};

// Estado da aplicação
const state = {
    usedCombinations: [],
    topCard: "4♣",
    currentCard: null,
    currentPosition: null,
    correctCard: null,
    correctPosition: null,
    showAnswer: false,
    totalAvailable: 52 * 52 // 2704 combinações
};

const STORAGE_KEY = "tamariz_trainer_state";
const BATCH_SIZE = 100;

// ============================================================================
// DOM Elements
// ============================================================================

const elements = {
    cardSelectorBtn: document.getElementById("cardSelectorBtn"),
    topCardDisplay: document.getElementById("topCardDisplay"),
    cardModal: document.getElementById("cardModal"),
    modalCloseBtn: document.getElementById("modalCloseBtn"),
    
    // Novos elementos do seletor
    rankGrid: document.getElementById("rankGrid"),
    suitGrid: document.getElementById("suitGrid"),
    selectionPreview: document.getElementById("selectionPreview"),
    confirmSelectionBtn: document.getElementById("confirmSelectionBtn"),
    
    cardEmoji: document.getElementById("cardEmoji"),
    cardName: document.getElementById("cardName"),
    numberDisplay: document.getElementById("numberDisplay"),
    
    peekBtn: document.getElementById("peekBtn"),
    peekBtnText: document.getElementById("peekBtnText"),
    answerContainer: document.getElementById("answerContainer"),
    correctCardEmoji: document.getElementById("correctCardEmoji"),
    correctCardName: document.getElementById("correctCardName"),
    correctPosition: document.getElementById("correctPosition"),
    
    nextBtn: document.getElementById("nextBtn"),
    resetBtn: document.getElementById("resetBtn"),
    resetFooterBtn: document.getElementById("resetFooterBtn"),
    
    flashcardContainer: document.getElementById("flashcardContainer"),
    loadingContainer: document.getElementById("loadingContainer"),
    completionContainer: document.getElementById("completionContainer"),
    
    totalUsed: document.getElementById("totalUsed"),
    totalAvailable: document.getElementById("totalAvailable"),
    progressBar: document.getElementById("progressBar"),
};

// ============================================================================
// Utility Functions
// ============================================================================

function getCardName(card) {
    return CARD_NAMES[card] || card;
}

function getCardPosition(card, topCard) {
    const cardIndex = TAMARIZ_STACK.indexOf(card);
    const topCardIndex = TAMARIZ_STACK.indexOf(topCard);
    
    if (cardIndex === -1 || topCardIndex === -1) return -1;
    
    const position = (cardIndex - topCardIndex + 52) % 52;
    return position + 1;
}

function getCorrectCard(displayedCard, position, topCard) {
    const displayedCardIndex = TAMARIZ_STACK.indexOf(displayedCard);
    const cardNum = displayedCardIndex + 1;
    
    let peekNum = cardNum - position;
    if (peekNum <= 0) peekNum += 52;
    
    const peekCard = TAMARIZ_STACK[peekNum - 1];
    return { card: peekCard, position: peekNum };
}

function generateFlashCard(usedSet, topCard) {
    // Gerar posição aleatória (1-52)
    const position = Math.floor(Math.random() * 52) + 1;
    
    // Gerar carta aleatória (0-51)
    const cardIndex = Math.floor(Math.random() * 52);
    const card = TAMARIZ_STACK[cardIndex];
    
    // Criar chave única
    const key = `${card}:${position}:${topCard}`;
    
    // Se já foi usada, gera outra
    if (usedSet.has(key)) {
        return generateFlashCard(usedSet, topCard);
    }
    
    usedSet.add(key);
    
    const correctData = getCorrectCard(card, position, topCard);
    
    return {
        card,
        position,
        correctCard: correctData.card,
        correctPosition: correctData.position
    };
}

function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            state.usedCombinations = parsed.usedCombinations || [];
            state.topCard = parsed.topCard || "4♣";
        } catch (e) {
            console.error("Erro ao carregar estado:", e);
        }
    }
}

function saveState() {
    if (state.usedCombinations.length % BATCH_SIZE === 0) {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                usedCombinations: state.usedCombinations,
                topCard: state.topCard
            })
        );
    }
}

function updateProgress() {
    const used = state.usedCombinations.length;
    const percentage = Math.round((used / state.totalAvailable) * 100);
    
    elements.totalUsed.textContent = used;
    elements.progressBar.style.width = percentage + "%";
}

function updateUI() {
    if (!state.currentCard) return;
    
    elements.cardEmoji.textContent = state.currentCard;
    elements.cardName.textContent = getCardName(state.currentCard);
    elements.numberDisplay.textContent = state.currentPosition;
    
    elements.correctCardEmoji.textContent = state.correctCard;
    elements.correctCardName.textContent = getCardName(state.correctCard);
    
    const actualCorrectPosition = getCardPosition(state.correctCard, state.topCard);
    elements.correctPosition.textContent = actualCorrectPosition;
    
    elements.topCardDisplay.textContent = state.topCard;
    
    state.showAnswer = false;
    elements.answerContainer.classList.add("hidden");
    elements.peekBtn.classList.remove("active");
    elements.peekBtnText.textContent = "Ver Resposta";
}

function generateNewFlashCard() {
    const usedSet = new Set(state.usedCombinations);
    
    if (usedSet.size >= state.totalAvailable) {
        showCompletion();
        return;
    }
    
    showLoading();
    
    // Simular delay para melhor UX
    setTimeout(() => {
        const newCard = generateFlashCard(usedSet, state.topCard);
        
        state.currentCard = newCard.card;
        state.currentPosition = newCard.position;
        state.correctCard = newCard.correctCard;
        state.correctPosition = newCard.correctPosition;
        state.usedCombinations = Array.from(usedSet);
        
        saveState();
        updateProgress();
        updateUI();
        showFlashcard();
    }, 100);
}

// ============================================================================
// UI State Management
// ============================================================================

function showFlashcard() {
    elements.flashcardContainer.classList.remove("hidden");
    elements.loadingContainer.classList.add("hidden");
    elements.completionContainer.classList.add("hidden");
}

function showLoading() {
    elements.flashcardContainer.classList.add("hidden");
    elements.loadingContainer.classList.remove("hidden");
    elements.completionContainer.classList.add("hidden");
}

function showCompletion() {
    elements.flashcardContainer.classList.add("hidden");
    elements.loadingContainer.classList.add("hidden");
    elements.completionContainer.classList.remove("hidden");
}

// ============================================================================
// Modal Functions
// ============================================================================

function openCardModal() {
    elements.cardModal.classList.remove("hidden");
    resetSelectorUI();
}

function closeCardModal() {
    elements.cardModal.classList.add("hidden");
}

// Variáveis temporárias para o seletor
let tempRank = null;
let tempSuit = null;

const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const SUITS = ["♣", "♥", "♠", "♦"];

function resetSelectorUI() {
    tempRank = null;
    tempSuit = null;
    updateSelectionPreview();
    renderSelectorGrids();
}

function renderSelectorGrids() {
    // Renderizar Ranks
    elements.rankGrid.innerHTML = "";
    RANKS.forEach(rank => {
        const btn = document.createElement("button");
        btn.className = "sel-btn rank-btn";
        if (rank === tempRank) btn.classList.add("selected");
        btn.textContent = rank;
        btn.onclick = () => {
            tempRank = rank;
            renderSelectorGrids(); // Re-render para atualizar classe selected
            updateSelectionPreview();
        };
        elements.rankGrid.appendChild(btn);
    });

    // Renderizar Naipes
    elements.suitGrid.innerHTML = "";
    SUITS.forEach(suit => {
        const btn = document.createElement("button");
        btn.className = "sel-btn suit-btn";
        if (suit === tempSuit) btn.classList.add("selected");
        btn.textContent = suit;
        btn.dataset.suit = suit; // Para cor vermelha no CSS
        btn.onclick = () => {
            tempSuit = suit;
            renderSelectorGrids();
            updateSelectionPreview();
        };
        elements.suitGrid.appendChild(btn);
    });
}

function updateSelectionPreview() {
    if (tempRank && tempSuit) {
        const fullCard = tempRank + tempSuit;
        elements.selectionPreview.textContent = fullCard + " - " + getCardName(fullCard);
        elements.confirmSelectionBtn.disabled = false;
    } else {
        elements.selectionPreview.textContent = "--";
        elements.confirmSelectionBtn.disabled = true;
    }
}

function confirmSelection() {
    if (!tempRank || !tempSuit) return;
    
    const newTopCard = tempRank + tempSuit;
    
    // Validar se existe na stack (segurança)
    if (!TAMARIZ_STACK.includes(newTopCard)) {
        alert("Erro: Carta inválida");
        return;
    }

    state.topCard = newTopCard;
    state.currentCard = null;
    state.showAnswer = false;
    
    saveState(); // Salvar imediatamente a mudança de topo
    
    closeCardModal();
    generateNewFlashCard();
}

// ============================================================================
// Event Listeners
// ============================================================================

elements.cardSelectorBtn.addEventListener("click", openCardModal);
elements.modalCloseBtn.addEventListener("click", closeCardModal);
elements.confirmSelectionBtn.addEventListener("click", confirmSelection);

elements.peekBtn.addEventListener("click", () => {
    state.showAnswer = !state.showAnswer;
    
    if (state.showAnswer) {
        elements.answerContainer.classList.remove("hidden");
        elements.peekBtn.classList.add("active");
        elements.peekBtnText.textContent = "Esconder Resposta";
    } else {
        elements.answerContainer.classList.add("hidden");
        elements.peekBtn.classList.remove("active");
        elements.peekBtnText.textContent = "Ver Resposta";
    }
});

elements.nextBtn.addEventListener("click", generateNewFlashCard);

elements.resetBtn.addEventListener("click", () => {
    state.usedCombinations = [];
    state.topCard = "4♣";
    state.currentCard = null;
    state.showAnswer = false;
    
    localStorage.removeItem(STORAGE_KEY);
    updateProgress();
    generateNewFlashCard();
});

elements.resetFooterBtn.addEventListener("click", () => {
    state.usedCombinations = [];
    state.topCard = "4♣";
    state.currentCard = null;
    state.showAnswer = false;
    
    localStorage.removeItem(STORAGE_KEY);
    updateProgress();
    generateNewFlashCard();
});

// ============================================================================
// Initialization
// ============================================================================

function init() {
    loadState();
    updateProgress();
    generateNewFlashCard();
}

// Iniciar quando o DOM estiver pronto
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
