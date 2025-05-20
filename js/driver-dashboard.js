// Driver Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Simulate loading state
    setTimeout(() => {
        document.getElementById('map-loading').style.display = 'none';
        initDriverMap();
        populateRouteStops();
    }, 1000);
    
    // Initialize Driver Map
    function initDriverMap() {
        const mapContainer = document.getElementById('driver-map');
        
        if (!mapContainer) return;
        
        const canvas = document.createElement('canvas');
        canvas.width = mapContainer.clientWidth;
        canvas.height = mapContainer.clientHeight;
        mapContainer.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        
        // Draw map background
        ctx.fillStyle = '#f0f4f8';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw roads
        ctx.strokeStyle = '#d1d5db';
        ctx.lineWidth = 3;
        
        // Horizontal roads
        for (let y = 50; y < canvas.height; y += 100) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        
        // Vertical roads
        for (let x = 50; x < canvas.width; x += 100) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        
        // Draw driver location
        const driverX = canvas.width / 3;
        const driverY = canvas.height / 2;
        
        // Driver location dot
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(driverX, driverY, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Driver location pulse
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(driverX, driverY, 15, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw route path
        const routePoints = [
            { x: 50, y: 50 },
            { x: 150, y: 50 },
            { x: 150, y: 150 },
            { x: 250, y: 150 },
            { x: 250, y: 250 },
            { x: 350, y: 250 },
            { x: 350, y: 350 },
            { x: 450, y: 350 },
            { x: 450, y: 250 },
            { x: 550, y: 250 },
            { x: 550, y: 150 },
            { x: 650, y: 150 }
        ];
        
        // Draw route line
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(routePoints[0].x, routePoints[0].y);
        for (let i = 1; i < routePoints.length; i++) {
            ctx.lineTo(routePoints[i].x, routePoints[i].y);
        }
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw bins along the route
        const bins = routePoints.map((point, index) => ({
            id: 1000 + index,
            x: point.x,
            y: point.y,
            status: index < 4 ? 'collected' : index === 4 ? 'current' : 'pending'
        }));
        
        // Draw bins
        bins.forEach(bin => {
            let color;
            switch (bin.status) {
                case 'collected':
                    color = '#10b981'; // green
                    break;
                case 'current':
                    color = '#f59e0b'; // amber
                    break;
                case 'pending':
                    color = '#ef4444'; // red
                    break;
                default:
                    color = '#10b981';
            }
            
            // Draw bin
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(bin.x, bin.y, 8, 0, Math.PI * 2);
            ctx.fill();
            
            // Add bin ID
            ctx.fillStyle = '#fff';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${bin.id}`, bin.x, bin.y);
        });
        
        // Add click handler for bins
        canvas.addEventListener('click', function(event) {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            bins.forEach(bin => {
                const distance = Math.sqrt(Math.pow(bin.x - x, 2) + Math.pow(bin.y - y, 2));
                if (distance <= 10) {
                    openCollectionModal(bin.id);
                }
            });
        });
        
        // Add animation for driver location
        let frame = 0;
        const animate = () => {
            frame++;
            
            // Clear previous pulse
            ctx.clearRect(driverX - 20, driverY - 20, 40, 40);
            
            // Redraw driver location
            ctx.fillStyle = '#3b82f6';
            ctx.beginPath();
            ctx.arc(driverX, driverY, 8, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw pulsing circle
            const pulseSize = 12 + Math.sin(frame * 0.1) * 5;
            ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(driverX, driverY, pulseSize, 0, Math.PI * 2);
            ctx.stroke();
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    // Populate Route Stops
    function populateRouteStops() {
        const routeStopsList = document.getElementById('route-stops-list');
        
        if (!routeStopsList) return;
        
        const stops = [
            {
                id: 1001,
                location: 'Main St & 1st Ave',
                status: 'completed'
            },
            {
                id: 1002,
                location: 'Park Ave & 2nd St',
                status: 'completed'
            },
            {
                id: 1003,
                location: 'Broadway & 3rd St',
                status: 'completed'
            },
            {
                id: 1004,
                location: 'Oak St & 4th Ave',
                status: 'completed'
            },
            {
                id: 1005,
                location: 'Elm St & 5th Ave',
                status: 'current'
            },
            {
                id: 1006,
                location: 'Pine St & 6th Ave',
                status: 'pending'
            },
            {
                id: 1007,
                location: 'Cedar St & 7th Ave',
                status: 'pending'
            },
            {
                id: 1008,
                location: 'Maple St & 8th Ave',
                status: 'pending'
            },
            {
                id: 1009,
                location: 'Walnut St & 9th Ave',
                status: 'pending'
            },
            {
                id: 1010,
                location: 'Cherry St & 10th Ave',
                status: 'pending'
            },
            {
                id: 1011,
                location: 'Spruce St & 11th Ave',
                status: 'pending'
            },
            {
                id: 1012,
                location: 'Birch St & 12th Ave',
                status: 'pending'
            }
        ];
        
        let html = '';
        
        stops.forEach(stop => {
            let statusIcon = '';
            let statusText = '';
            
            switch (stop.status) {
                case 'completed':
                    statusIcon = '<i class="fas fa-check"></i>';
                    statusText = 'Completed';
                    break;
                case 'current':
                    statusIcon = '<i class="fas fa-location-arrow"></i>';
                    statusText = 'Current Stop';
                    break;
                case 'pending':
                    statusIcon = '<i class="fas fa-clock"></i>';
                    statusText = 'Pending';
                    break;
                default:
                    statusIcon = '<i class="fas fa-clock"></i>';
                    statusText = 'Pending';
            }
            
            html += `
                <div class="route-stop ${stop.status}" data-bin-id="${stop.id}" onclick="openCollectionModal(${stop.id})">
                    <div class="stop-icon ${stop.status}">${statusIcon}</div>
                    <div class="stop-details">
                        <div class="stop-id">Bin #${stop.id}</div>
                        <div class="stop-location">${stop.location}</div>
                        <div class="stop-status ${stop.status}">${statusText}</div>
                    </div>
                </div>
            `;
        });
        
        routeStopsList.innerHTML = html;
        
        // Add click event listeners
        const routeStops = document.querySelectorAll('.route-stop');
        routeStops.forEach(stop => {
            stop.addEventListener('click', function() {
                const binId = this.dataset.binId;
                openCollectionModal(binId);
            });
        });
    }
    
    // Collection Modal
    const collectionModal = document.getElementById('collection-modal');
    const modalClose = document.getElementById('modal-close');
    const cancelCollectionBtn = document.getElementById('cancel-collection-btn');
    const collectionForm = document.getElementById('collection-form');
    
    // Open collection modal
    window.openCollectionModal = function(binId) {
        if (!collectionModal) return;
        
        // Set bin info
        document.getElementById('bin-id').textContent = binId;
        
        // Get location based on bin ID
        const locations = {
            1001: 'Main St & 1st Ave',
            1002: 'Park Ave & 2nd St',
            1003: 'Broadway & 3rd St',
            1004: 'Oak St & 4th Ave',
            1005: 'Elm St & 5th Ave',
            1006: 'Pine St & 6th Ave',
            1007: 'Cedar St & 7th Ave',
            1008: 'Maple St & 8th Ave',
            1009: 'Walnut St & 9th Ave',
            1010: 'Cherry St & 10th Ave',
            1011: 'Spruce St & 11th Ave',
            1012: 'Birch St & 12th Ave'
        };
        
        document.getElementById('bin-location').textContent = locations[binId] || 'Unknown Location';
        
        // Show modal
        collectionModal.classList.add('show');
    };
    
    // Close modal
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            collectionModal.classList.remove('show');
        });
    }
    
    if (cancelCollectionBtn) {
        cancelCollectionBtn.addEventListener('click', function() {
            collectionModal.classList.remove('show');
        });
    }
    
    // Form submission
    if (collectionForm) {
        collectionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const completeBtn = document.getElementById('complete-collection-btn');
            completeBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Processing...';
            completeBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                collectionModal.classList.remove('show');
                
                // Reset form
                collectionForm.reset();
                
                // Reset button
                completeBtn.innerHTML = 'Complete Collection';
                completeBtn.disabled = false;
                
                // Update progress
                updateProgress();
                
                // Show success message
                alert('Collection completed successfully!');
            }, 1500);
        });
    }
    
    // Update progress after collection
    function updateProgress() {
        const progressValue = document.getElementById('progress-value');
        const progressBar = document.getElementById('route-progress-bar');
        const stopsValue = document.getElementById('stops-value');
        const binsCollected = document.getElementById('bins-collected');
        
        if (progressValue && progressBar && stopsValue && binsCollected) {
            // Get current values
            let currentProgress = parseInt(progressValue.textContent);
            let [currentStop, totalStops] = stopsValue.textContent.split('/').map(s => parseInt(s));
            let currentBinsCollected = parseInt(binsCollected.textContent);
            
            // Update values
            currentProgress += 8;
            currentStop += 1;
            currentBinsCollected += 1;
            
            // Update UI
            progressValue.textContent = `${currentProgress}%`;
            progressBar.style.width = `${currentProgress}%`;
            stopsValue.textContent = `${currentStop}/${totalStops}`;
            binsCollected.textContent = currentBinsCollected;
            
            // Update route stops list
            const routeStops = document.querySelectorAll('.route-stop');
            if (routeStops.length > 0 && currentStop <= routeStops.length) {
                // Mark current stop as completed
                const currentStopElement = document.querySelector('.route-stop.current');
                if (currentStopElement) {
                    currentStopElement.classList.remove('current');
                    currentStopElement.classList.add('completed');
                    
                    const statusIcon = currentStopElement.querySelector('.stop-icon');
                    const statusText = currentStopElement.querySelector('.stop-status');
                    
                    if (statusIcon) {
                        statusIcon.innerHTML = '<i class="fas fa-check"></i>';
                        statusIcon.classList.remove('current');
                        statusIcon.classList.add('completed');
                    }
                    
                    if (statusText) {
                        statusText.textContent = 'Completed';
                        statusText.classList.remove('current');
                        statusText.classList.add('completed');
                    }
                }
                
                // Set next stop as current
                if (currentStop <= routeStops.length) {
                    const nextStopElement = routeStops[currentStop - 1];
                    if (nextStopElement) {
                        nextStopElement.classList.remove('pending');
                        nextStopElement.classList.add('current');
                        
                        const statusIcon = nextStopElement.querySelector('.stop-icon');
                        const statusText = nextStopElement.querySelector('.stop-status');
                        
                        if (statusIcon) {
                            statusIcon.innerHTML = '<i class="fas fa-location-arrow"></i>';
                            statusIcon.classList.remove('pending');
                            statusIcon.classList.add('current');
                        }
                        
                        if (statusText) {
                            statusText.textContent = 'Current Stop';
                            statusText.classList.remove('pending');
                            statusText.classList.add('current');
                        }
                    }
                }
            }
        }
    }
});