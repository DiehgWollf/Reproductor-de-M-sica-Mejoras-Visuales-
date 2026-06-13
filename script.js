// ==========================================================================
// BASE DE DATOS DE CANCIONES
// ==========================================================================
const playlistData = [
    {
        name: "Chill & Lofi ☕",
        songs: [
            {
                title: "Lofi Hip Hop",
                artist: "Chill Beats",
                cover: "https://images.unsplash.com/photo-1516280440614-37939bbacd6a?w=400&h=400&fit=crop", 
                url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                discColor: "#ff007f" 
            },
            {
                title: "Acoustic Dreams",
                artist: "Guitar Hero",
                cover: "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=400&h=400&fit=crop", 
                url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
                discColor: "#00f0ff" 
            },
            {
                title: "Deep Forest",
                artist: "Nature Soundscape",
                cover: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop",
                url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
                discColor: "#39ff14" 
            }
        ]
    },
    {
        name: "Cyber & Synth ⚡",
        songs: [
            {
                title: "Electronic Night",
                artist: "Synth Master",
                cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=400&fit=crop", 
                url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                discColor: "#ff073a" 
            },
            {
                title: "Cyber Pulse",
                artist: "Future Bass",
                cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop", 
                url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
                discColor: "#ffff00" 
            },
            {
                title: "Retro Synthwave",
                artist: "Neon Rider",
                cover: "https://images.unsplash.com/photo-1515462277126-270d878326e5?w=400&h=400&fit=crop", 
                url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
                discColor: "#ff00ff" 
            }
        ]
    },
    {
        name: "Energía & Piano 🎹",
        songs: [
            {
                title: "Summer Waves",
                artist: "Sunny Vibes",
                cover: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop", 
                url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
                discColor: "#ff4500" 
            },
            {
                title: "Piano Serenade",
                artist: "Classic Touch",
                cover: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=400&fit=crop", 
                url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
                discColor: "#00ff7f" 
            },
            {
                title: "Neon Sunset",
                artist: "Electro Dream",
                cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop",
                url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
                discColor: "#ffffff" 
            }
        ]
    }
];

// Unimos todas las canciones en un solo arreglo plano para pasar de canción en canción fácilmente.
const songs = [];
playlistData.forEach(p => {
    p.songs.forEach(s => songs.push(s));
});

// Control de estados de la App
let currentSongIndex = 0;
let isPlaying = false;

// Captura de elementos del documento HTML (DOM)
const audio = document.getElementById('audio-player');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const coverContainer = document.getElementById('cover-container');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const durationTimeEl = document.getElementById('duration-time');
const playlistContainer = document.getElementById('playlist');
const rightSongsContainer = document.getElementById('right-songs-list');
const searchInput = document.getElementById('search-input');

const mainTitle = document.getElementById('title');
const mainArtist = document.getElementById('artist');
const mainCover = document.getElementById('cover');
const barTitle = document.getElementById('bar-title');
const barArtist = document.getElementById('bar-artist');
const miniCoverImg = document.getElementById('mini-cover-img');

const volumeControl = document.getElementById('volumeControl');
const volumeBar = document.getElementById('volume-bar');
const volumeIcon = document.getElementById('volumeIcon');

