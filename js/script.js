class MediaManager {
    constructor() {
        this.backgroundMusic = document.getElementById('background-music');
        this.backgroundVideo = document.getElementById('background');
        this.currentAudio = this.backgroundMusic;
        this.isMuted = true;
    }

    init() {
        if (!this.backgroundMusic || !this.backgroundVideo) return;

        this.backgroundMusic.volume = 0.3;
        this.backgroundMusic.muted = true;
        this.backgroundVideo.muted = true;

        this.backgroundMusic.load();
        this.backgroundVideo.load();

        Promise.all([
            this.backgroundVideo.play().catch(() => {}),
            this.backgroundMusic.play().catch(() => {})
        ]);
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        this.currentAudio.muted = this.isMuted;
    }

    setVolume(value) {
        this.currentAudio.volume = value;
        this.isMuted = false;
        this.currentAudio.muted = false;
    }

    switchAudio(newAudio) {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
        }
        this.currentAudio = newAudio;
        this.currentAudio.volume = this.backgroundMusic.volume;
        this.currentAudio.muted = this.isMuted;
        this.currentAudio.play().catch(() => {});
    }
}

class UIManager {
    constructor(mediaManager) {
        this.mediaManager = mediaManager;
        this.startScreen = document.getElementById('start-screen');
        this.startText = document.getElementById('start-text');
        this.profileBlock = document.getElementById('profile-block');
        this.discordActivity = document.getElementById('discord-activity');
        this.skillsBlock = document.getElementById('skills-block');
        this.resultsButton = document.getElementById('results-theme');
        this.resultsHint = document.getElementById('results-hint');
        this.volumeSlider = document.getElementById('volume-slider');
        this.transparencySlider = document.getElementById('transparency-slider');
        this.cursor = document.querySelector('.custom-cursor');
        this.profileBio = document.getElementById('profile-bio');
        this.profileName = document.getElementById('profile-name');
        this.bioMessages = [
            "Fu*k Guns.lol & Fakecrime.bio",
            "\"Hello this is snow\""
        ];
        this.bioText = '';
        this.bioIndex = 0;
        this.bioMessageIndex = 0;
        this.isBioDeleting = false;
        this.bioCursorVisible = true;
        this.name = "snow";
        this.nameText = '';
        this.nameIndex = 0;
        this.isNameDeleting = false;
        this.nameCursorVisible = true;
        this.isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
        this.isShowingSkills = false;
    }

    init() {
        this.setupCursor();
        this.setupStartScreen();
        this.setupVolumeControl();
        this.setupTransparencyControl();
        this.setupResultsButton();
        this.typeWriterBio();
        this.typeWriterName();
    }

    setupCursor() {
        if (!this.isTouchDevice) {
            document.addEventListener('mousemove', (e) => {
                this.cursor.style.left = `${e.clientX}px`;
                this.cursor.style.top = `${e.clientY}px`;
                this.cursor.style.display = 'block';
            });

            document.addEventListener('mouseleave', () => {
                this.cursor.style.display = 'none';
            });

            document.addEventListener('mouseenter', () => {
                this.cursor.style.display = 'block';
            });
        } else {
            this.cursor.style.display = 'none';
        }
    }

