// Admin Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard
    initAdminMap();
    initCollectionChart();
    populateDriversTable();
    
    // Simulate loading state
    setTimeout(() => {
        document.getElementById('map-loading').style.display = 'none';
    }, 1000);
    
    // Initialize Admin Map
    function initAdminMap() {
        const mapContainer = document.getElementById('admin-map');
        
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
        
        // Draw bins
        const bins = [
            { id: 'BIN-1042', x: 100, y: 100, status: 'full' },
            { id: 'BIN-1043', x: 200, y: 100, status: 'half-full' },
            { id: 'BIN-1044', x: 300, y: 100, status: 'empty' },
            { id: 'BIN-1045', x: 400, y: 100, status: 'full' },
            { id: 'BIN-1046', x: 500, y: 100, status: 'damaged' },
            { id: 'BIN-1047', x: 100, y: 200, status: 'half-full' },
            { id: 'BIN-1048', x: 200, y: 200, status: 'empty' },
            { id: 'BIN-1049', x: 300, y: 200, status: 'half-full' },
            { id: 'BIN-1050', x: 400, y: 200, status: 'full' },
            { id: 'BIN-1051', x: 500, y: 200, status: 'empty' },
            { id: 'BIN-1052', x: 100, y: 300, status: 'full' },
            { id: 'BIN-1053', x: 200, y: 300, status: 'half-full' },
            { id: 'BIN-1054', x: 300, y: 300, status: 'empty' },
            { id: 'BIN-1055', x: 400, y: 300, status: 'damaged' },
            { id: 'BIN-1056', x: 500, y: 300, status: 'half-full' },
            { id: 'BIN-1057', x: 100, y: 400, status: 'full' },
            { id: 'BIN-1058', x: 200, y: 400, status: 'empty' },
            { id: 'BIN-1059', x: 300, y: 400, status: 'half-full' },
            { id: 'BIN-1060', x: 400, y: 400, status: 'full' },
            { id: 'BIN-1061', x: 500, y: 400, status: 'empty' }
        ];
        
        // Draw bins
        bins.forEach(bin => {
            let color;
            switch (bin.status) {
                case 'empty':
                    color = '#10b981'; // green
                    break;
                case 'half-full':
                    color = '#f59e0b'; // amber
                    break;
                case 'full':
                    color = '#ef4444'; // red
                    break;
                case 'damaged':
                    color = '#6b7280'; // gray
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
            ctx.fillText(`${bin.id.split('-')[1]}`, bin.x, bin.y);
        });
        
        // Add click handler for bins
        canvas.addEventListener('click', function(event) {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            bins.forEach(bin => {
                const distance = Math.sqrt(Math.pow(bin.x - x, 2) + Math.pow(bin.y - y, 2));
                if (distance <= 10) {
                    // Open bin details modal
                    const binManagement = window.binManagement;
                    if (binManagement && typeof binManagement.openBinDetails === 'function') {
                        binManagement.openBinDetails(bin.id);
                    } else {
                        alert(`Bin ${bin.id} clicked. Status: ${bin.status}`);
                    }
                }
            });
        });
        
        // Draw drivers
        const drivers = [
            { id: 'D001', x: 150, y: 150 },
            { id: 'D002', x: 350, y: 250 },
            { id: 'D003', x: 250, y: 350 }
        ];
        
        drivers.forEach(driver => {
            // Driver location dot
            ctx.fillStyle = '#3b82f6';
            ctx.beginPath();
            ctx.arc(driver.x, driver.y, 8, 0, Math.PI * 2);
            ctx.fill();
            
            // Driver location pulse
            ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(driver.x, driver.y, 15, 0, Math.PI * 2);
            ctx.stroke();
            
            // Add driver ID
            ctx.fillStyle = '#fff';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${driver.id}`, driver.x, driver.y);
        });
        
        // Add animation for driver locations
        let frame = 0;
        const animate = () => {
            frame++;
            
            drivers.forEach(driver => {
                // Clear previous pulse
                ctx.clearRect(driver.x - 20, driver.y - 20, 40, 40);
                
                // Redraw driver location
                ctx.fillStyle = '#3b82f6';
                ctx.beginPath();
                ctx.arc(driver.x, driver.y, 8, 0, Math.PI * 2);
                ctx.fill();
                
                // Draw pulsing circle
                const pulseSize = 12 + Math.sin(frame * 0.1) * 5;
                ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(driver.x, driver.y, pulseSize, 0, Math.PI * 2);
                ctx.stroke();
                
                // Add driver ID
                ctx.fillStyle = '#fff';
                ctx.font = '10px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(`${driver.id}`, driver.x, driver.y);
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    // Initialize Collection Chart
    function initCollectionChart() {
        const chartCanvas = document.getElementById('collection-chart');
        
        if (!chartCanvas) return;
        
        const ctx = chartCanvas.getContext('2d');
        
        // Sample data
        const data = {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
                {
                    label: 'General Waste',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    backgroundColor: 'rgba(59, 130, 246, 0.5)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Recyclable',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    backgroundColor: 'rgba(16, 185, 129, 0.5)',
                    borderColor: 'rgba(16, 185, 129, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Hazardous',
                    data: [10, 15, 8, 12, 7, 11, 9],
                    backgroundColor: 'rgba(239, 68, 68, 0.5)',
                    borderColor: 'rgba(239, 68, 68, 1)',
                    borderWidth: 1
                }
            ]
        };
        
        // Chart options
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Waste Collected (kg)'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            }
        };
        
        // Create chart
        new Chart(ctx, {
            type: 'bar',
            data: data,
            options: options
        });
    }
    
    // Populate Drivers Table
    function populateDriversTable() {
        const driversTableBody = document.getElementById('drivers-table-body');
        
        if (!driversTableBody) return;
        
        const drivers = [
            {
                name: 'John Smith',
                id: 'D001',
                status: 'Active',
                route: 'Route #7',
                progress: 65,
                vehicle: 'Truck #12',
                contact: '555-1234'
            },
            {
                name: 'Sarah Johnson',
                id: 'D002',
                status: 'Active',
                route: 'Route #3',
                progress: 42,
                vehicle: 'Truck #8',
                contact: '555-2345'
            },
            {
                name: 'Michael Brown',
                id: 'D003',
                status: 'Active',
                route: 'Route #5',
                progress: 78,
                vehicle: 'Truck #15',
                contact: '555-3456'
            },
            {
                name: 'Emily Davis',
                id: 'D004',
                status: 'Break',
                route: 'Route #2',
                progress: 50,
                vehicle: 'Truck #6',
                contact: '555-4567'
            },
            {
                name: 'Robert Wilson',
                id: 'D005',
                status: 'Inactive',
                route: 'N/A',
                progress: 0,
                vehicle: 'N/A',
                contact: '555-5678'
            }
        ];
        
        let html = '';
        
        drivers.forEach(driver => {
            let statusClass = '';
            switch (driver.status) {
                case 'Active':
                    statusClass = 'green';
                    break;
                case 'Break':
                    statusClass = 'yellow';
                    break;
                case 'Inactive':
                    statusClass = 'gray';
                    break;
                default:
                    statusClass = 'green';
            }
            
            html += `
                <tr>
                    <td>
                        <div class="driver-row">
                            <div class="driver-avatar">${driver.name.charAt(0)}</div>
                            <div class="driver-info">
                                <div class="driver-name">${driver.name}</div>
                                <div class="driver-id">${driver.id}</div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <span class="status-badge ${statusClass}">${driver.status}</span>
                    </td>
                    <td>${driver.route}</td>
                    <td>
                        <div class="progress-container">
                            <div class="progress-bar" style="width: ${driver.progress}%"></div>
                            <span class="progress-text">${driver.progress}%</span>
                        </div>
                    </td>
                    <td>${driver.vehicle}</td>
                    <td>${driver.contact}</td>
                    <td>
                        <div class="table-actions">
                            <button class="btn btn-icon btn-sm btn-outline" title="View Details">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-icon btn-sm btn-outline" title="Contact Driver">
                                <i class="fas fa-phone"></i>
                            </button>
                            <button class="btn btn-icon btn-sm btn-outline" title="Assign Route">
                                <i class="fas fa-route"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
        
        driversTableBody.innerHTML = html;
    }
    
    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all tabs
            tabBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Get tab ID
            const tabId = this.dataset.tab;
            
            // Hide all tab panes
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('active');
            });
            
            // Show selected tab pane
            document.getElementById(tabId).classList.add('active');
        });
    });
});