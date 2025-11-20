document.addEventListener("DOMContentLoaded", () => {
  initSecretForm();
  initLovePage();
});

function initSecretForm() {
  const enterButton = document.getElementById("enter-button");

  if (!enterButton) return;

  enterButton.addEventListener("click", () => {
    window.location.href = "feliz-cumple.html";
  });
}

function initLovePage() {
  const loveCard = document.querySelector(".card--love");
  const songsSection = document.querySelector(".section--songs");
  const playerWrapper = document.getElementById("audio-player-ui");
  const audioElement = document.getElementById("audio-player");
  const playerTitle = document.getElementById("player-track-title");
  const playerArtist = document.getElementById("player-track-artist");
  const btnPlay = document.getElementById("btn-play");
  const btnNext = document.getElementById("btn-next");
  const btnPrev = document.getElementById("btn-prev");
  const btnVolume = document.getElementById("btn-volume");
  const volumeContainer = document.getElementById("volume-container");
  const volumeSlider = document.getElementById("volume-slider");
  const coverImage = document.getElementById("player-cover");
  const songListContainer = document.getElementById("song-list");
  const galleryButton = document.getElementById("open-gallery");
  const galleryModal = document.getElementById("gallery-modal");
  const galleryModalBackdrop = document.getElementById("gallery-modal-backdrop");
  const galleryModalClose = document.getElementById("gallery-modal-close");
  const galleryGrid = document.getElementById("gallery-grid");
  const photoModal = document.getElementById("photo-modal");
  const photoModalImage = document.getElementById("photo-modal-image");
  const photoModalClose = document.getElementById("photo-modal-close");
  const photoModalBackdrop = document.getElementById("photo-modal-backdrop");

  if (!loveCard) return;
  // Crear ancla para poder mover el reproductor entre la tarjeta y el body
  let playerAnchor = null;
  if (playerWrapper && songsSection) {
    playerAnchor = document.createElement("div");
    playerAnchor.style.display = "none";
    songsSection.insertAdjacentElement("afterend", playerAnchor);
  }

  // Playlist configuration
  const tracks = [
    {
      id: "againstallodds",
      title: "Against All Odds",
      artist: "Phil Collins",
      src: "assets/music/againstallods.mp3",
      icon: "🎵",
    },
    {
      id: "linger",
      title: "Linger",
      artist: "The Cranberries",
      src: "assets/music/linger.mp3",
      icon: "💿",
    },
    {
      id: "somewhereonlyweknow",
      title: "Somewhere Only We Know",
      artist: "Keane",
      src: "assets/music/somewhereonlyweknow.mp3",
      icon: "⭐",
    },
    {
      id: "threelittlebirds",
      title: "Three Little Birds",
      artist: "Bob Marley",
      src: "assets/music/threelittlebirds.mp3",
      icon: "🎶",
    },
  ];

  // If audio player is not present, nothing else to do
  if (!audioElement || !playerTitle || !btnPlay || !btnNext || !btnPrev) {
    return;
  }

  let currentIndex = 0;
  let isPlaying = false;
  let songCards = [];
  const DEFAULT_VOLUME = 0.8;

  function updateVolumeIcon() {
    if (!btnVolume) return;
    const volume = audioElement.volume;
    let icon = "🔊";
    if (volume === 0) {
      icon = "🔇";
    } else if (volume < 0.4) {
      icon = "🔈";
    }
    btnVolume.textContent = icon;
  }

  if (volumeSlider) {
    const initialValue = Number(volumeSlider.value || String(DEFAULT_VOLUME * 100));
    const normalized = Math.max(0, Math.min(1, initialValue / 100));
    audioElement.volume = normalized;
    volumeSlider.value = String(Math.round(normalized * 100));
    updateVolumeIcon();

    volumeSlider.addEventListener("input", () => {
      const sliderValue = Number(volumeSlider.value || "0");
      const newVolume = Math.max(0, Math.min(1, sliderValue / 100));
      audioElement.volume = newVolume;
      updateVolumeIcon();
    });
  } else {
    audioElement.volume = DEFAULT_VOLUME;
    updateVolumeIcon();
  }

  function createSongCards() {
    if (!songListContainer) return;
    tracks.forEach((track, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "song-card";
      button.dataset.index = String(index);
      button.innerHTML = `
        <div class="song-card__icon">${track.icon}</div>
        <div class="song-card__text">
          <div class="song-card__title">${track.title}</div>
          <div class="song-card__subtitle">${track.artist}</div>
        </div>
      `;
      button.addEventListener("click", () => {
        const idx = Number(button.dataset.index || "0");
        if (idx === currentIndex && isPlaying) {
          pause();
        } else {
          loadTrack(idx);
          play();
        }
      });
      songListContainer.appendChild(button);
    });
    songCards = Array.from(songListContainer.querySelectorAll(".song-card"));
  }

  function highlightActiveSong() {
    if (!songCards.length) return;
    songCards.forEach((card, index) => {
      if (index === currentIndex) {
        card.classList.add("song-card--active");
      } else {
        card.classList.remove("song-card--active");
      }
    });
  }

  function setPlayButtonState(playing) {
    isPlaying = playing;
    btnPlay.textContent = playing ? "⏸" : "▶";
  }

  function loadTrack(index) {
    if (index < 0 || index >= tracks.length) return;
    currentIndex = index;
    const track = tracks[currentIndex];
    audioElement.src = track.src;
    playerTitle.textContent = track.title;
    if (playerArtist) {
      playerArtist.textContent = track.artist;
    }
    highlightActiveSong();
  }

  function play() {
    audioElement
      .play()
      .then(() => {
        setPlayButtonState(true);
      })
      .catch(() => {
        // Es posible que el navegador bloquee la reproducción automática
        setPlayButtonState(false);
      });
  }

  function pause() {
    audioElement.pause();
    setPlayButtonState(false);
  }

  function nextTrack() {
    const nextIndex = (currentIndex + 1) % tracks.length;
    loadTrack(nextIndex);
    play();
  }

  function prevTrack() {
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    loadTrack(prevIndex);
    play();
  }

  btnPlay.addEventListener("click", () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  });

  btnNext.addEventListener("click", () => {
    nextTrack();
  });

  btnPrev.addEventListener("click", () => {
    prevTrack();
  });

  if (btnVolume && volumeContainer) {
    btnVolume.addEventListener("click", (event) => {
      event.stopPropagation();
      const isOpen = volumeContainer.classList.toggle("audio-player__volume--open");
      if (playerWrapper) {
        if (isOpen) {
          playerWrapper.classList.add("audio-player--expanded");
        } else {
          playerWrapper.classList.remove("audio-player--expanded");
        }
      }
    });
  }

  audioElement.addEventListener("ended", () => {
    nextTrack();
  });

  createSongCards();
  loadTrack(0);
  // Intentar reproducir al entrar en la página
  play();

  // Reubicar el reproductor según el ancho (desktop dentro de la tarjeta, móvil flotando)
  function placePlayer() {
    if (!playerWrapper || !playerAnchor) return;
    if (window.innerWidth >= 900) {
      if (playerWrapper.previousElementSibling === playerAnchor) return;
      playerAnchor.insertAdjacentElement("afterend", playerWrapper);
    } else {
      if (playerWrapper.parentElement === document.body) return;
      document.body.appendChild(playerWrapper);
    }
  }

  placePlayer();
  window.addEventListener("resize", placePlayer);

  // Galería de fotos
  const photoPaths = [
    "assets/images/us/uno.jpeg",
    "assets/images/us/dos.jpeg",
    "assets/images/us/tres.jpeg",
    "assets/images/us/cuatro.jpeg",
    "assets/images/us/cinco.jpeg",
    "assets/images/us/seis.jpeg",
    "assets/images/us/siete.jpeg",
    "assets/images/us/ocho.jpeg",
    "assets/images/us/nueve.jpeg",
    "assets/images/us/diez.jpeg",
    "assets/images/us/once.jpeg",
    "assets/images/us/doce.jpeg",
    "assets/images/us/trece.jpeg",
    "assets/images/us/catorce.jpeg",
    "assets/images/us/quince.jpeg",
    "assets/images/us/dieciseis.jpeg",
    "assets/images/us/diecisiete.jpeg",
    "assets/images/us/dieciocho.jpeg",
    "assets/images/us/diecinueve.jpeg",
    "assets/images/us/veinte.jpeg",
    "assets/images/us/veintiuno.jpeg",
    "assets/images/us/veintidos.jpeg",
    "assets/images/us/veintitres.jpeg",
  ];

  if (coverImage && photoPaths.length > 0) {
    let coverIndex = 0;

    function updateCoverImage() {
      coverImage.src = photoPaths[coverIndex];
      coverIndex = (coverIndex + 1) % photoPaths.length;
    }

    updateCoverImage();
    setInterval(updateCoverImage, 60000);
  }

  // Cerrar control de volumen al hacer clic fuera
  document.addEventListener("click", (event) => {
    if (!volumeContainer || !btnVolume) return;
    if (!volumeContainer.classList.contains("audio-player__volume--open")) return;

    const target = event.target;
    if (volumeContainer.contains(target) || btnVolume.contains(target)) {
      return;
    }

    volumeContainer.classList.remove("audio-player__volume--open");
    if (playerWrapper) {
      playerWrapper.classList.remove("audio-player--expanded");
    }
  });

  if (
    galleryGrid &&
    galleryModal &&
    galleryModalBackdrop &&
    galleryModalClose &&
    photoModal &&
    photoModalImage &&
    photoModalClose &&
    photoModalBackdrop
  ) {
    photoPaths.forEach((path) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "photo-card";
      const img = document.createElement("img");
      img.src = path;
      img.alt = "Foto con papá";
      card.appendChild(img);
      card.addEventListener("click", () => {
        openPhotoModal(path);
      });
      galleryGrid.appendChild(card);
    });

    function openGalleryModal() {
      galleryModal.classList.add("gallery-modal--open");
      galleryModal.setAttribute("aria-hidden", "false");
      document.body.classList.add("body--no-scroll");
    }

    function closeGalleryModal() {
      galleryModal.classList.remove("gallery-modal--open");
      galleryModal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("body--no-scroll");
    }

    function openPhotoModal(src) {
      photoModalImage.src = src;
      photoModal.classList.add("photo-modal--open");
      photoModal.setAttribute("aria-hidden", "false");
    }

    function closePhotoModal() {
      photoModal.classList.remove("photo-modal--open");
      photoModal.setAttribute("aria-hidden", "true");
      photoModalImage.src = "";
    }

    photoModalClose.addEventListener("click", () => {
      closePhotoModal();
    });

    photoModalBackdrop.addEventListener("click", () => {
      closePhotoModal();
    });

    if (galleryButton) {
      galleryButton.addEventListener("click", () => {
        openGalleryModal();
      });
    }

    galleryModalClose.addEventListener("click", () => {
      closeGalleryModal();
    });

    galleryModalBackdrop.addEventListener("click", () => {
      closeGalleryModal();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        if (photoModal.classList.contains("photo-modal--open")) {
          closePhotoModal();
        } else if (galleryModal.classList.contains("gallery-modal--open")) {
          closeGalleryModal();
        }
      }
    });
  }
}
