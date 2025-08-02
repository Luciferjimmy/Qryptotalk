// Base options for Alice and Bob
const bases = [
  { name: 'Rectilinear', icon: '+', value: 'rectilinear' },
  { name: 'Diagonal', icon: '×', value: 'diagonal' }
];

let aliceBase = null;
let bobBase = null;

function renderBaseSelection() {
  const aliceDiv = document.getElementById('alice-bases');
  const bobDiv = document.getElementById('bob-bases');
  aliceDiv.innerHTML = '<div style="align-self:center;margin-right:7px;">Alice:</div>';
  bobDiv.innerHTML = '<div style="align-self:center;margin-right:7px;">Bob:</div>';
  
  bases.forEach((base, i) => {
    // Alice base buttons
    const aBtn = document.createElement('div');
    aBtn.className = 'basis-selector' + (aliceBase === base.value ? ' selected' : '');
    aBtn.innerHTML = `${base.icon}<div class="basis-label">${base.name}</div>`;
    aBtn.onclick = () => {
      aliceBase = base.value;
      renderBaseSelection();
    };
    aliceDiv.appendChild(aBtn);

    // Bob base buttons
    const bBtn = document.createElement('div');
    bBtn.className = 'basis-selector' + (bobBase === base.value ? ' selected' : '');
    bBtn.innerHTML = `${base.icon}<div class="basis-label">${base.name}</div>`;
    bBtn.onclick = () => {
      bobBase = base.value;
      renderBaseSelection();
    };
    bobDiv.appendChild(bBtn);
  });
}

function randomBit() {
  return Math.random() < 0.5 ? 0 : 1;
}

function simulatePhotonSend() {
  const resultDiv = document.getElementById('result');
  if (!aliceBase || !bobBase) {
    resultDiv.style.color = "#ef6363";
    resultDiv.textContent = "Please select bases for both Alice and Bob!";
    return;
  }
  // Alice prepares a random bit in her base
  const bit = randomBit();
  // If same bases, bit transmitted exactly. If not, result is random
  let bobBit, detected;
  if (aliceBase === bobBase) {
    bobBit = bit;
    detected = "Success! Bob got the secret bit: " + bit + " 🎉";
    resultDiv.style.color = "#1abc9c";
  } else {
    bobBit = randomBit();
    detected = "Bases differ: Bob sees a random bit (" + bobBit + "). Spy beware!";
    resultDiv.style.color = "#ffbe76";
  }
  resultDiv.textContent = detected;
}

// Init on page load
window.onload = () => {
  renderBaseSelection();
  document.getElementById('sendPhoton').onclick = simulatePhotonSend;
};
document.addEventListener('DOMContentLoaded', function() {
    // Header scroll effect
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Animate steps on scroll
    const steps = document.querySelectorAll('.step-content');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    steps.forEach(step => {
        observer.observe(step);
    });

    // Create photon animation elements
    const quantumChannel = document.querySelector('.quantum-channel');
    for (let i = 0; i < 5; i++) {
        const photon = document.createElement('div');
        photon.className = 'photon-animation';
        photon.style.animationDelay = `${i * 0.4}s`;
        quantumChannel.appendChild(photon);
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});