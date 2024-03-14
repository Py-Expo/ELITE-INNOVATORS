const selectors = {
    boardContainer: document.querySelector('.board-container'),
    board: document.querySelector('.board'),
    moves: document.querySelector('.moves'),
    timer: document.querySelector('.time'),
    start: document.querySelector('.start'),
    win: document.querySelector('.win'),
};

const state = {
    gameStarted: false,
    totalFlips: 0,
    totalTime: 0,
    loop: null,
    matchedPairs: 0,
    flippedCards: [],
};

const images = [
    'camel.jpg',
    'camel2.jpg',
    'chlorophyll.jpg',
    'chlorophyll2.jpg',
    //'city.jpg',
    //'city2.jpg',
    //'hiter.jpg', 
    //'hiter2.jpg', 
    //'len.jpg',
    //'len2.jpg',
    //'moon.jpg',
    //'moon2.jpg',
    //'pie.jpg',
    //'pie2.jpg',
    //'titanic.jpg',
    //'titanic2.jpg',
];

const specificMatches = {
    'hiter.jpg': 'hiter2.jpg',
    'city.jpg': 'city2.jpg',
    'camel.jpg': 'camel2.jpg',
    'chlorophyll.jpg': 'chlorophyll2.jpg',
    'len.jpg': 'len2.jpg',
    'moon.jpg': 'moon2.jpg',
    'pie.jpg': 'pie2.jpg',
    'titanic.jpg': 'titanic2.jpg'
    
};
const generateGame = () => {
    const dimensions = selectors.board.getAttribute('data-dimension'); // Update dimensions to 2x2 grid

    if (dimensions % 2 !== 0) {
        throw new Error("The dimension of the board must be an even number.");
    }

    const totalPairs = dimensions * dimensions / 2;

    const pairedImages = [];
    const usedIndexes = [];
    
    for (const specificImage in specificMatches) {
        const matchedImage = specificMatches[specificImage];
        const index = images.indexOf(specificImage);
        if (index !== -1 && !usedIndexes.includes(index)) {
            pairedImages.push(specificImage, matchedImage);
            usedIndexes.push(index);
        }
    }

    for (let i = 0; i < totalPairs - Object.keys(specificMatches).length; i++) {
        let randomIndex1, randomIndex2;
        do {
            randomIndex1 = Math.floor(Math.random() * images.length);
            randomIndex2 = Math.floor(Math.random() * images.length);
        } while (randomIndex1 === randomIndex2 || usedIndexes.includes(randomIndex1) || usedIndexes.includes(randomIndex2));
        
        pairedImages.push(images[randomIndex1], images[randomIndex2]);
        usedIndexes.push(randomIndex1, randomIndex2);
    }

    const items = shuffle(pairedImages);
    const cards = `
    <div class="board" style="grid-template-columns: repeat(${dimensions}, auto)">
        ${items.map((item, index) => `
            <div class="card" data-index="${index}">
                <div class="card-front"></div>
                <div class="card-back">
                    <img src="image/${item}" alt="Image" class="card-image">
                </div>
            </div>
        `).join('')}
    </div>
`;

    selectors.board.innerHTML = cards;

    // Show cards face-up for 5 seconds
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => card.classList.add('flipped'));
    setTimeout(() => {
        allCards.forEach(card => card.classList.remove('flipped'));
        allCards.forEach(card => card.addEventListener('click', () => flipCard(card)));
    }, 5000);
};





const startGame = () => {
    state.gameStarted = true;
    selectors.start.classList.add('disabled');

    state.loop = setInterval(() => {
        state.totalTime++;
        selectors.moves.innerText = `${state.totalFlips} Moves`;
        selectors.timer.innerText = `Time: ${state.totalTime} sec`;
    }, 1000);
};

const flipBackCards = () => {
    state.flippedCards.forEach(card => {
        card.classList.remove('flipped');
    });

    state.totalFlips++;
    state.flippedCards = [];
};

const correctMatches = {
    'hiter.jpg': 'hiter2.jpg',
    'city.jpg': 'city2.jpg',
    'camel.jpg': 'camel2.jpg',
    'chlorophyll.jpg': 'chlorophyll2.jpg',
    'len.jpg': 'len2.jpg',
    'moon.jpg': 'moon2.jpg',
    'pie.jpg': 'pie2.jpg',
    'titanic.jpg': 'titanic2.jpg',
};

const checkMatch = () => {
    if (state.flippedCards.length === 2) {
        const [firstCard, secondCard] = state.flippedCards;
        const firstImageSrc = firstCard.querySelector('.card-back img').src.split('/').pop();
        const secondImageSrc = secondCard.querySelector('.card-back img').src.split('/').pop();

        if (correctMatches[firstImageSrc] === secondImageSrc || correctMatches[secondImageSrc] === firstImageSrc) {
            state.flippedCards.forEach(card => card.classList.add('matched'));
            state.matchedPairs++;
            state.flippedCards = []; // Reset flipped cards after match
            if (state.matchedPairs === document.querySelectorAll('.card').length / 2) {
                setTimeout(() => {
                    selectors.boardContainer.classList.add('flipped');
                    selectors.win.innerHTML = `
                        <span class="win-text">
                            You Won! Congratulations<br />
                            with <span class="highlight">${state.totalFlips}</span>
                            moves<br />
                            under <span class="highlight">${state.totalTime}</span>
                            seconds
                        </span>
                    `;
                    clearInterval(state.loop);
                }, 1000);
            }
        } else {
            setTimeout(() => {
                flipBackCards();
            }, 1000);
        }
    }
};


const flipCard = card => {
    if (!state.gameStarted || card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }

    if (state.flippedCards.length < 2) {
        card.classList.add('flipped');
        state.flippedCards.push(card);
        state.totalFlips++;
    }

    checkMatch();
};

const attachEventListeners = () => {
    document.addEventListener('click', event => {
        const eventTarget = event.target;
        const eventParent = eventTarget.parentElement;

        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
            flipCard(eventParent);
        } else if (eventTarget.nodeName === 'BUTTON' && !eventTarget.className.includes('disabled')) {
            startGame();
        }
    });
};

generateGame();
attachEventListeners();

function shuffle(array) {
    const clonedArray = [...array];

    for (let i = clonedArray.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        const original = clonedArray[i];

        clonedArray[i] = clonedArray[randomIndex];
        clonedArray[randomIndex] = original;
    }
    return clonedArray;
}
