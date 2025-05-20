// Bin Management JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const addBinBtn = document.getElementById('add-bin-btn');
    const binManagementLink = document.getElementById('bin-management-link');
    const addBinModal = document.getElementById('add-bin-modal');
    const addBinModalClose = document.getElementById('add-bin-modal-close');
    const cancelAddBinBtn = document.getElementById('cancel-add-bin-btn');
    const addBinForm = document.getElementById('add-bin-form');
    const binDetailsModal = document.getElementById('bin-details-modal');
    const binDetailsModalClose = document.getElementById('bin-details-modal-close');
    const removeBinBtn = document.getElementById('remove-bin-btn');
    const confirmRemoveModal = document.getElementById('confirm-remove-modal');
    const confirmModalClose = document.getElementById('confirm-modal-close');
    const cancelRemoveBtn = document.getElementById('cancel-remove-btn');
    const confirmRemoveBtn = document.getElementById('confirm-remove-btn');
    const binCards = document.getElementById('bin-cards');
    const binTypeFilter = document.getElementById('bin-type-filter');
    const binStatusFilter = document.getElementById('bin-status-filter');
    const binSearch = document.getElementById('bin-search');
    const refreshBinsBtn = document.getElementById('refresh-bins-btn');
    
    // Store chart instance
    let fillLevelChart = null;
    
    // Bin data
    let bins = [
        {
            id: 'BIN-1042',
            location: 'Main St & 5th Ave',
            type: 'General',
            status: 'Full',
            fillLevel: 95,
            lastCollection: '2 days ago',
            capacity: 120,
            installationDate: 'Jan 15, 2023',
            lastMaintenance: 'Mar 10, 2025',
            sensorStatus: 'Operational'
        },
        {
            id: 'BIN-1043',
            location: 'Park Ave & 3rd St',
            type: 'Recyclable',
            status: 'Half-full',
            fillLevel: 52,
            lastCollection: '3 days ago',
            capacity: 120,
            installationDate: 'Feb 20, 2023',
            lastMaintenance: 'Apr 5, 2025',
            sensorStatus: 'Operational'
        },
        {
            id: 'BIN-1044',
            location: 'Broadway & 7th St',
            type: 'General',
            status: 'Empty',
            fillLevel: 12,
            lastCollection: '1 day ago',
            capacity: 120,
            installationDate: 'Mar 5, 2023',
            lastMaintenance: 'Apr 15, 2025',
            sensorStatus: 'Operational'
        },
        {
            id: 'BIN-1045',
            location: 'Oak St & 9th Ave',
            type: 'Hazardous',
            status: 'Full',
            fillLevel: 90,
            lastCollection: '4 days ago',
            capacity: 80,
            installationDate: 'Jan 10, 2023',
            lastMaintenance: 'Mar 20, 2025',
            sensorStatus: 'Operational'
        },
        {
            id: 'BIN-1046',
            location: 'Elm St & 2nd Ave',
            type: 'Recyclable',
            status: 'Damaged',
            fillLevel: 0,
            lastCollection: 'N/A',
            capacity: 120,
            installationDate: 'Feb 5, 2023',
            lastMaintenance: 'Feb 25, 2025',
            sensorStatus: 'Malfunctioning'
        },
        {
            id: 'BIN-1047',
            location: 'Pine St & 6th Ave',
            type: 'General',
            status: 'Half-full',
            fillLevel: 45,
            lastCollection: '2 days ago',
            capacity: 120,
            installationDate: 'Mar 15, 2023',
            lastMaintenance: 'Apr 10, 2025',
            sensorStatus: 'Operational'
        },
        {
            id: 'BIN-1048',
            location: 'Maple St & 8th Ave',
            type: 'Recyclable',
            status: 'Empty',
            fillLevel: 8,
            lastCollection: '1 day ago',
            capacity: 120,
            installationDate: 'Apr 1, 2023',
            lastMaintenance: 'Apr 20, 2025',
            sensorStatus: 'Operational'
        },
        {
            id: 'BIN-1049',
            location: 'Cedar St & 4th Ave',
            type: 'Hazardous',
            status: 'Half-full',
            fillLevel: 60,
            lastCollection: '3 days ago',
            capacity: 80,
            installationDate: 'Feb 15, 2023',
            lastMaintenance: 'Mar 25, 2025',
            sensorStatus: 'Operational'
        }
    ];
    
    // Current bin being viewed/edited
    let currentBinId = null;
    
    // Initialize
    renderBinCards();
    updateBinStats();
    
    // Open add bin modal
    if (addBinBtn) {
        addBinBtn.addEventListener('click', function() {
            if (addBinModal) {
                addBinModal.classList.add('show');
            }
        });
    }
    
    // Close add bin modal
    if (addBinModalClose) {
        addBinModalClose.addEventListener('click', closeAddBinModal);
    }
    
    if (cancelAddBinBtn) {
        cancelAddBinBtn.addEventListener('click', closeAddBinModal);
    }
    
    function closeAddBinModal() {
        if (addBinModal) {
            addBinModal.classList.remove('show');
            if (addBinForm) {
                addBinForm.reset();
            }
        }
    }
    
    // Close bin details modal
    if (binDetailsModalClose) {
        binDetailsModalClose.addEventListener('click', closeBinDetailsModal);
    }
    
    function closeBinDetailsModal() {
        if (binDetailsModal) {
            binDetailsModal.classList.remove('show');
            
            // Destroy chart to prevent memory leaks
            if (fillLevelChart) {
                fillLevelChart.destroy();
                fillLevelChart = null;
            }
        }
    }
    
    // Open confirm remove modal
    if (removeBinBtn) {
        removeBinBtn.addEventListener('click', function() {
            if (confirmRemoveModal && currentBinId) {
                document.getElementById('confirm-bin-id').textContent = currentBinId;
                confirmRemoveModal.classList.add('show');
            }
        });
    }
    
    // Close confirm remove modal
    if (confirmModalClose) {
        confirmModalClose.addEventListener('click', closeConfirmModal);
    }
    
    if (cancelRemoveBtn) {
        cancelRemoveBtn.addEventListener('click', closeConfirmModal);
    }
    
    function closeConfirmModal() {
        if (confirmRemoveModal) {
            confirmRemoveModal.classList.remove('show');
        }
    }
    
    // Confirm remove bin
    if (confirmRemoveBtn) {
        confirmRemoveBtn.addEventListener('click', function() {
            if (currentBinId) {
                removeBin(currentBinId);
                closeConfirmModal();
                closeBinDetailsModal();
            }
        });
    }
    
    // Add bin form submission
    if (addBinForm) {
        addBinForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const binId = document.getElementById('bin-id').value;
            const binLocation = document.getElementById('bin-location').value;
            const binType = document.getElementById('bin-type').value;
            const binCapacity = document.getElementById('bin-capacity').value;
            const binStatus = document.getElementById('bin-status').value;
            const binLat = document.getElementById('bin-lat').value;
            const binLng = document.getElementById('bin-lng').value;
            
            // Create new bin object
            const newBin = {
                id: binId,
                location: binLocation,
                type: binType,
                status: binStatus,
                fillLevel: binStatus === 'Empty' ? 5 : binStatus === 'Half-full' ? 50 : 90,
                lastCollection: 'Today',
                capacity: parseInt(binCapacity),
                installationDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                lastMaintenance: 'N/A',
                sensorStatus: 'Operational',
                coordinates: {
                    lat: parseFloat(binLat),
                    lng: parseFloat(binLng)
                }
            };
            
            // Add bin to array
            bins.push(newBin);
            
            // Update UI
            renderBinCards();
            updateBinStats();
            
            // Close modal
            closeAddBinModal();
            
            // Show success message
            alert(`Bin ${binId} has been added successfully!`);
        });
    }
    
    // Filter and search bins
    if (binTypeFilter) {
        binTypeFilter.addEventListener('change', filterBins);
    }
    
    if (binStatusFilter) {
        binStatusFilter.addEventListener('change', filterBins);
    }
    
    if (binSearch) {
        binSearch.addEventListener('input', filterBins);
    }
    
    // Refresh bins
    if (refreshBinsBtn) {
        refreshBinsBtn.addEventListener('click', function() {
            // Simulate real-time updates
            simulateRealTimeUpdates();
            renderBinCards();
            updateBinStats();
        });
    }
    
    // Render bin cards
    function renderBinCards() {
        if (!binCards) return;
        
        // Apply filters
        const filteredBins = getFilteredBins();
        
        // Clear container
        binCards.innerHTML = '';
        
        // Render cards
        filteredBins.forEach(bin => {
            const card = createBinCard(bin);
            binCards.appendChild(card);
        });
        
        // If no bins match filters
        if (filteredBins.length === 0) {
            binCards.innerHTML = '<div class="no-results">No bins match your filters</div>';
        }
    }
    
    // Create bin card
    function createBinCard(bin) {
        const card = document.createElement('div');
        card.className = 'bin-card';
        card.setAttribute('data-bin-id', bin.id);
        
        // Determine fill level class
        let fillLevelClass = 'green';
        if (bin.status === 'Damaged') {
            fillLevelClass = 'gray';
        } else if (bin.fillLevel > 80) {
            fillLevelClass = 'red';
        } else if (bin.fillLevel > 40) {
            fillLevelClass = 'yellow';
        }
        
        // Add badge for full or damaged bins
        let badgeHtml = '';
        if (bin.status === 'Full') {
            badgeHtml = '<div class="bin-card-badge full">Full</div>';
        } else if (bin.status === 'Damaged') {
            badgeHtml = '<div class="bin-card-badge maintenance">Needs Maintenance</div>';
        }
        
        card.innerHTML = `
            ${badgeHtml}
            <div class="bin-card-header">
                <h4 class="bin-card-title">${bin.id}</h4>
                <span class="status-badge ${fillLevelClass.toLowerCase()}">${bin.type}</span>
            </div>
            <div class="bin-card-content">
                <div class="bin-card-location">${bin.location}</div>
                <div class="bin-fill-level">
                    <div class="bin-fill-level-label">
                        <span>Fill Level</span>
                        <span class="bin-fill-level-value">${bin.fillLevel}%</span>
                    </div>
                    <div class="bin-fill-visual">
                        <div class="bin-fill ${fillLevelClass}" style="height: ${bin.fillLevel}%;"></div>
                    </div>
                </div>
            </div>
            <div class="bin-card-footer">
                <div class="bin-card-info">
                    <span>Last Collection: <strong>${bin.lastCollection}</strong></span>
                </div>
                <div class="bin-card-actions">
                    <button class="btn btn-icon btn-outline view-bin-btn" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-icon btn-outline edit-bin-btn" title="Edit Bin">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Add event listeners
        const viewBtn = card.querySelector('.view-bin-btn');
        if (viewBtn) {
            viewBtn.addEventListener('click', function() {
                openBinDetails(bin.id);
            });
        }
        
        const editBtn = card.querySelector('.edit-bin-btn');
        if (editBtn) {
            editBtn.addEventListener('click', function() {
                // For now, just view details
                openBinDetails(bin.id);
            });
        }
        
        return card;
    }
    
    // Open bin details
    function openBinDetails(binId) {
        if (!binDetailsModal) return;
        
        // Find bin
        const bin = bins.find(b => b.id === binId);
        if (!bin) return;
        
        // Set current bin
        currentBinId = binId;
        
        // Update modal content
        document.getElementById('detail-bin-id').textContent = bin.id;
        document.getElementById('detail-bin-location').textContent = bin.location;
        
        // Set status badge
        const statusBadge = document.getElementById('detail-bin-status');
        statusBadge.textContent = bin.status;
        statusBadge.className = 'status-badge';
        
        if (bin.status === 'Full') {
            statusBadge.classList.add('red');
        } else if (bin.status === 'Half-full') {
            statusBadge.classList.add('yellow');
        } else if (bin.status === 'Empty') {
            statusBadge.classList.add('green');
        } else if (bin.status === 'Damaged') {
            statusBadge.classList.add('gray');
        }
        
        // Set fill level
        const fillLevelBar = document.getElementById('detail-fill-level-bar');
        document.getElementById('detail-fill-level').textContent = `${bin.fillLevel}%`;
        
        fillLevelBar.style.width = `${bin.fillLevel}%`;
        fillLevelBar.className = 'fill-level-progress';
        
        if (bin.status === 'Damaged') {
            fillLevelBar.classList.add('gray');
        } else if (bin.fillLevel > 80) {
            fillLevelBar.classList.add('red');
        } else if (bin.fillLevel > 40) {
            fillLevelBar.classList.add('yellow');
        } else {
            fillLevelBar.classList.add('green');
        }
        
        // Set bin details
        document.getElementById('detail-bin-type').textContent = bin.type;
        document.getElementById('detail-bin-capacity').textContent = `${bin.capacity} liters`;
        document.getElementById('detail-installation-date').textContent = bin.installationDate;
        document.getElementById('detail-last-maintenance').textContent = bin.lastMaintenance;
        document.getElementById('detail-last-collection').textContent = bin.lastCollection;
        
        // Set sensor status
        const sensorStatus = document.getElementById('detail-sensor-status');
        if (bin.sensorStatus === 'Operational') {
            sensorStatus.innerHTML = '<i class="fas fa-check-circle text-success"></i> Operational';
        } else {
            sensorStatus.innerHTML = '<i class="fas fa-exclamation-circle text-warning"></i> Malfunctioning';
        }
        
        // Initialize fill level chart
        initFillLevelChart();
        
        // Show modal
        binDetailsModal.classList.add('show');
    }
    
    // Initialize fill level chart
    function initFillLevelChart() {
        const ctx = document.getElementById('fill-level-chart');
        
        if (!ctx) return;
        
        // Check if chart already exists
        if (fillLevelChart) {
            fillLevelChart.destroy();
        }
        
        // Generate random data for the past week
        const labels = [];
        const data = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
            
            // Generate random fill level that generally increases
            const fillLevel = Math.floor(Math.random() * 20) + (i === 0 ? 75 : i === 1 ? 60 : i === 2 ? 45 : i === 3 ? 30 : i === 4 ? 20 : i === 5 ? 10 : 5);
            data.push(fillLevel);
        }
        
        // Create chart with fixed dimensions to prevent auto-expanding
        fillLevelChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Fill Level %',
                    data: data,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true, // Set to true to maintain aspect ratio
                aspectRatio: 2, // Fixed aspect ratio
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    // Remove bin
    function removeBin(binId) {
        // Find bin index
        const binIndex = bins.findIndex(b => b.id === binId);
        
        if (binIndex !== -1) {
            // Remove bin from array
            bins.splice(binIndex, 1);
            
            // Update UI
            renderBinCards();
            updateBinStats();
            
            // Show success message
            alert(`Bin ${binId} has been removed successfully!`);
        }
    }
    
    // Get filtered bins
    function getFilteredBins() {
        let filtered = [...bins];
        
        // Apply type filter
        if (binTypeFilter && binTypeFilter.value !== 'all') {
            filtered = filtered.filter(bin => bin.type.toLowerCase() === binTypeFilter.value.toLowerCase());
        }
        
        // Apply status filter
        if (binStatusFilter && binStatusFilter.value !== 'all') {
            filtered = filtered.filter(bin => bin.status.toLowerCase() === binStatusFilter.value.toLowerCase());
        }
        
        // Apply search
        if (binSearch && binSearch.value.trim() !== '') {
            const searchTerm = binSearch.value.trim().toLowerCase();
            filtered = filtered.filter(bin => 
                bin.id.toLowerCase().includes(searchTerm) || 
                bin.location.toLowerCase().includes(searchTerm)
            );
        }
        
        return filtered;
    }
    
    // Filter bins
    function filterBins() {
        renderBinCards();
    }
    
    // Update bin statistics
    function updateBinStats() {
        // Update total bins count
        const totalBinsCount = document.getElementById('total-bins-count');
        if (totalBinsCount) {
            totalBinsCount.textContent = bins.length;
        }
        
        // Update bins requiring collection
        const binsRequiringCollection = document.getElementById('bins-requiring-collection');
        if (binsRequiringCollection) {
            const fullBins = bins.filter(bin => bin.status === 'Full').length;
            binsRequiringCollection.textContent = fullBins;
        }
        
        // Update bins table
        updateBinsTable();
    }
    
    // Update bins table
    function updateBinsTable() {
        const binsTableBody = document.getElementById('bins-table-body');
        
        if (!binsTableBody) return;
        
        binsTableBody.innerHTML = '';
        
        bins.forEach(bin => {
            const row = document.createElement('tr');
            
            // Determine status class
            let statusClass = 'green';
            if (bin.status === 'Full') {
                statusClass = 'red';
            } else if (bin.status === 'Half-full') {
                statusClass = 'yellow';
            } else if (bin.status === 'Damaged') {
                statusClass = 'gray';
            }
            
            row.innerHTML = `
                <td>${bin.id}</td>
                <td>${bin.location}</td>
                <td>${bin.type}</td>
                <td>
                    <span class="status-badge ${statusClass}">${bin.status}</span>
                </td>
                <td>
                    <div class="fill-level-bar">
                        <div class="fill-level-progress ${statusClass}" style="width: ${bin.fillLevel}%"></div>
                    </div>
                    <span class="fill-level-text">${bin.fillLevel}%</span>
                </td>
                <td>${bin.lastCollection}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-icon btn-sm btn-outline view-bin-btn" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-icon btn-sm btn-outline edit-bin-btn" title="Edit Bin">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-icon btn-sm btn-outline delete-bin-btn" title="Delete Bin">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            
            // Add event listeners
            const viewBtn = row.querySelector('.view-bin-btn');
            if (viewBtn) {
                viewBtn.addEventListener('click', function() {
                    openBinDetails(bin.id);
                });
            }
            
            const editBtn = row.querySelector('.edit-bin-btn');
            if (editBtn) {
                editBtn.addEventListener('click', function() {
                    // For now, just view details
                    openBinDetails(bin.id);
                });
            }
            
            const deleteBtn = row.querySelector('.delete-bin-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', function() {
                    currentBinId = bin.id;
                    document.getElementById('confirm-bin-id').textContent = bin.id;
                    confirmRemoveModal.classList.add('show');
                });
            }
            
            binsTableBody.appendChild(row);
        });
    }
    
    // Simulate real-time updates
    function simulateRealTimeUpdates() {
        // Update fill levels randomly
        bins.forEach(bin => {
            if (bin.status !== 'Damaged') {
                // Randomly increase fill level
                const increase = Math.floor(Math.random() * 10);
                bin.fillLevel = Math.min(100, bin.fillLevel + increase);
                
                // Update status based on fill level
                if (bin.fillLevel > 80) {
                    bin.status = 'Full';
                } else if (bin.fillLevel > 40) {
                    bin.status = 'Half-full';
                } else {
                    bin.status = 'Empty';
                }
            }
        });
    }
    
    // Initialize map picker
    const mapPicker = document.getElementById('map-picker');
    if (mapPicker) {
        mapPicker.addEventListener('click', function(e) {
            // Simulate picking a location on the map
            alert('In a real implementation, this would allow you to click on a map to set the bin location.');
            
            // Set random coordinates
            document.getElementById('bin-lat').value = (Math.random() * 0.1 + 40.7).toFixed(6);
            document.getElementById('bin-lng').value = (Math.random() * 0.1 - 74.0).toFixed(6);
        });
    }
    
    // Bin management link
    if (binManagementLink) {
        binManagementLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Scroll to bin management section
            const binManagementCard = document.querySelector('.bin-management-card');
            if (binManagementCard) {
                binManagementCard.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Make openBinDetails available globally
    window.binManagement = {
        openBinDetails: openBinDetails
    };
});