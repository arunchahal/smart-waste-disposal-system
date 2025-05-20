// AI Waste Scanner JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const scannerBtn = document.getElementById('scanner-btn');
    const scannerLink = document.getElementById('waste-scanner-link');
    const scannerModal = document.getElementById('scanner-modal');
    const scannerModalClose = document.getElementById('scanner-modal-close');
    const takePhotoBtn = document.getElementById('take-photo-btn');
    const uploadWastePhotoBtn = document.getElementById('upload-waste-photo-btn');
    const wastePhotoInput = document.getElementById('waste-photo-input');
    const cameraPlaceholder = document.getElementById('camera-placeholder');
    const cameraFeed = document.getElementById('camera-feed');
    const photoCanvas = document.getElementById('photo-canvas');
    const previewImageContainer = document.getElementById('preview-image-container');
    const previewImage = document.getElementById('preview-image');
    const capturePhotoBtn = document.getElementById('capture-photo-btn');
    const analyzePhotoBtn = document.getElementById('analyze-photo-btn');
    const scannerResults = document.getElementById('scanner-results');
    const scanNewItemBtn = document.getElementById('scan-new-item-btn');
    const findNearestBinBtn = document.getElementById('find-nearest-bin-btn');
    
    // Waste types database for AI simulation - Enhanced with image recognition patterns
    const wasteTypes = [
        {
            name: 'Plastic Bottle',
            description: 'PET plastic bottle, commonly used for beverages.',
            binType: 'recyclable',
            confidence: 0.95,
            keywords: ['bottle', 'plastic', 'pet', 'clear', 'container', 'drink', 'water', 'soda'],
            disposalSteps: [
                'Remove cap and label if possible',
                'Rinse the bottle to remove residue',
                'Crush to save space (optional)',
                'Place in recycling bin for plastics'
            ]
        },
        {
            name: 'Aluminum Can',
            description: 'Aluminum beverage can, used for sodas and other drinks.',
            binType: 'recyclable',
            confidence: 0.92,
            keywords: ['can', 'aluminum', 'metal', 'soda', 'beer', 'drink', 'silver', 'tin'],
            disposalSteps: [
                'Rinse the can to remove residue',
                'Crush to save space (optional)',
                'Place in recycling bin for metals'
            ]
        },
        {
            name: 'Glass Bottle',
            description: 'Glass container used for beverages or food products.',
            binType: 'recyclable',
            confidence: 0.90,
            keywords: ['glass', 'bottle', 'transparent', 'jar', 'container', 'wine', 'beer'],
            disposalSteps: [
                'Remove cap or lid',
                'Rinse the bottle to remove residue',
                'Place in recycling bin for glass'
            ]
        },
        {
            name: 'Food Waste',
            description: 'Organic food scraps and leftovers.',
            binType: 'organic',
            confidence: 0.88,
            keywords: ['food', 'organic', 'vegetable', 'fruit', 'peel', 'leftover', 'compost', 'green'],
            disposalSteps: [
                'Remove any non-organic materials',
                'Place in compost or organic waste bin',
                'Avoid including meat or dairy in home composting'
            ]
        },
        {
            name: 'Paper Bag',
            description: 'Brown paper bag used for groceries or packaging.',
            binType: 'recyclable',
            confidence: 0.93,
            keywords: ['paper', 'bag', 'brown', 'cardboard', 'grocery', 'packaging'],
            disposalSteps: [
                'Remove any non-paper items',
                'Flatten the bag to save space',
                'Place in recycling bin for paper'
            ]
        },
        {
            name: 'Plastic Wrap',
            description: 'Thin plastic film used for packaging.',
            binType: 'general',
            confidence: 0.85,
            keywords: ['plastic', 'wrap', 'film', 'cling', 'packaging', 'transparent', 'thin'],
            disposalSteps: [
                'Check if your local recycling accepts plastic film',
                'If not, place in general waste bin',
                'Consider reusing clean plastic wrap'
            ]
        },
        {
            name: 'Battery',
            description: 'Household battery (AA, AAA, etc.).',
            binType: 'hazardous',
            confidence: 0.97,
            keywords: ['battery', 'aa', 'aaa', 'lithium', 'alkaline', 'electronic', 'power'],
            disposalSteps: [
                'Never place in regular trash or recycling',
                'Take to a designated battery recycling point',
                'Some electronics stores offer battery recycling'
            ]
        },
        {
            name: 'Cardboard Box',
            description: 'Corrugated cardboard packaging.',
            binType: 'recyclable',
            confidence: 0.94,
            keywords: ['cardboard', 'box', 'packaging', 'brown', 'corrugated', 'carton', 'amazon'],
            disposalSteps: [
                'Remove any tape, labels, or non-cardboard materials',
                'Break down the box to save space',
                'Place in recycling bin for cardboard'
            ]
        },
        {
            name: 'Styrofoam',
            description: 'Expanded polystyrene foam used for packaging and insulation.',
            binType: 'general',
            confidence: 0.89,
            keywords: ['styrofoam', 'foam', 'polystyrene', 'white', 'packaging', 'cup', 'container'],
            disposalSteps: [
                'Check if your local recycling accepts styrofoam (most don\'t)',
                'If not, place in general waste bin',
                'Consider reusing for packaging or crafts'
            ]
        },
        {
            name: 'Light Bulb',
            description: 'Incandescent, LED, or CFL light bulb.',
            binType: 'hazardous',
            confidence: 0.91,
            keywords: ['light', 'bulb', 'lamp', 'led', 'cfl', 'incandescent', 'glass', 'electric'],
            disposalSteps: [
                'Do not place in regular trash or recycling',
                'CFL bulbs contain mercury and must be recycled properly',
                'Take to a hardware store or recycling center that accepts light bulbs'
            ]
        },
        {
            name: 'Coffee Cup',
            description: 'Disposable coffee cup, typically with plastic lining.',
            binType: 'general',
            confidence: 0.87,
            keywords: ['coffee', 'cup', 'paper', 'disposable', 'drink', 'lid', 'starbucks'],
            disposalSteps: [
                'Remove plastic lid and place in recycling if possible',
                'Most coffee cups have plastic lining and cannot be recycled',
                'Place cup in general waste bin',
                'Consider using a reusable cup in the future'
            ]
        },
        {
            name: 'Plastic Bag',
            description: 'Thin plastic shopping bag.',
            binType: 'general',
            confidence: 0.86,
            keywords: ['plastic', 'bag', 'shopping', 'grocery', 'thin', 'carry'],
            disposalSteps: [
                'Check if your local recycling accepts plastic bags',
                'Many grocery stores have plastic bag recycling bins',
                'If not recyclable, place in general waste bin',
                'Consider using reusable bags in the future'
            ]
        }
    ];
    
    // AI training data - simulates a trained model
    let aiTrainingData = {
        // Stores user feedback to improve future predictions
        userFeedback: [],
        // Tracks accuracy over time
        accuracyHistory: [0.75, 0.78, 0.82, 0.85, 0.88, 0.91],
        // Current model version
        modelVersion: "2.3.1",
        // Last training date
        lastTrained: "2025-05-10"
    };
    
    // Open scanner modal
    if (scannerBtn) {
        scannerBtn.addEventListener('click', openScannerModal);
    }
    
    if (scannerLink) {
        scannerLink.addEventListener('click', function(e) {
            e.preventDefault();
            openScannerModal();
        });
    }
    
    function openScannerModal() {
        if (scannerModal) {
            resetScanner();
            scannerModal.classList.add('show');
        }
    }
    
    // Close scanner modal
    if (scannerModalClose) {
        scannerModalClose.addEventListener('click', closeScannerModal);
    }
    
    function closeScannerModal() {
        if (scannerModal) {
            scannerModal.classList.remove('show');
            stopCamera();
        }
    }
    
    // Take photo button
    if (takePhotoBtn) {
        takePhotoBtn.addEventListener('click', startCamera);
    }
    
    // Upload photo button
    if (uploadWastePhotoBtn && wastePhotoInput) {
        uploadWastePhotoBtn.addEventListener('click', function() {
            wastePhotoInput.click();
        });
        
        wastePhotoInput.addEventListener('change', handleFileUpload);
    }
    
    // Capture photo button
    if (capturePhotoBtn) {
        capturePhotoBtn.addEventListener('click', capturePhoto);
    }
    
    // Analyze photo button
    if (analyzePhotoBtn) {
        analyzePhotoBtn.addEventListener('click', analyzeWaste);
    }
    
    // Scan new item button
    if (scanNewItemBtn) {
        scanNewItemBtn.addEventListener('click', resetScanner);
    }
    
    // Find nearest bin button
    if (findNearestBinBtn) {
        findNearestBinBtn.addEventListener('click', function() {
            closeScannerModal();
            // Scroll to map section
            const mapCard = document.querySelector('.map-card');
            if (mapCard) {
                mapCard.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Start camera
    function startCamera() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert('Your browser does not support camera access. Please try uploading a photo instead.');
            return;
        }
        
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(stream) {
                cameraFeed.srcObject = stream;
                cameraFeed.play();
                
                // Show camera feed and capture button
                cameraPlaceholder.style.display = 'none';
                cameraFeed.style.display = 'block';
                capturePhotoBtn.style.display = 'block';
                analyzePhotoBtn.style.display = 'none';
                previewImageContainer.style.display = 'none';
            })
            .catch(function(error) {
                console.error('Error accessing camera:', error);
                alert('Could not access camera. Please check permissions or try uploading a photo instead.');
            });
    }
    
    // Stop camera
    function stopCamera() {
        if (cameraFeed.srcObject) {
            const tracks = cameraFeed.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            cameraFeed.srcObject = null;
        }
    }
    
    // Handle file upload
    function handleFileUpload() {
        if (wastePhotoInput.files && wastePhotoInput.files[0]) {
            const file = wastePhotoInput.files[0];
            const reader = new FileReader();
            
            reader.onload = function(e) {
                // Show preview image and analyze button
                previewImage.src = e.target.result;
                cameraPlaceholder.style.display = 'none';
                cameraFeed.style.display = 'none';
                capturePhotoBtn.style.display = 'none';
                previewImageContainer.style.display = 'block';
                analyzePhotoBtn.style.display = 'block';
                
                // Stop camera if it's running
                stopCamera();
            };
            
            reader.readAsDataURL(file);
        }
    }
    
    // Capture photo
    function capturePhoto() {
        const context = photoCanvas.getContext('2d');
        
        // Set canvas dimensions to match video
        photoCanvas.width = cameraFeed.videoWidth;
        photoCanvas.height = cameraFeed.videoHeight;
        
        // Draw video frame to canvas
        context.drawImage(cameraFeed, 0, 0, photoCanvas.width, photoCanvas.height);
        
        // Convert canvas to data URL
        const photoDataUrl = photoCanvas.toDataURL('image/png');
        
        // Show preview image and analyze button
        previewImage.src = photoDataUrl;
        cameraFeed.style.display = 'none';
        capturePhotoBtn.style.display = 'none';
        previewImageContainer.style.display = 'block';
        analyzePhotoBtn.style.display = 'block';
        
        // Stop camera
        stopCamera();
    }
    
    // Extract image features (simulated)
    function extractImageFeatures(imageElement) {
        // In a real implementation, this would use computer vision to extract features
        // For simulation, we'll generate random features
        
        // Get image filename if available (for uploaded files)
        let filename = '';
        if (wastePhotoInput.files && wastePhotoInput.files[0]) {
            filename = wastePhotoInput.files[0].name.toLowerCase();
        }
        
        // Extract keywords from filename
        const extractedKeywords = [];
        wasteTypes.forEach(type => {
            type.keywords.forEach(keyword => {
                if (filename.includes(keyword.toLowerCase())) {
                    extractedKeywords.push(keyword);
                }
            });
        });
        
        // If we found keywords in the filename, use them for better matching
        if (extractedKeywords.length > 0) {
            return extractedKeywords;
        }
        
        // Otherwise, simulate random image features
        // This simulates what a real AI would extract from the image
        const simulatedFeatures = [];
        const allKeywords = wasteTypes.flatMap(type => type.keywords);
        
        // Generate 3-5 random features
        const featureCount = Math.floor(Math.random() * 3) + 3;
        for (let i = 0; i < featureCount; i++) {
            const randomIndex = Math.floor(Math.random() * allKeywords.length);
            simulatedFeatures.push(allKeywords[randomIndex]);
        }
        
        return simulatedFeatures;
    }
    
    // Match features to waste types
    function matchWasteType(features) {
        // Calculate match score for each waste type
        const matches = wasteTypes.map(type => {
            let score = 0;
            let matchedKeywords = [];
            
            // Count matching keywords
            features.forEach(feature => {
                if (type.keywords.includes(feature)) {
                    score += 1;
                    matchedKeywords.push(feature);
                }
            });
            
            // Calculate percentage match
            const matchPercentage = features.length > 0 ? (score / features.length) : 0;
            
            // Apply confidence factor
            const adjustedScore = matchPercentage * type.confidence;
            
            return {
                type: type,
                score: adjustedScore,
                matchedKeywords: matchedKeywords
            };
        });
        
        // Sort by score (highest first)
        matches.sort((a, b) => b.score - a.score);
        
        // Return top 3 matches
        return matches.slice(0, 3);
    }
    
    // Analyze waste (improved AI simulation)
    function analyzeWaste() {
        // Show loading state
        analyzePhotoBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Analyzing...';
        analyzePhotoBtn.disabled = true;
        
        // Extract features from image
        const features = extractImageFeatures(previewImage);
        
        // Simulate AI processing time (longer for more realistic effect)
        setTimeout(function() {
            // Match features to waste types
            const matches = matchWasteType(features);
            
            // Get top match
            const topMatch = matches[0];
            const wasteItem = topMatch.type;
            
            // Calculate confidence percentage (for display)
            const confidencePercent = Math.round(topMatch.score * 100);
            
            // Update results
            document.getElementById('waste-type').textContent = wasteItem.name;
            document.getElementById('waste-description').textContent = wasteItem.description;
            
            // Add confidence indicator
            const confidenceIndicator = document.createElement('div');
            confidenceIndicator.className = 'confidence-indicator';
            
            let confidenceClass = 'low';
            if (confidencePercent >= 85) {
                confidenceClass = 'high';
            } else if (confidencePercent >= 70) {
                confidenceClass = 'medium';
            }
            
            confidenceIndicator.innerHTML = `
                <div class="confidence-label">AI Confidence:</div>
                <div class="confidence-bar">
                    <div class="confidence-progress ${confidenceClass}" style="width: ${confidencePercent}%"></div>
                </div>
                <div class="confidence-percentage">${confidencePercent}%</div>
            `;
            
            // Add alternative suggestions if confidence is not very high
            let alternativesHtml = '';
            if (confidencePercent < 85 && matches.length > 1) {
                alternativesHtml = `
                    <div class="alternative-suggestions">
                        <h6>Alternative possibilities:</h6>
                        <ul>
                            ${matches.slice(1, 3).map(match => {
                                const altConfidence = Math.round(match.score * 100);
                                return `<li>${match.type.name} (${altConfidence}% confidence)</li>`;
                            }).join('')}
                        </ul>
                    </div>
                `;
            }
            
            // Update disposal steps
            const disposalStepsList = document.getElementById('disposal-steps');
            disposalStepsList.innerHTML = '';
            wasteItem.disposalSteps.forEach(step => {
                const li = document.createElement('li');
                li.textContent = step;
                disposalStepsList.appendChild(li);
            });
            
            // Update bin recommendation
            const binRecommendation = document.querySelector('.bin-recommendation .bin-type');
            binRecommendation.className = `bin-type ${wasteItem.binType}`;
            
            // Set icon based on bin type
            let binIcon = '<i class="fas fa-recycle"></i>';
            let binText = 'Recyclable Waste';
            
            switch (wasteItem.binType) {
                case 'general':
                    binIcon = '<i class="fas fa-trash"></i>';
                    binText = 'General Waste';
                    break;
                case 'organic':
                    binIcon = '<i class="fas fa-apple-alt"></i>';
                    binText = 'Organic Waste';
                    break;
                case 'hazardous':
                    binIcon = '<i class="fas fa-skull-crossbones"></i>';
                    binText = 'Hazardous Waste';
                    break;
            }
            
            binRecommendation.innerHTML = `${binIcon} ${binText}`;
            
            // Add confidence indicator and alternatives to results
            const resultDetails = document.querySelector('.result-details');
            const confidenceContainer = document.createElement('div');
            confidenceContainer.className = 'confidence-container';
            confidenceContainer.appendChild(confidenceIndicator);
            
            if (alternativesHtml) {
                confidenceContainer.innerHTML += alternativesHtml;
            }
            
            // Add feedback buttons
            const feedbackHtml = `
                <div class="feedback-container">
                    <h6>Was this identification correct?</h6>
                    <div class="feedback-buttons">
                        <button class="btn btn-sm btn-success feedback-btn" data-feedback="correct">
                            <i class="fas fa-check"></i> Yes
                        </button>
                        <button class="btn btn-sm btn-danger feedback-btn" data-feedback="incorrect">
                            <i class="fas fa-times"></i> No
                        </button>
                    </div>
                </div>
            `;
            
            confidenceContainer.innerHTML += feedbackHtml;
            
            // Insert after description
            const wasteDescription = document.getElementById('waste-description');
            wasteDescription.insertAdjacentElement('afterend', confidenceContainer);
            
            // Add feedback event listeners
            document.querySelectorAll('.feedback-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const feedback = this.dataset.feedback;
                    
                    // Store feedback for "AI learning"
                    aiTrainingData.userFeedback.push({
                        wasteType: wasteItem.name,
                        confidence: confidencePercent,
                        feedback: feedback,
                        timestamp: new Date().toISOString()
                    });
                    
                    // Update accuracy history
                    if (feedback === 'correct') {
                        const currentAccuracy = aiTrainingData.accuracyHistory[aiTrainingData.accuracyHistory.length - 1];
                        const newAccuracy = Math.min(0.98, currentAccuracy + 0.01);
                        aiTrainingData.accuracyHistory.push(newAccuracy);
                    } else {
                        const currentAccuracy = aiTrainingData.accuracyHistory[aiTrainingData.accuracyHistory.length - 1];
                        const newAccuracy = Math.max(0.75, currentAccuracy - 0.01);
                        aiTrainingData.accuracyHistory.push(newAccuracy);
                    }
                    
                    // Show thank you message
                    const feedbackContainer = document.querySelector('.feedback-container');
                    feedbackContainer.innerHTML = `
                        <div class="feedback-thanks">
                            <i class="fas fa-check-circle"></i>
                            <p>Thank you for your feedback! This helps improve our AI.</p>
                        </div>
                    `;
                });
            });
            
            // Show results
            scannerResults.style.display = 'block';
            
            // Reset analyze button
            analyzePhotoBtn.innerHTML = '<i class="fas fa-search"></i> Analyze Waste';
            analyzePhotoBtn.disabled = false;
            analyzePhotoBtn.style.display = 'none';
            
            // Update eco points in the sidebar (simulation)
            const ecoPointsBadge = document.querySelector('.sidebar-menu .badge.green');
            if (ecoPointsBadge) {
                const currentPoints = parseInt(ecoPointsBadge.textContent);
                ecoPointsBadge.textContent = currentPoints + 10;
            }
        }, 3000); // Longer processing time for more realistic AI simulation
    }
    
    // Reset scanner
    function resetScanner() {
        // Reset UI
        cameraPlaceholder.style.display = 'block';
        cameraFeed.style.display = 'none';
        photoCanvas.style.display = 'none';
        previewImageContainer.style.display = 'none';
        capturePhotoBtn.style.display = 'none';
        analyzePhotoBtn.style.display = 'none';
        scannerResults.style.display = 'none';
        
        // Reset file input
        if (wastePhotoInput) {
            wastePhotoInput.value = '';
        }
        
        // Stop camera if it's running
        stopCamera();
    }
});