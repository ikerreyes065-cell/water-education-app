import { sounds } from './sounds.js';

let allowOverlap = false;
let showFavorites = false;
let currentAudios = [];

const toggleButton = document.getElementById('toggleButton');
const stopButton = document.getElementById('stopButton');
const searchInput = document.getElementById('searchInput');
const favoriteButton = document.getElementById('toggleFavorites');
const soundBoard = document.getElementById('soundboard');

toggleButton.onclick = () => {
    allowOverlap = !allowOverlap;
    toggleButton.textContent = allowOverlap ? '🔊 Overlap: ON' : '🔇 Overlap: OFF';
};

stopButton.onclick = () => {
    currentAudios.forEach(a => a.pause());
    currentAudios = [];
};

favoriteButton.onclick = () => {
    showFavorites = !showFavorites;
    favoriteButton.textContent = showFavorites ? '🌟 Favorites: ON' : '⭐ Favorites: OFF';
    renderSounds(showFavorites ? "filter:favorite " + searchInput.value : searchInput.value);
};

function renderSounds(filter = '') {
    soundBoard.innerHTML = '';
    let finalSound;

    if (filter.startsWith("filter:favorite ")) {
        finalSound = (localStorage.getItem('favorites') ? JSON.parse(localStorage.getItem('favorites')) : [])
            .filter(s => s.name.toLowerCase().includes(filter.toLowerCase().replace('filter:favorite ', '')));
    } else {
        finalSound = sounds.filter(s => s.name.toLowerCase().includes(filter.toLowerCase()));
    }

    finalSound.forEach(sound => {
        const wrapper = document.createElement('div');
        wrapper.className = 'sound-wrapper';

        const button = document.createElement('button');
        wrapper.addEventListener("contextmenu", (e) => rightClickPanel(e, wrapper, sound));

        button.className = 'sound-button-img';
        button.style.setProperty('--btn-color', sound.color || '#ff00ff');

        const image = document.createElement('div');
        image.className = 'sound-image';
        button.appendChild(image);

        button.onclick = () => {
            if (!allowOverlap) {
                currentAudios.forEach(a => a.pause());
                currentAudios = [];
            }
            
            const audioUrl = `https://raw.githubusercontent.com/water-education/water-education-app/main/soundboard-main${sound.mp3}`;
            const audio = new Audio(audioUrl);
            audio.play().catch(e => console.error("Play error:", sound.name, e));
            
            currentAudios.push(audio);
            image.classList.add('pressed');
            setTimeout(() => image.classList.remove('pressed'), 150);
        };

        const label = document.createElement('div');
        label.className = 'sound-label';
        label.textContent = sound.name;

        wrapper.appendChild(button);
        wrapper.appendChild(label);
        soundBoard.appendChild(wrapper);
    });
}

renderSounds();

searchInput.addEventListener('input', () => {
    renderSounds((showFavorites ? "filter:favorite " : "") + searchInput.value);
});

function rightClickPanel(event, wrapper, sound) {
    // ... (your right click code - keep it as is)
    // Just make sure the download link also uses the correct URL (same as above)
}

// Keep all your TTS code below unchanged