// Formatos SVG vectoriales para la bocina del volumen
const svgMute = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="22" y1="9" x2="16" y2="15"></line><line x1="16" y1="9" x2="22" y2="15"></line></svg>`;
const svgLow = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
const svgHigh = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;

// Función para cargar la canción seleccionada y actualizar el texto y portadas
function loadSong(index) {
    const song = songs[index];
    
    mainTitle.innerText = song.title;
    mainArtist.innerText = song.artist;
    mainCover.src = song.cover;

    barTitle.innerText = song.title;
    barArtist.innerText = song.artist;
    miniCoverImg.src = song.cover;
    
    // Coloca la portada de la canción actual de fondo de la caja de DJ
    coverContainer.style.backgroundImage = `linear-gradient(rgba(5, 5, 43, 0.72), rgba(5, 5, 43, 0.72)), url("${song.cover}")`;
    
    audio.pause();            
    audio.src = song.url;     
    audio.load();             
    
    updatePlaylistUI();       
    updateRightSongsListUI(); 
    
    progressBar.value = 0;
    updateSliderFill(0);
    currentTimeEl.innerText = "0:00";
    durationTimeEl.innerText = "0:00";

    // Si se busca algo, limpiamos el campo al elegir canción nueva
    if (searchInput.value !== "") {
        searchInput.value = "";
        playlistContainer.classList.remove('searching');
    }
}

// Arranca la reproducción del archivo de audio real
async function playAudio() {
    try {
        await audio.play(); 
        isPlaying = true;
        playBtn.innerText = "⏸"; 
        document.querySelector('.main-view').classList.add('playing'); // Agrega la clase al contenedor principal
        
        updatePlaylistUI();
        updateRightSongsListUI();
    } catch (err) {
        console.log("Error al intentar reproducir audio:", err);
    }
}

// Pausa la canción
function pauseAudio() {
    audio.pause(); 
    isPlaying = false;
    playBtn.innerText = "▶"; 
    document.querySelector('.main-view').classList.remove('playing'); // Remueve la clase del contenedor principal
    
    updatePlaylistUI();
    updateRightSongsListUI();
}

// Alterna entre Play y Pausa
function togglePlay() {
    if (isPlaying) {
        pauseAudio();
    } else {
        playAudio();
    }
}

// Siguiente canción en la cola
function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    playAudio();
}

// Anterior canción en la cola
function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    playAudio();
}

// Mantiene la sección correcta del acordeón izquierdo abierta según la canción elegida
function ensureCurrentGroupIsOpen() {
    let tempIdx = 0;
    playlistData.forEach((group, groupIndex) => {
        const startIdx = tempIdx;
        const endIdx = tempIdx + group.songs.length;
        if (currentSongIndex >= startIdx && currentSongIndex < endIdx) {
            const groupEl = document.getElementById(`playlist-group-${groupIndex}`);
            if (groupEl) {
                groupEl.classList.add('open');
            }
        }
        tempIdx += group.songs.length;
    });
}

// Dibuja dinámicamente el Acordeón de Playlists Izquierdo
function updatePlaylistUI() {
    playlistContainer.innerHTML = ""; 
    let absoluteIndex = 0;

    playlistData.forEach((group, groupIndex) => {
        const startIdx = absoluteIndex;
        const endIdx = absoluteIndex + group.songs.length;

        const groupEl = document.createElement('div');
        groupEl.className = 'playlist-group';
        groupEl.id = `playlist-group-${groupIndex}`;

        const headerEl = document.createElement('div');
        headerEl.className = 'playlist-group-header';
        headerEl.innerHTML = `
            <span>${group.name}</span>
            <span class="arrow">▼</span>
        `;

        const contentEl = document.createElement('div');
        contentEl.className = 'playlist-group-content';

        group.songs.forEach((song) => {
            const songIndex = absoluteIndex;
            const item = document.createElement('div');
            item.className = `playlist-item ${songIndex === currentSongIndex ? 'active-song' : ''}`;
            item.innerHTML = `<strong>${songIndex + 1}</strong> <span>${song.title}</span>`;
            
            item.onclick = (e) => {
                e.stopPropagation(); 
                currentSongIndex = songIndex;
                loadSong(songIndex);
                playAudio();
            };

            contentEl.appendChild(item);
            absoluteIndex++;
        });

        groupEl.appendChild(headerEl);
        groupEl.appendChild(contentEl);

        // Evento click para abrir y cerrar el menú colapsable (acordeón)
        headerEl.onclick = () => {
            const isOpen = groupEl.classList.contains('open');
            
            document.querySelectorAll('.playlist-group').forEach(el => {
                el.classList.remove('open');
            });

            if (!isOpen) {
                groupEl.classList.add('open');
            }
        };

        if (currentSongIndex >= startIdx && currentSongIndex < endIdx) {
            groupEl.classList.add('open');
        }

        playlistContainer.appendChild(groupEl);
    });
}

// Dibuja la lista derecha de canciones individuales con sus vinilos animados independientes
function updateRightSongsListUI() {
    rightSongsContainer.innerHTML = ""; 

    songs.forEach((song, index) => {
        const item = document.createElement('div');
        
        const isActive = (index === currentSongIndex);
        const playClass = (isActive && isPlaying) ? 'playing-right-song' : '';
        const activeClass = isActive ? 'active-right-song' : '';
        
        item.className = `right-song-item ${activeClass} ${playClass}`;
        
        item.innerHTML = `
            <div class="vinyl-disc-container">
                <div class="vinyl-disc" style="--disc-color: ${song.discColor || 'var(--color-magenta)'}">
                    <div class="vinyl-center" style="background-image: url('${song.cover}'); background-size: cover; background-position: center;"></div>
                </div>
                <div class="mini-tonearm">
                    <div class="mini-tonearm-pivot"></div>
                    <div class="mini-tonearm-arm">
                        <div class="mini-tonearm-head"></div>
                    </div>
                </div>
            </div>
            <div class="right-song-info">
                <span class="right-song-title">${song.title}</span>
                <span class="right-song-artist">${song.artist}</span>
            </div>
        `;

        item.onclick = () => {
            currentSongIndex = index;
            loadSong(index);
            playAudio();
        };

        rightSongsContainer.appendChild(item);
    });
}

// Cambia gradualmente el relleno de la barra de progreso mientras avanza el reproductor
function updateSliderFill(percentage) {
    progressBar.style.background = `linear-gradient(to right, var(--color-magenta) 0%, var(--color-magenta) ${percentage}%, rgba(255, 255, 255, 0.15) ${percentage}%, rgba(255, 255, 255, 0.15) 100%)`;
}

// Actualiza el tiempo actual y la barra de progreso
function updateProgress() {
    if (audio.duration) {
        const percentage = (audio.currentTime / audio.duration) * 100;
        progressBar.value = percentage;
        updateSliderFill(percentage);
        currentTimeEl.innerText = formatTime(audio.currentTime); 
    }
}

// Permite saltar a un segundo específico de la canción al arrastrar la barra
function setProgress(e) {
    if (audio.duration) {
        const percentage = e.target.value;
        const newTime = (percentage / 100) * audio.duration;
        audio.currentTime = newTime;
        updateSliderFill(percentage);
    }
}

// Muestra la duración total del archivo MP3 una vez cargado
function updateDuration() {
    if (audio.duration) {
        durationTimeEl.innerText = formatTime(audio.duration);
    }
}

// Convierte segundos numéricos a un bonito formato amigable: "Minutos:Segundos"
function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// Ajusta el nivel de sonido real de la etiqueta de audio
function setVolume(e) {
    const volumeValue = e.target.value;
    audio.volume = volumeValue / 100;
    updateVolumeIcon(volumeValue);
}

// Cambia dinámicamente el icono del volumen según los decibelios
function updateVolumeIcon(volumeValue) {
    if (volumeValue == 0) {
        volumeIcon.innerHTML = svgMute;
    } else if (volumeValue < 40) {
        volumeIcon.innerHTML = svgLow;
    } else {
        volumeIcon.innerHTML = svgHigh;
    }
}

// Permite silenciar rápido haciendo clic en el icono del parlante
let lastVolume = 70;
volumeIcon.addEventListener('click', () => {
    if (audio.volume > 0) {
        lastVolume = volumeBar.value;
        audio.volume = 0;
        volumeBar.value = 0;
        updateVolumeIcon(0);
    } else {
        audio.volume = lastVolume / 100;
        volumeBar.value = lastVolume;
        updateVolumeIcon(lastVolume);
    }
});

// Soporte táctil y gestos para móviles
volumeControl.addEventListener('touchstart', () => {
    volumeControl.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    if (!volumeControl.contains(e.target)) {
        volumeControl.classList.remove('active');
    }
});

// Teclado interactivo para amantes de los atajos (Espacio, Flechas)
window.addEventListener('keydown', (e) => {
    if (e.code === "Space") { 
        e.preventDefault(); 
        togglePlay(); 
    }
    if (e.code === "ArrowRight") nextSong();
    if (e.code === "ArrowLeft") prevSong();
});

// Filtro y buscador inteligente en tiempo real
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const playlistItems = document.querySelectorAll('.playlist-item');
    const groups = document.querySelectorAll('.playlist-group');

    if (query === "") {
        playlistContainer.classList.remove('searching');
        playlistItems.forEach(item => item.classList.remove('searched-match'));
        
        groups.forEach((groupEl) => {
            groupEl.classList.remove('open');
        });
        ensureCurrentGroupIsOpen();
        return;
    }

    playlistContainer.classList.add('searching');
    let firstMatch = null;

    playlistItems.forEach((item, index) => {
        const song = songs[index];
        const matchesTitle = song.title.toLowerCase().includes(query);
        const matchesArtist = song.artist.toLowerCase().includes(query);

        if (matchesTitle || matchesArtist) {
            item.classList.add('searched-match');
            
            const parentGroup = item.closest('.playlist-group');
            if (parentGroup) {
                parentGroup.classList.add('open');
            }
            
            if (!firstMatch) {
                firstMatch = item; 
            }
        } else {
            item.classList.remove('searched-match');
        }
    });

    if (firstMatch) {
        firstMatch.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
});

// Eventos nativos de JavaScript conectados a los botones
playBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);
volumeBar.addEventListener('input', setVolume);

audio.addEventListener('timeupdate', updateProgress); 
audio.addEventListener('loadedmetadata', updateDuration); 
audio.addEventListener('ended', nextSong);
progressBar.addEventListener('input', setProgress);

// Inicializar por primera vez
loadSong(currentSongIndex);
audio.volume = 0.7;
updateVolumeIcon(70);
