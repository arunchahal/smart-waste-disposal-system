// Waste Games JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const sortingGame = document.getElementById('sorting-game');
    const recyclingQuiz = document.getElementById('recycling-quiz');
    const ecoCityBuilder = document.getElementById('eco-city-builder');
    const sortingGameModal = document.getElementById('sorting-game-modal');
    const gameModalClose = document.getElementById('game-modal-close');
    const gameInstructions = document.getElementById('game-instructions');
    const gamePlayArea = document.getElementById('game-play-area');
    const gameResults = document.getElementById('game-results');
    const startGameBtn = document.getElementById('start-game-btn');
    const wasteItems = document.getElementById('waste-items');
    const wasteBins = document.querySelectorAll('.waste-bin');
    const gameScore = document.getElementById('game-score');
    const gameTimer = document.getElementById('game-timer');
    const finalScore = document.getElementById('final-score');
    const ecoPointsEarned = document.getElementById('eco-points-earned');
    const correctSorts = document.getElementById('correct-sorts');
    const incorrectSorts = document.getElementById('incorrect-sorts');
    const totalSorted = document.getElementById('total-sorted');
    const playAgainBtn = document.getElementById('play-again-btn');
    const exitGameBtn = document.getElementById('exit-game-btn');
    
    // Game state
    let score = 0;
    let timer = 60;
    let timerInterval;
    let correctCount = 0;
    let incorrectCount = 0;
    let gameActive = false;
    
    // Waste items database
    const wasteItemsData = [
        { id: 1, name: 'Plastic Bottle', type: 'recyclable', image: 'bottle.png' },
        { id: 2, name: 'Banana Peel', type: 'organic', image: 'banana.png' },
        { id: 3, name: 'Paper', type: 'recyclable', image: 'paper.png' },
        { id: 4, name: 'Battery', type: 'hazardous', image: 'battery.png' },
        { id: 5, name: 'Food Scraps', type: 'organic', image: 'food.png' },
        { id: 6, name: 'Plastic Bag', type: 'general', image: 'plastic-bag.png' },
        { id: 7, name: 'Glass Bottle', type: 'recyclable', image: 'glass.png' },
        { id: 8, name: 'Cardboard', type: 'recyclable', image: 'cardboard.png' },
        { id: 9, name: 'Coffee Cup', type: 'general', image: 'coffee-cup.png' },
        { id: 10, name: 'Apple Core', type: 'organic', image: 'apple.png' },
        { id: 11, name: 'Paint Can', type: 'hazardous', image: 'paint.png' },
        { id: 12, name: 'Aluminum Can', type: 'recyclable', image: 'can.png' },
        { id: 13, name: 'Styrofoam', type: 'general', image: 'styrofoam.png' },
        { id: 14, name: 'Light Bulb', type: 'hazardous', image: 'bulb.png' },
        { id: 15, name: 'Egg Shells', type: 'organic', image: 'eggshell.png' }
    ];
    
    // Open sorting game modal
    if (sortingGame) {
        sortingGame.addEventListener('click', function() {
            if (sortingGameModal) {
                resetGame();
                sortingGameModal.classList.add('show');
            }
        });
    }
    
    // Close game modal
    if (gameModalClose) {
        gameModalClose.addEventListener('click', closeGameModal);
    }
    
    function closeGameModal() {
        if (sortingGameModal) {
            sortingGameModal.classList.remove('show');
            resetGame();
            clearInterval(timerInterval);
        }
    }
    
    // Start game button
    if (startGameBtn) {
        startGameBtn.addEventListener('click', startGame);
    }
    
    // Play again button
    if (playAgainBtn) {
        playAgainBtn.addEventListener('click', function() {
            resetGame();
            startGame();
        });
    }
    
    // Exit game button
    if (exitGameBtn) {
        exitGameBtn.addEventListener('click', closeGameModal);
    }
    
    // Start game
    function startGame() {
        // Reset game state
        score = 0;
        timer = 60;
        correctCount = 0;
        incorrectCount = 0;
        gameActive = true;
        
        // Update UI
        gameScore.textContent = score;
        gameTimer.textContent = timer;
        gameInstructions.style.display = 'none';
        gamePlayArea.style.display = 'flex';
        gameResults.style.display = 'none';
        
        // Generate waste items
        generateWasteItems();
        
        // Start timer
        timerInterval = setInterval(updateTimer, 1000);
        
        // Setup drag and drop
        setupDragAndDrop();
    }
    
    // Generate waste items
    function generateWasteItems() {
        if (!wasteItems) return;
        
        wasteItems.innerHTML = '';
        
        // Randomly select 6 waste items
        const shuffled = [...wasteItemsData].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 6);
        
        selected.forEach(item => {
            const wasteItem = document.createElement('div');
            wasteItem.className = 'waste-item';
            wasteItem.setAttribute('draggable', 'true');
            wasteItem.setAttribute('data-id', item.id);
            wasteItem.setAttribute('data-type', item.type);
            
            // Use a placeholder image since we don't have actual images
            wasteItem.innerHTML = `
                <div class="waste-item-icon">
                    <i class="fas fa-trash"></i>
                </div>
                <div class="waste-item-name">${item.name}</div>
            `;
            
            wasteItems.appendChild(wasteItem);
        });
    }
    
    // Setup drag and drop
    function setupDragAndDrop() {
        const items = document.querySelectorAll('.waste-item');
        
        items.forEach(item => {
            item.addEventListener('dragstart', dragStart);
        });
        
        wasteBins.forEach(bin => {
            bin.addEventListener('dragover', dragOver);
            bin.addEventListener('dragleave', dragLeave);
            bin.addEventListener('drop', drop);
        });
    }
    
    // Drag start
    function dragStart(e) {
        if (!gameActive) return;
        
        e.dataTransfer.setData('text/plain', e.target.dataset.id);
        e.dataTransfer.setData('type', e.target.dataset.type);
        
        // Add dragging class
        e.target.classList.add('dragging');
    }
    
    // Drag over
    function dragOver(e) {
        if (!gameActive) return;
        
        e.preventDefault();
        this.classList.add('highlight');
    }
    
    // Drag leave
    function dragLeave(e) {
        if (!gameActive) return;
        
        this.classList.remove('highlight');
    }
    
    // Drop
    function drop(e) {
        if (!gameActive) return;
        
        e.preventDefault();
        this.classList.remove('highlight');
        
        const itemId = e.dataTransfer.getData('text/plain');
        const itemType = e.dataTransfer.getData('type');
        const binType = this.dataset.binType;
        
        const item = document.querySelector(`.waste-item[data-id="${itemId}"]`);
        
        if (item) {
            // Check if correct bin
            if (itemType === binType) {
                // Correct sorting
                score += 10;
                correctCount++;
                
                // Visual feedback
                this.classList.add('correct');
                setTimeout(() => {
                    this.classList.remove('correct');
                }, 500);
            } else {
                // Incorrect sorting
                score = Math.max(0, score - 5);
                incorrectCount++;
                
                // Visual feedback
                this.classList.add('incorrect');
                setTimeout(() => {
                    this.classList.remove('incorrect');
                }, 500);
            }
            
            // Update score
            gameScore.textContent = score;
            
            // Remove item
            item.remove();
            
            // Generate new item if less than 6 items
            if (document.querySelectorAll('.waste-item').length < 6) {
                generateNewItem();
            }
        }
    }
    
    // Generate new item
    function generateNewItem() {
        if (!wasteItems) return;
        
        // Get current item IDs
        const currentIds = Array.from(document.querySelectorAll('.waste-item')).map(item => 
            parseInt(item.dataset.id)
        );
        
        // Filter out items already in play
        const availableItems = wasteItemsData.filter(item => !currentIds.includes(item.id));
        
        if (availableItems.length === 0) return;
        
        // Randomly select an item
        const randomIndex = Math.floor(Math.random() * availableItems.length);
        const newItem = availableItems[randomIndex];
        
        // Create new waste item
        const wasteItem = document.createElement('div');
        wasteItem.className = 'waste-item';
        wasteItem.setAttribute('draggable', 'true');
        wasteItem.setAttribute('data-id', newItem.id);
        wasteItem.setAttribute('data-type', newItem.type);
        
        // Use a placeholder image since we don't have actual images
        wasteItem.innerHTML = `
            <div class="waste-item-icon">
                <i class="fas fa-trash"></i>
            </div>
            <div class="waste-item-name">${newItem.name}</div>
        `;
        
        wasteItems.appendChild(wasteItem);
        
        // Add drag event
        wasteItem.addEventListener('dragstart', dragStart);
    }
    
    // Update timer
    function updateTimer() {
        if (timer > 0) {
            timer--;
            gameTimer.textContent = timer;
        } else {
            // Game over
            endGame();
        }
    }
    
    // End game
    function endGame() {
        gameActive = false;
        clearInterval(timerInterval);
        
        // Calculate eco points (50% of score)
        const points = Math.floor(score * 0.5);
        
        // Update results
        finalScore.textContent = score;
        ecoPointsEarned.textContent = points;
        correctSorts.textContent = correctCount;
        incorrectSorts.textContent = incorrectCount;
        totalSorted.textContent = correctCount + incorrectCount;
        
        // Show results
        gamePlayArea.style.display = 'none';
        gameResults.style.display = 'block';
        
        // Update eco points in the sidebar (simulation)
        const ecoPointsBadge = document.querySelector('.sidebar-menu .badge.green');
        if (ecoPointsBadge) {
            const currentPoints = parseInt(ecoPointsBadge.textContent);
            ecoPointsBadge.textContent = currentPoints + points;
        }
    }
    
    // Reset game
    function resetGame() {
        // Reset game state
        score = 0;
        timer = 60;
        correctCount = 0;
        incorrectCount = 0;
        gameActive = false;
        
        // Clear timer
        clearInterval(timerInterval);
        
        // Reset UI
        if (gameScore) gameScore.textContent = score;
        if (gameTimer) gameTimer.textContent = timer;
        if (gameInstructions) gameInstructions.style.display = 'block';
        if (gamePlayArea) gamePlayArea.style.display = 'none';
        if (gameResults) gameResults.style.display = 'none';
        if (wasteItems) wasteItems.innerHTML = '';
    }
    
    // Add click handlers for other games (placeholders)
    if (recyclingQuiz) {
        recyclingQuiz.addEventListener('click', function() {
            alert('Recycling Quiz coming soon!');
        });
    }
    
    if (ecoCityBuilder) {
        ecoCityBuilder.addEventListener('click', function() {
            alert('Eco City Builder coming soon!');
        });
    }
});