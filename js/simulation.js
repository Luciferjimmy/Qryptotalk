document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const elements = {
        step1Btn: document.getElementById('step1-btn'),
        step2Btn: document.getElementById('step2-btn'),
        step3Btn: document.getElementById('step3-btn'),
        resetBtn: document.getElementById('reset-btn'),
        eveToggle: document.getElementById('eve-toggle'),
        aliceBits: document.getElementById('alice-bits'),
        aliceBases: document.getElementById('alice-bases'),
        bobBases: document.getElementById('bob-bases'),
        bobResults: document.getElementById('bob-results'),
        photons: document.getElementById('photons'),
        eve: document.getElementById('eve'),
        results: document.getElementById('results'),
        matchingBases: document.getElementById('matching-bases'),
        finalKey: document.getElementById('final-key'),
        eveResult: document.getElementById('eve-result'),
        aliceCharacter: document.querySelector('.character.alice'),
        bobCharacter: document.querySelector('.character.bob')
    };

    // Simulation State
    const state = {
        aliceBits: [],
        aliceBases: [],
        bobBases: [],
        bobResults: [],
        matchingIndices: [],
        eveActive: false,
        currentStep: 0,
        numQubits: 8,
        animationSpeed: 300
    };

    // Initialize
    initSimulation();

    // Event Listeners
    elements.step1Btn.addEventListener('click', step1);
    elements.step2Btn.addEventListener('click', step2);
    elements.step3Btn.addEventListener('click', step3);
    elements.resetBtn.addEventListener('click', initSimulation);
    elements.eveToggle.addEventListener('change', function() {
        state.eveActive = this.checked;
        if (state.eveActive) {
            elements.eve.classList.add('pulse');
            setTimeout(() => elements.eve.classList.remove('pulse'), 1000);
        }
    });

    function initSimulation() {
        // Reset state
        state.aliceBits = generateRandomBits(state.numQubits);
        state.aliceBases = generateRandomBases(state.numQubits);
        state.bobBases = generateRandomBases(state.numQubits);
        state.bobResults = [];
        state.matchingIndices = [];
        
        // Reset UI
        renderBits(elements.aliceBits, state.aliceBits, 'bit');
        renderBases(elements.aliceBases, state.aliceBases);
        elements.bobBases.innerHTML = '';
        elements.bobResults.innerHTML = '';
        elements.photons.innerHTML = '';
        elements.eve.classList.add('hidden');
        elements.results.classList.add('hidden');
        elements.eveResult.classList.add('hidden');
        
        // Reset buttons
        elements.step1Btn.classList.add('active');
        elements.step2Btn.classList.remove('active');
        elements.step3Btn.classList.remove('active');
        elements.step2Btn.disabled = true;
        elements.step3Btn.disabled = true;
        
        // Reset Eve toggle
        elements.eveToggle.checked = false;
        state.eveActive = false;
        
        // Reset characters
        elements.aliceCharacter.classList.remove('active');
        elements.bobCharacter.classList.remove('active');
        
        state.currentStep = 0;
    }

    function generateRandomBits(length) {
        return Array.from({length}, () => Math.floor(Math.random() * 2));
    }

    function generateRandomBases(length) {
        const bases = ['+', '×'];
        return Array.from({length}, () => bases[Math.floor(Math.random() * bases.length)]);
    }

    function renderBits(container, bits, type) {
        container.innerHTML = '';
        bits.forEach((bit, index) => {
            const bitElement = document.createElement('div');
            bitElement.className = `${type} ${type}-${bit}`;
            bitElement.textContent = bit;
            bitElement.dataset.index = index;
            container.appendChild(bitElement);
        });
    }

    function renderBases(container, bases) {
        container.innerHTML = '';
        bases.forEach((base, index) => {
            const baseElement = document.createElement('div');
            baseElement.className = `basis basis-${base === '+' ? 'plus' : 'cross'}`;
            baseElement.textContent = base;
            baseElement.dataset.index = index;
            container.appendChild(baseElement);
        });
    }

    function step1() {
        // Activate Alice
        elements.aliceCharacter.classList.add('active');
        
        // Show Alice's bits and bases
        renderBits(elements.aliceBits, state.aliceBits, 'bit');
        renderBases(elements.aliceBases, state.aliceBases);
        
        // Create photons with animation
        elements.photons.innerHTML = '';
        state.aliceBits.forEach((bit, i) => {
            setTimeout(() => {
                const photon = document.createElement('div');
                photon.className = `photon photon-${state.aliceBases[i] === '+' ? 'plus' : 'cross'}-${bit}`;
                photon.dataset.index = i;
                photon.dataset.state = `${bit}-${state.aliceBases[i]}`;
                elements.photons.appendChild(photon);
            }, i * 100);
        });
        
        // Enable next step
        setTimeout(() => {
            elements.step1Btn.classList.remove('active');
            elements.step2Btn.classList.add('active');
            elements.step2Btn.disabled = false;
            state.currentStep = 1;
        }, state.numQubits * 100 + 200);
    }

    function step2() {
        // Activate Bob
        elements.bobCharacter.classList.add('active');
        
        // Show Eve if active
        if (state.eveActive) {
            elements.eve.classList.remove('hidden');
            elements.eve.classList.add('shake');
            setTimeout(() => elements.eve.classList.remove('shake'), 1000);
        }
        
        // Show Bob's bases
        renderBases(elements.bobBases, state.bobBases);
        
        // Clear previous results
        elements.bobResults.innerHTML = '';
        state.bobResults = [];
        
        const photonElements = elements.photons.querySelectorAll('.photon');
        
        photonElements.forEach((photon, i) => {
            setTimeout(() => {
                // If Eve is active, she measures first
                if (state.eveActive) {
                    // Eve only guesses correct basis 25% of the time
                    const eveBase = Math.random() > 0.75 ? state.aliceBases[i] : 
                                  (state.aliceBases[i] === '+' ? '×' : '+');
                    const [bit, originalBase] = photon.dataset.state.split('-');
                    
                    // Eve's measurement affects the state if wrong basis
                    if (eveBase !== originalBase) {
                        const newBit = Math.floor(Math.random() * 2);
                        photon.dataset.state = `${newBit}-${eveBase}`;
                        photon.className = `photon photon-${eveBase === '+' ? 'plus' : 'cross'}-${newBit}`;
                        
                        // Show Eve's measurement effect
                        const eveEffect = document.createElement('div');
                        eveEffect.className = 'eve-effect';
                        photon.appendChild(eveEffect);
                        setTimeout(() => eveEffect.remove(), 500);
                    }
                }
                
                // Bob measures
                const [bit, aliceBase] = photon.dataset.state.split('-');
                const bobBase = state.bobBases[i];
                
                let result;
                if (bobBase === aliceBase) {
                    // Correct measurement
                    result = parseInt(bit);
                    photon.classList.add('measured-correct');
                } else {
                    // Random result
                    result = Math.floor(Math.random() * 2);
                    photon.classList.add('measured-incorrect');
                }
                
                state.bobResults[i] = result;
                
                // Show Bob's result with animation
                setTimeout(() => {
                    const resultElement = document.createElement('div');
                    resultElement.className = `bit bit-${result}`;
                    resultElement.textContent = result;
                    elements.bobResults.appendChild(resultElement);
                    
                    // Add animation
                    resultElement.classList.add('fade-in');
                    setTimeout(() => resultElement.classList.remove('fade-in'), 500);
                }, 200);
                
            }, i * state.animationSpeed);
        });
        
        // Enable next step
        setTimeout(() => {
            elements.step2Btn.classList.remove('active');
            elements.step3Btn.classList.add('active');
            elements.step3Btn.disabled = false;
            state.currentStep = 2;
        }, state.numQubits * state.animationSpeed + 500);
    }

    function step3() {
        // Hide Eve
        elements.eve.classList.add('hidden');
        
        // Find matching bases
        state.matchingIndices = [];
        for (let i = 0; i < state.aliceBases.length; i++) {
            if (state.aliceBases[i] === state.bobBases[i]) {
                state.matchingIndices.push(i);
            }
        }
        
        // Display matching bases with animation
        elements.matchingBases.innerHTML = '';
        state.matchingIndices.forEach((index, i) => {
            setTimeout(() => {
                const matchElement = document.createElement('div');
                matchElement.className = 'matching-base fade-in';
                matchElement.textContent = index + 1;
                elements.matchingBases.appendChild(matchElement);
            }, i * 150);
        });
        
        // Display final key with animation
        elements.finalKey.innerHTML = '';
        state.matchingIndices.forEach((index, i) => {
            setTimeout(() => {
                const keyElement = document.createElement('div');
                keyElement.className = 'key-bit fade-in';
                keyElement.textContent = state.aliceBits[index];
                elements.finalKey.appendChild(keyElement);
            }, i * 150);
        });
        
        // Check for eavesdropping if Eve was active
        if (state.eveActive) {
            // Compare a subset of bits to detect Eve
            const checkCount = Math.min(3, state.matchingIndices.length);
            let mismatches = 0;
            
            for (let i = 0; i < checkCount; i++) {
                const idx = state.matchingIndices[i];
                if (state.aliceBits[idx] !== state.bobResults[idx]) {
                    mismatches++;
                }
            }
            
            setTimeout(() => {
                elements.eveResult.classList.remove('hidden');
                if (mismatches > 0) {
                    elements.eveResult.className = 'eve-result eve-detected fade-in';
                    elements.eveResult.innerHTML = `
                        <div class="eve-icon">🚨</div>
                        <p>Eavesdropper detected with ${Math.round((mismatches/checkCount)*100)}% error rate!</p>
                        <p class="small">(Expected ~37.5% error rate when Eve is active)</p>
                    `;
                } else {
                    elements.eveResult.className = 'eve-result eve-not-detected fade-in';
                    elements.eveResult.innerHTML = `
                        <div class="eve-icon">⚠️</div>
                        <p>No eavesdropping detected (Eve got lucky this time!)</p>
                        <p class="small">(This happens ~17% of the time with Eve active)</p>
                    `;
                }
            }, state.matchingIndices.length * 150 + 200);
        }
        
        // Show results
        setTimeout(() => {
            elements.results.classList.remove('hidden');
            elements.step3Btn.classList.remove('active');
            state.currentStep = 3;
        }, 500);
    }
});