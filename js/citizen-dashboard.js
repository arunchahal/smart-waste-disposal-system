// Citizen Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Simulate loading state
    setTimeout(() => {
        document.getElementById('map-loading').style.display = 'none';
        initCitizenMap();
        populateNearbyBinsTable();
        populateScheduleTable();
    }, 1000);
    
    // Initialize Citizen Map
    function initCitizenMap() {
        const mapContainer = document.getElementById('citizen-map');
        
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
        
        // Draw user location
        const userX = canvas.width / 2;
        const userY = canvas.height / 2;
        
        // User location dot
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(userX, userY, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // User location pulse
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(userX, userY, 15, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw bins with different statuses
        const bins = [
            // Available bins (green)
            ...Array.from({ length: 8 }, () => ({
                x: userX + (Math.random() - 0.5) * canvas.width * 0.8,
                y: userY + (Math.random() - 0.5) * canvas.height * 0.8,
                status: 'available',
                distance: Math.floor(Math.random() * 500) + 100
            })),
            // Filling up bins (yellow)
            ...Array.from({ length: 5 }, () => ({
                x: userX + (Math.random() - 0.5) * canvas.width * 0.8,
                y: userY + (Math.random() - 0.5) * canvas.height * 0.8,
                status: 'filling',
                distance: Math.floor(Math.random() * 500) + 100
            })),
            // Full bins (red)
            ...Array.from({ length: 3 }, () => ({
                x: userX + (Math.random() - 0.5) * canvas.width * 0.8,
                y: userY + (Math.random() - 0.5) * canvas.height * 0.8,
                status: 'full',
                distance: Math.floor(Math.random() * 500) + 100
            }))
        ];
        
        // Draw bins
        bins.forEach(bin => {
            let color;
            switch (bin.status) {
                case 'available':
                    color = '#10b981'; // green
                    break;
                case 'filling':
                    color = '#f59e0b'; // yellow
                    break;
                case 'full':
                    color = '#ef4444'; // red
                    break;
                default:
                    color = '#10b981';
            }
            
            // Draw bin
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(bin.x, bin.y, 6, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw distance label
            ctx.fillStyle = '#1f2937';
            ctx.font = '10px Arial';
            ctx.fillText(`${bin.distance}m`, bin.x + 10, bin.y + 5);
        });
        
        // Add animation for user location
        let frame = 0;
        const animate = () => {
            frame++;
            
            // Clear previous pulse
            ctx.clearRect(userX - 20, userY - 20, 40, 40);
            
            // Redraw user location
            ctx.fillStyle = '#3b82f6';
            ctx.beginPath();
            ctx.arc(userX, userY, 8, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw pulsing circle
            const pulseSize = 12 + Math.sin(frame * 0.1) * 5;
            ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(userX, userY, pulseSize, 0, Math.PI * 2);
            ctx.stroke();
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    // Populate Nearby Bins Table
    function populateNearbyBinsTable() {
        const tableBody = document.getElementById('nearby-bins-table');
        
        if (!tableBody) return;
        
        const bins = [
            {
                id: 'BIN-1042',
                location: 'Main St & 5th Ave',
                distance: '120m',
                status: 'Available',
                type: 'General',
                fillLevel: 25
            },
            {
                id: 'BIN-1043',
                location: 'Park Ave & 3rd St',
                distance: '180m',
                status: 'Filling Up',
                type: 'Recyclable',
                fillLevel: 52
            },
            {
                id: 'BIN-1044',
                location: 'Broadway & 7th St',
                distance: '210m',
                status: 'Available',
                type: 'General',
                fillLevel: 12
            },
            {
                id: 'BIN-1045',
                location: 'Oak St & 9th Ave',
                distance: '350m',
                status: 'Full',
                type: 'Hazardous',
                fillLevel: 90
            },
            {
                id: 'BIN-1046',
                location: 'Elm St & 2nd Ave',
                distance: '420m',
                status: 'Available',
                type: 'Recyclable',
                fillLevel: 30
            }
        ];
        
        let html = '';
        
        bins.forEach(bin => {
            // Status badge class
            let statusClass = '';
            switch (bin.status) {
                case 'Available':
                    statusClass = 'green';
                    break;
                case 'Filling Up':
                    statusClass = 'yellow';
                    break;
                case 'Full':
                    statusClass = 'red';
                    break;
                default:
                    statusClass = '';
            }
            
            // Type badge class
            let typeClass = '';
            switch (bin.type) {
                case 'General':
                    typeClass = 'blue';
                    break;
                case 'Recyclable':
                    typeClass = 'green';
                    break;
                case 'Hazardous':
                    typeClass = 'red';
                    break;
                default:
                    typeClass = '';
            }
            
            // Fill level bar color
            let fillLevelClass = '';
            if (bin.fillLevel > 80) {
                fillLevelClass = 'red';
            } else if (bin.fillLevel > 40) {
                fillLevelClass = 'yellow';
            } else {
                fillLevelClass = 'green';
            }
            
            html += `
                <tr>
                    <td class="font-weight-bold">${bin.id}</td>
                    <td>${bin.location}</td>
                    <td>${bin.distance}</td>
                    <td><span class="status-badge ${typeClass}">${bin.type}</span></td>
                    <td><span class="status-badge ${statusClass}">${bin.status}</span></td>
                    <td>
                        <div class="fill-level-bar">
                            <div class="fill-level-progress ${fillLevelClass}" style="width: ${bin.fillLevel}%"></div>
                        </div>
                        <span class="fill-level-text">${bin.fillLevel}%</span>
                    </td>
                    <td>
                        <button class="btn btn-outline btn-sm">
                            <i class="fas fa-map-marker-alt"></i> Directions
                        </button>
                    </td>
                </tr>
            `;
        });
        
        tableBody.innerHTML = html;
    }
    
    // Populate Schedule Table
    function populateScheduleTable() {
        const tableBody = document.getElementById('schedule-table');
        
        if (!tableBody) return;
        
        const schedules = [
            {
                id: 1,
                date: 'Tomorrow',
                time: '9:00 AM - 11:00 AM',
                area: 'Downtown - Zone A',
                type: 'General & Recyclable'
            },
            {
                id: 2,
                date: 'May 16, 2025',
                time: '1:00 PM - 3:00 PM',
                area: 'Downtown - Zone A',
                type: 'Hazardous'
            },
            {
                id: 3,
                date: 'May 18, 2025',
                time: '9:00 AM - 11:00 AM',
                area: 'Downtown - Zone A',
                type: 'General & Recyclable'
            },
            {
                id: 4,
                date: 'May 21, 2025',
                time: '9:00 AM - 11:00 AM',
                area: 'Downtown - Zone A',
                type: 'General & Recyclable'
            },
            {
                id: 5,
                date: 'May 23, 2025',
                time: '1:00 PM - 3:00 PM',
                area: 'Downtown - Zone A',
                type: 'Hazardous'
            }
        ];
        
        let html = '';
        
        schedules.forEach(schedule => {
            // Type badge class
            let typeClass = '';
            if (schedule.type.includes('Hazardous')) {
                typeClass = 'red';
            } else if (schedule.type.includes('General') && schedule.type.includes('Recyclable')) {
                typeClass = 'blue';
            } else if (schedule.type.includes('Recyclable')) {
                typeClass = 'green';
            } else {
                typeClass = 'blue';
            }
            
            html += `
                <tr class="${schedule.date === 'Tomorrow' ? 'highlight-row' : ''}">
                    <td>
                        <div class="font-weight-bold">
                            ${schedule.date === 'Tomorrow' ? '<span class="status-badge green">Tomorrow</span> ' : ''}
                            ${schedule.date}
                        </div>
                    </td>
                    <td>${schedule.time}</td>
                    <td>${schedule.area}</td>
                    <td><span class="status-badge ${typeClass}">${schedule.type}</span></td>
                    <td>
                        <button class="btn btn-outline btn-sm">
                            <i class="fas fa-bell"></i> Remind Me
                        </button>
                    </td>
                </tr>
            `;
        });
        
        tableBody.innerHTML = html;
    }
    
    // Report Issue Modal
    const reportModal = document.getElementById('report-modal');
    const reportBtn = document.getElementById('report-btn');
    const reportIssueLink = document.getElementById('report-issue-link');
    const modalClose = document.getElementById('modal-close');
    const cancelReportBtn = document.getElementById('cancel-report-btn');
    const reportForm = document.getElementById('report-form');
    const useLocationBtn = document.getElementById('use-location-btn');
    const uploadPhotoBtn = document.getElementById('upload-photo-btn');
    const photoInput = document.getElementById('photo-input');
    const fileUploadArea = document.getElementById('file-upload-area');
    const uploadedFile = document.getElementById('uploaded-file');
    const removeFileBtn = document.getElementById('remove-file-btn');
    
    // Open modal
    if (reportBtn) {
        reportBtn.addEventListener('click', function() {
            reportModal.classList.add('show');
        });
    }
    
    if (reportIssueLink) {
        reportIssueLink.addEventListener('click', function(e) {
            e.preventDefault();
            reportModal.classList.add('show');
        });
    }
    
    // Close modal
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            reportModal.classList.remove('show');
        });
    }
    
    if (cancelReportBtn) {
        cancelReportBtn.addEventListener('click', function() {
            reportModal.classList.remove('show');
        });
    }
    
    // Use current location
    if (useLocationBtn) {
        useLocationBtn.addEventListener('click', function() {
            document.getElementById('location').value = 'Current Location: Main St & 5th Ave';
        });
    }
    
    // Upload photo
    if (uploadPhotoBtn && photoInput) {
        uploadPhotoBtn.addEventListener('click', function() {
            photoInput.click();
        });
        
        photoInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                fileUploadArea.style.display = 'none';
                uploadedFile.style.display = 'flex';
            }
        });
    }
    
    // Remove uploaded file
    if (removeFileBtn) {
        removeFileBtn.addEventListener('click', function() {
            photoInput.value = '';
            fileUploadArea.style.display = 'flex';
            uploadedFile.style.display = 'none';
        });
    }
    
    // File upload area drag and drop
    if (fileUploadArea) {
        fileUploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });
        
        fileUploadArea.addEventListener('dragleave', function() {
            this.classList.remove('dragover');
        });
        
        fileUploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                photoInput.files = e.dataTransfer.files;
                fileUploadArea.style.display = 'none';
                uploadedFile.style.display = 'flex';
            }
        });
        
        fileUploadArea.addEventListener('click', function() {
            photoInput.click();
        });
    }
    
    // Form submission
    if (reportForm) {
        reportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submit-report-btn');
            submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Submitting...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                reportModal.classList.remove('show');
                
                // Reset form
                reportForm.reset();
                fileUploadArea.style.display = 'flex';
                uploadedFile.style.display = 'none';
                
                // Reset button
                submitBtn.innerHTML = 'Submit Report';
                submitBtn.disabled = false;
                
                // Show success message
                alert('Report submitted successfully!');
            }, 1500);
        });
    }
});