    setupStartScreen() {
        this.startScreen.addEventListener('click', async () => {
            this.startScreen.classList.add('hidden');
            this.mediaManager.backgroundMusic.muted = false;
            await this.mediaManager.backgroundMusic.play().catch(() => {});
            this.profileBlock.classList.remove('hidden');
            gsap.fromTo(this.profileBlock, { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' });
        });

        let startMessage = "Click to enter....";
        let startTextContent = '';
        let startIndex = 0;
        let startCursorVisible = true;

        const typeWriterStart = () => {
            if (startIndex < startMessage.length) {
                startTextContent = startMessage.slice(0, startIndex + 1);
                startIndex++;
            }
            this.startText.textContent = startTextContent + (startCursorVisible ? '|' : ' ');
            setTimeout(typeWriterStart, 100);
        };

        setInterval(() => {
            startCursorVisible = !startCursorVisible;
            this.startText.textContent = startTextContent + (startCursorVisible ? '|' : ' ');
        }, 500);

        typeWriterStart();
    }

    setupVolumeControl() {
        this.volumeSlider.addEventListener('input', () => {
            this.mediaManager.setVolume(this.volumeSlider.value);
        });
    }

    setupTransparencyControl() {
        this.transparencySlider.addEventListener('input', () => {
            const opacity = this.transparencySlider.value;
            this.profileBlock.style.background = `rgba(0, 0, 0, ${opacity})`;
            this.profileBlock.style.backdropFilter = `blur(${10 * opacity}px)`;
            this.skillsBlock.style.background = `rgba(0, 0, 0, ${opacity})`;
            this.skillsBlock.style.backdropFilter = `blur(${10 * opacity}px)`;

            if (this.discordActivity) {
                this.discordActivity.style.background = `rgba(0, 0, 0, ${opacity})`;
                this.discordActivity.style.borderRadius = '10px';
                this.discordActivity.style.backdropFilter = `blur(${10 * opacity}px)`;
            }
        });
    }

    setupResultsButton() {
        this.resultsButton.addEventListener('click', () => {
            if (!this.isShowingSkills) {
                gsap.to(this.profileBlock, {
                    x: -100,
                    opacity: 0,
                    duration: 0.5,
                    ease: 'power2.in',
                    onComplete: () => {
                        this.profileBlock.classList.add('hidden');
                        this.skillsBlock.classList.remove('hidden');
                        gsap.fromTo(this.skillsBlock, { x: 100, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' });
                        gsap.to(document.getElementById('python-bar'), { width: '67%', duration: 2, ease: 'power2.out' });
                        gsap.to(document.getElementById('html-bar'), { width: '45%', duration: 2, ease: 'power2.out' });
                        gsap.to(document.getElementById('golang-bar'), { width: '30%', duration: 2, ease: 'power2.out' });
                    }
                });
                this.resultsHint.classList.remove('hidden');
                this.isShowingSkills = true;
            } else {
                gsap.to(this.skillsBlock, {
                    x: 100,
                    opacity: 0,
                    duration: 0.5,
                    ease: 'power2.in',
                    onComplete: () => {
                        this.skillsBlock.classList.add('hidden');
                        this.profileBlock.classList.remove('hidden');
                        gsap.fromTo(this.profileBlock, { x: -100, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' });
                        gsap.to(document.getElementById('python-bar'), { width: '0%', duration: 0.5, ease: 'power2.out' });
                        gsap.to(document.getElementById('html-bar'), { width: '0%', duration: 0.5, ease: 'power2.out' });
                        gsap.to(document.getElementById('golang-bar'), { width: '0%', duration: 0.5, ease: 'power2.out' });
                    }
                });
                this.resultsHint.classList.add('hidden');
                this.isShowingSkills = false;
            }
        });
    }

    typeWriterBio() {
        if (!this.isBioDeleting && this.bioIndex < this.bioMessages[this.bioMessageIndex].length) {
            this.bioText = this.bioMessages[this.bioMessageIndex].slice(0, this.bioIndex + 1);
            this.bioIndex++;
        } else if (this.isBioDeleting && this.bioIndex > 0) {
            this.bioText = this.bioMessages[this.bioMessageIndex].slice(0, this.bioIndex - 1);
            this.bioIndex--;
        } else if (this.bioIndex === this.bioMessages[this.bioMessageIndex].length) {
            this.isBioDeleting = true;
            setTimeout(() => this.typeWriterBio(), 2000);
            return;
        } else if (this.bioIndex === 0 && this.isBioDeleting) {
            this.isBioDeleting = false;
            this.bioMessageIndex = (this.bioMessageIndex + 1) % this.bioMessages.length;
        }

        this.profileBio.textContent = this.bioText + (this.bioCursorVisible ? '|' : ' ');

        if (Math.random() < 0.1) {
            this.profileBio.classList.add('glitch');
            setTimeout(() => this.profileBio.classList.remove('glitch'), 200);
        }

        setTimeout(() => this.typeWriterBio(), this.isBioDeleting ? 75 : 150);
    }

    typeWriterName() {
        if (!this.isNameDeleting && this.nameIndex < this.name.length) {
            this.nameText = this.name.slice(0, this.nameIndex + 1);
            this.nameIndex++;
        } else if (this.isNameDeleting && this.nameIndex > 0) {
            this.nameText = this.name.slice(0, this.nameIndex - 1);
            this.nameIndex--;
        } else if (this.nameIndex === this.name.length) {
            this.isNameDeleting = true;
            setTimeout(() => this.typeWriterName(), 2000);
            return;
        } else if (this.nameIndex === 0 && this.isNameDeleting) {
            this.isNameDeleting = false;
        }

        this.profileName.textContent = this.nameText + (this.nameCursorVisible ? '|' : ' ');

        if (Math.random() < 0.1) {
            this.profileName.classList.add('glitch');
            setTimeout(() => this.profileName.classList.remove('glitch'), 200);
        }

        setTimeout(() => this.typeWriterName(), this.isNameDeleting ? 150 : 300);
    }
}

function getActivityImages(activity) {
    const largeImageUrl = activity.assets?.large_image?.startsWith("mp:external")
        ? `https://media.discordapp.net/${activity.assets.large_image.replace("mp:", "")}`
        : activity.assets?.large_image
        ? `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`
        : `https://dcdn.dstn.to/app-icons/${activity.application_id}`;

    const smallImageUrl = activity.assets?.small_image?.startsWith("mp:external")
        ? `https://media.discordapp.net/${activity.assets.small_image.replace("mp:", "")}`
        : activity.assets?.small_image
        ? `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.small_image}.png`
        : `https://dcdn.dstn.to/app-icons/${activity.application_id}`;

    return { largeImageUrl, smallImageUrl };
}

class App {
    constructor() {
        this.mediaManager = new MediaManager();
        this.uiManager = new UIManager(this.mediaManager);
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.mediaManager.init();
            this.uiManager.init();
            this.fetchDiscordActivity();
            setInterval(this.fetchDiscordActivity, 10000);
        });
    }

    async fetchDiscordActivity() {
        try {
            const res = await fetch(`https://api.lanyard.rest/v1/users/1255568617823670282`);
            if (!res.ok) throw new Error(`API request failed with status ${res.status}`);
            const data = await res.json();
            const element = document.getElementById("discord-activity");

            if (!data.success) {
                element.textContent = "Status unavailable";
                return;
            }

            const { activities, discord_status } = data.data;
            const active = activities?.find(a => a.type === 0);

            if (discord_status === "offline") {
                element.textContent = "Offline";
            } else if (active) {
                const { largeImageUrl, smallImageUrl } = getActivityImages(active);
                const startTimestamp = active.timestamps?.start;

                const calculateElapsedTime = (startTimestamp) => {
                    const now = Date.now();
                    const elapsedMs = now - startTimestamp;
                    const hours = Math.floor(elapsedMs / 3600000);
                    const minutes = Math.floor((elapsedMs % 3600000) / 60000);
                    const seconds = Math.floor((elapsedMs % 60000) / 1000);
                    return hours > 0
                        ? `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
                        : `${minutes}:${seconds.toString().padStart(2, "0")}`;
                };

                const updateElapsedTime = () => {
                    const elapsedTime = calculateElapsedTime(startTimestamp);
                    const elapsedTimeElement = document.getElementById("elapsed-time");
                    if (elapsedTimeElement) {
                        elapsedTimeElement.textContent = `Elapsed: ${elapsedTime}`;
                    }
                };

                element.innerHTML = `
                    <div style="display: flex; align-items: center; border-radius: 10px; gap: 10px; padding: 8px; border-radius: 10px; backdrop-filter: blur(5px);">
                        <div style="position: relative; width: 48px; height: 48px;">
                            <img src="${largeImageUrl}" alt="Large Image" style="width: 100%; height: 100%; border-radius: 8px;">
                            <img src="${smallImageUrl}" alt="Small Image" style="width: 16px; height: 16px; border-radius: 4px; position: absolute; bottom: 0; right: 0;">
                        </div>
                        <div>
                            <div>Playing ${active.name}${active.state ? ` (${active.state})` : ''}</div>
                            <div id="elapsed-time" style="font-size: 12px; color: rgba(255, 255, 255, 0.6);"></div>
                        </div>
                    </div>
                `;

                updateElapsedTime();
                setInterval(updateElapsedTime, 1000);
            } else {
                element.textContent = `Online (${discord_status.charAt(0).toUpperCase() + discord_status.slice(1)})`;
            }
        } catch {
            document.getElementById("discord-activity").textContent = "Status error";
        }
    }
}

const app = new App();
app.init();

document.addEventListener("DOMContentLoaded", () => {
    const profileBlock = document.getElementById("profile-block");
    const maxTilt = 15;
    const scale = 1.05;
    const speed = 400;

    if (!profileBlock) {
        console.warn("Profile block not found... tilt effect is not working.");
        return;
    }

    profileBlock.style.transformOrigin = "center";

    profileBlock.addEventListener("mousemove", (e) => {
        handleTilt(e, profileBlock, maxTilt, scale, speed);
    });

    profileBlock.addEventListener("mouseleave", () => {
        resetTilt(profileBlock, speed);
    });

    profileBlock.addEventListener("touchmove", (e) => {
        e.preventDefault();
        if (e.touches.length > 0) {
            handleTilt(e.touches[0], profileBlock, maxTilt, scale, speed);
        }
    });

    profileBlock.addEventListener("touchend", () => {
        resetTilt(profileBlock, speed);
    });

    function handleTilt(e, element, maxTilt, scale, speed) {
        const { left, top, width, height } = element.getBoundingClientRect();
        const x = ((e.clientX || e.pageX) - left) / width - 0.5;
        const y = ((e.clientY || e.pageY) - top) / height - 0.5;
        const rotateX = y * -maxTilt;
        const rotateY = x * maxTilt;
        element.style.transform = `translate(-50%, -50%) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
        element.style.transition = `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`;
    }

    function resetTilt(element, speed) {
        element.style.transform = "translate(-50%, -50%) perspective(1000px) rotateX(0) rotateY(0) scale(1)";
        element.style.transition = `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`;
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const homeButton = document.getElementById('home-theme');
    const hackerButton = document.getElementById('hacker-theme');
    const rainButton = document.getElementById('rain-theme');
    const animeButton = document.getElementById('anime-theme');
    const carButton = document.getElementById('car-theme');
    const backgroundVideo = document.getElementById('background');
    const backgroundMusic = document.getElementById('background-music');
    const hackerMusic = document.getElementById('hacker-music');
    const rainMusic = document.getElementById('rain-music');
    const animeMusic = document.getElementById('anime-music');
    const carMusic = document.getElementById('car-music');
    const hackerOverlay = document.getElementById('hacker-overlay');
    const snowOverlay = document.getElementById('snow-overlay');
    const resultsButtonContainer = document.getElementById('results-button-container');
    const profileBlock = document.getElementById('profile-block');
    const skillsBlock = document.getElementById('skills-block');
    let currentAudio = backgroundMusic;
    let isMuted = false;

    function switchTheme(videoSrc, audio, themeClass, overlay = null, overlayOverProfile = false) {
        let primaryColor;
        switch (themeClass) {
            case 'home-theme':
                primaryColor = '#00CED1';
                break;
            case 'hacker-theme':
                primaryColor = '#22C55E';
                break;
            case 'rain-theme':
                primaryColor = '#1E3A8A';
                break;
            case 'anime-theme':
                primaryColor = '#DC2626';
                break;
            case 'car-theme':
                primaryColor = '#EAB308';
                break;
            default:
                primaryColor = '#00CED1';
        }
        document.documentElement.style.setProperty('--primary-color', primaryColor);
        
        gsap.to(backgroundVideo, {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.in',
            onComplete: () => {
                backgroundVideo.src = videoSrc;

                if (currentAudio) {
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                }
                currentAudio = audio;
                currentAudio.volume = 0.3;
                currentAudio.muted = isMuted;
                currentAudio.play().catch(err => console.error("Failed to play theme music:", err));

                document.body.classList.remove('home-theme', 'hacker-theme', 'rain-theme', 'anime-theme', 'car-theme');
                document.body.classList.add(themeClass);

                hackerOverlay.classList.add('hidden');
                snowOverlay.classList.add('hidden');
                profileBlock.style.zIndex = overlayOverProfile ? 10 : 20;
                skillsBlock.style.zIndex = overlayOverProfile ? 10 : 20;
                if (overlay) {
                    overlay.classList.remove('hidden');
                }

                if (themeClass === 'hacker-theme') {
                    resultsButtonContainer.classList.remove('hidden');
                } else {
                    resultsButtonContainer.classList.add('hidden');
                    skillsBlock.classList.add('hidden');
                    profileBlock.classList.remove('hidden');
                    gsap.to(profileBlock, { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' });
                }

                gsap.to(backgroundVideo, {
                    opacity: 1,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            }
        });
    }

    homeButton.addEventListener('click', () => {
        switchTheme('background 1.mp4', backgroundMusic, 'home-theme');
    });

    hackerButton.addEventListener('click', () => {
        switchTheme('real.mp4', hackerMusic, 'hacker-theme', hackerOverlay, false);
    });

    rainButton.addEventListener('click', () => {
        switchTheme('rain_background.mp4', rainMusic, 'rain-theme', snowOverlay, true);
    });

    animeButton.addEventListener('click', () => {
        switchTheme('anime_background.mp4', animeMusic, 'anime-theme');
    });

    carButton.addEventListener('click', () => {
        switchTheme('hacker_background.mp4', carMusic, 'car-theme');
    });
});