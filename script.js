function updateStopsInput() {
    const numStops = parseInt(document.getElementById('num-stops').value) || 0;
    const stopsContainer = document.getElementById('stops-container');
    stopsContainer.innerHTML = '';

    for (let i = 0; i < numStops; i++) {
        const stopDiv = document.createElement('div');
        stopDiv.className = 'stop-input';

        const cityLabel = document.createElement('label');
        cityLabel.textContent = `Stop #${i + 1} City or Country:`;
        const cityInput = document.createElement('input');
        cityInput.type = 'text';
        cityInput.placeholder = 'e.g., Seoul';
        cityInput.required = true;

        const modeLabel = document.createElement('label');
        modeLabel.textContent = `Transport Mode to Stop #${i + 1}:`;
        const modeSelect = document.createElement('select');
        ['Flight', 'Train', 'Bus', 'Car'].forEach(mode => {
            const option = document.createElement('option');
            option.value = mode;
            option.textContent = mode;
            modeSelect.appendChild(option);
        });

        stopDiv.appendChild(cityLabel);
        stopDiv.appendChild(cityInput);
        stopDiv.appendChild(modeLabel);
        stopDiv.appendChild(modeSelect);
        stopsContainer.appendChild(stopDiv);
    }

    // Add mode for final leg if there are stops
    if (numStops > 0) {
        const finalModeLabel = document.createElement('label');
        finalModeLabel.textContent = 'Transport Mode to Destination:';
        const finalModeSelect = document.createElement('select');
        ['Flight', 'Train', 'Bus', 'Car'].forEach(mode => {
            const option = document.createElement('option');
            option.value = mode;
            option.textContent = mode;
            finalModeSelect.appendChild(option);
        });
        stopsContainer.appendChild(finalModeLabel);
        stopsContainer.appendChild(finalModeSelect);
    }
}

async function planTrip() {
    const startCity = document.getElementById('start-city').value.trim();
    const numStops = parseInt(document.getElementById('num-stops').value) || 0;
    const endCity = document.getElementById('end-city').value.trim();
    const outputDiv = document.getElementById('output');

    if (!startCity || !endCity) {
        outputDiv.textContent = 'Please enter both starting and destination cities.';
        return;
    }

    const stops = [];
    const stopInputs = document.querySelectorAll('.stop-input');
    stopInputs.forEach((stopDiv, index) => {
        const city = stopDiv.querySelector('input').value.trim();
        const mode = stopDiv.querySelector('select').value;
        if (city) {
            stops.push({ city, mode });
        }
    });

    // Get final mode if stops exist
    let finalMode = 'Flight'; // Default for direct route
    if (numStops > 0) {
        const finalModeSelect = document.querySelector('#stops-container select:last-child');
        if (finalModeSelect) {
            finalMode = finalModeSelect.value;
            stops[numStops - 1] = { ...stops[numStops - 1], mode: finalMode }; // Update last stop's mode
        }
    }

    try {
        const response = await fetch('http://localhost:3000/plan-trip', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ startCity, numStops, stops, endCity })
        });

        const data = await response.json();
        if (data.error) {
            outputDiv.textContent = `Error: ${data.error}`;
        } else {
            outputDiv.textContent = data.output;
        }
    } catch (error) {
        outputDiv.textContent = `Error: Failed to connect to server. ${error.message}`;
    }
}

// Initialize stops input when number of stops changes
document.getElementById('num-stops').addEventListener('change', updateStopsInput);

// Initialize on page load
updateStopsInput();