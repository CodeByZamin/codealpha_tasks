// 1. Local Track Catalog
const playlistCatalog = [
    {
        id: 0,
        title: "Coding Music",
        artist: "Neon Shifter",
        audioSrc: "music/Coding Music - No Copyright Song & MP3 Free Downloads.mp3",
        coverSrc: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=500&auto=format&fit=crop"
    },
    {
        id: 1,
        title: "Ambient Horizon",
        artist: "Solaris Echo",
        audioSrc: "music/Coding Music - No Copyright Song & MP3 Free Downloads_2.mp3",
        coverSrc: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=500&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "Cybernetic Pulse",
        artist: "Glitch Vector",
        audioSrc: "music/u_720uzce7tu-push-to-the-peak-491099.mp3",
        coverSrc: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=500&auto=format&fit=crop"
    }
];

// 2. Playback State Control
let currentTrackIndex = 0;
let isPlaying = false;

// 3. DOM Cache Registry
const audio = document.getElementById('audio-element');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

const trackArt = document.getElementById('track-art');
const albumArtWrapper = document.getElementById('album-art');
const trackTitle = document.getElementById('track-title');
const trackArtist = document.getElementById('track-artist');

const progressSlider = document.getElementById('progress-slider');
const currentTimeDisplay = document.getElementById('current-time');
const totalDurationDisplay = document.getElementById('total-duration');

const volumeSlider = document.getElementById('volume-slider');
const volumeIcon = document.getElementById('volume-icon');
const playlistTracksContainer = document.getElementById('playlist-tracks');

// 4. Initializer Process Execution
document.addEventListener('DOMContentLoaded', () => {
    generatePlaylistDOM();
    loadTrack(currentTrackIndex);
    initializeVolume();
    attachAudioEngineListeners();
});

// 5. Tracks Deployment & UI Mapping
function generatePlaylistDOM() {
    playlistTracksContainer.innerHTML = ''; // Prevent layout duplicates
    playlistCatalog.forEach((track, index) => {
        const li = document.createElement('li');
        li.classList.add('track-item');
        li.setAttribute('data-index', index);
        if (index === currentTrackIndex) li.classList.add('active');

        li.innerHTML = `
            <img src="${track.coverSrc}" alt="Thumbnail" class="playlist-thumb">
            <div class="playlist-meta">
                <h4>${track.title}</h4>
                <p>${track.artist}</p>
            </div>
            ${index === currentTrackIndex ? '<div class="playing-indicator"><i class="fas fa-volume-up"></i></div>' : ''}
        `;
        playlistTracksContainer.appendChild(li);
    });

    // Event Delegation mapping for fluid track switches inside playlist container
    playlistTracksContainer.addEventListener('click', (e) => {
        const clickedRow = e.target.closest('.track-item');
        if (clickedRow) {
            const indexTarget = parseInt(clickedRow.getAttribute('data-index'), 10);
            switchTrack(indexTarget);
        }
    });
}

function updatePlaylistUIActiveState() {
    const items = playlistTracksContainer.querySelectorAll('.track-item');
    items.forEach((item, index) => {
        // Toggle Active Classes
        if (index === currentTrackIndex) {
            item.classList.add('active');
            if (!item.querySelector('.playing-indicator')) {
                const indicator = document.createElement('div');
                indicator.classList.add('playing-indicator');
                indicator.innerHTML = '<i class="fas fa-volume-up"></i>';
                item.appendChild(indicator);
            }
            // Auto-scroll inside queue drawer if selected item goes out of perspective
            item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        } else {
            item.classList.remove('active');
            const indicator = item.querySelector('.playing-indicator');
            if (indicator) indicator.remove();
        }
    });
}

// 6. Audio Resource Allocation Methods
function loadTrack(index) {
    const currentTrack = playlistCatalog[index];
    audio.src = currentTrack.audioSrc;
    trackTitle.textContent = currentTrack.title;
    trackArtist.textContent = currentTrack.artist;
    trackArt.src = currentTrack.coverSrc;

    // Reset range bars
    progressSlider.value = 0;
    currentTimeDisplay.textContent = "00:00";

    updatePlaylistUIActiveState();
}

function switchTrack(targetIndex) {
    currentTrackIndex = targetIndex;
    loadTrack(currentTrackIndex);
    // Explicitly triggers continuous music on direct table context updates
    playMedia();
}

// 7. Playback Execution Actions
function togglePlayState() {
    if (isPlaying) {
        pauseMedia();
    } else {
        playMedia();
    }
}

function playMedia() {
    isPlaying = true;
    audio.play().then(() => {
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        albumArtWrapper.classList.add('playing');
    }).catch(error => {
        console.error("Audio execution failure details:", error);
        isPlaying = false;
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        albumArtWrapper.classList.remove('playing');
    });
}

function pauseMedia() {
    isPlaying = false;
    audio.pause();
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    albumArtWrapper.classList.remove('playing');
}

function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % playlistCatalog.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) {
        audio.play().catch(e => console.log(e));
    } else {
        // Safe play warm-up context handling
        playMedia();
    }
}

function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + playlistCatalog.length) % playlistCatalog.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) {
        audio.play().catch(e => console.log(e));
    } else {
        playMedia();
    }
}

// 8. Dynamic Time Math Translators
function formatTime(seconds) {
    if (isNaN(seconds) || !isFinite(seconds)) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSecs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
}

// 9. Audio API Core Observers
function attachAudioEngineListeners() {
    // Fired dynamically when duration values map successfully
    audio.addEventListener('loadedmetadata', () => {
        totalDurationDisplay.textContent = formatTime(audio.duration);
    });

    // Emits real-time calculations matching ongoing sound generation frame rate updates
    audio.addEventListener('timeupdate', () => {
        if (!isNaN(audio.duration) && audio.duration > 0) {
            const currentPercentage = (audio.currentTime / audio.duration) * 100;
            progressSlider.value = currentPercentage;
            currentTimeDisplay.textContent = formatTime(audio.currentTime);
        }
    });

    // Autoplay Continuation Handler
    audio.addEventListener('ended', () => {
        nextTrack();
    });
}

// 10. Peripheral Subsystem Handlers (Seeking & Volume Control)
progressSlider.addEventListener('input', () => {
    // Manual scrubber action maps directly against current internal audio pointer reference positions
    if (!isNaN(audio.duration)) {
        const seekTarget = (progressSlider.value / 100) * audio.duration;
        audio.currentTime = seekTarget;
    }
});

function initializeVolume() {
    audio.volume = volumeSlider.value / 100;
}

volumeSlider.addEventListener('input', () => {
    const rawVolumeVal = volumeSlider.value;
    audio.volume = rawVolumeVal / 100;

    // Dynamically adjust icon layout states based on volume depth levels
    if (parseInt(rawVolumeVal, 10) === 0) {
        volumeIcon.className = "fas fa-volume-mute";
    } else if (rawVolumeVal < 50) {
        volumeIcon.className = "fas fa-volume-down";
    } else {
        volumeIcon.className = "fas fa-volume-up";
    }
});

playBtn.addEventListener('click', togglePlayState);
nextBtn.addEventListener('click', nextTrack);
prevBtn.addEventListener('click', prevTrack);