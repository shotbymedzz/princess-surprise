const photos = [
    "img1.JPG",
    "img2.JPG",
    "img3.JPG",
    "img4.JPG",
    "img5.JPG",
    "img6.JPG",
    "img7.JPG",
    "img8.JPG"
];

const SECRET_SONG_START = 89;

document.addEventListener("DOMContentLoaded", () => {
    const welcomePage = document.getElementById("welcome-screen");
    const mainPage = document.getElementById("gallery-screen");
    const fakeOutScreen = document.getElementById("fake-out-screen");
    const secretScreen = document.getElementById("secret-screen");

    const openButton = document.getElementById("open-button");
    const continueButton = document.getElementById("continue-button");
    const goBackButton = document.getElementById("go-back-button");

    const photoGallery = document.getElementById("photo-gallery");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeLightbox = document.getElementById("close-lightbox");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");

    const yesButton = document.getElementById("yes-button");
    const absolutelyButton = document.getElementById("absolutely-button");
    const errorDialog = document.getElementById("error-dialog");
    const errorClose = document.getElementById("error-close");
    const errorOkButton = document.getElementById("error-ok-button");

    const backgroundAudio = document.getElementById("background-audio");
    const secretAudio = document.getElementById("secret-audio");

    const personalMessage = document.getElementById("personal-message");

    let currentPhotoIndex = 0;

    personalMessage.textContent =
        "Happy Birthday my beautiful beautiful princess!!! You did it, 18 years! You are the strongest, funniest prettiest, and kindest woman I have ever known. 18 years of pure determination became the greatest thing I have ever asked for. I love you so so much and I hope you enjoy!!!(also there’s a secret after this)";

    function showOnly(screen) {
        welcomePage.style.display = "none";
        mainPage.style.display = "none";
        fakeOutScreen.classList.remove("active");
        secretScreen.classList.remove("active");

        if (screen === "welcome") {
            welcomePage.style.display = "flex";
            document.body.style.overflow = "hidden";
        } else if (screen === "gallery") {
            mainPage.style.display = "block";
            document.body.style.overflow = "auto";
        } else if (screen === "fake") {
            fakeOutScreen.classList.add("active");
            document.body.style.overflow = "hidden";
        } else if (screen === "secret") {
            secretScreen.classList.add("active");
            document.body.style.overflow = "hidden";
        }
    }

    function initGallery() {
        photoGallery.innerHTML = "";

        photos.forEach((photo, index) => {
            const img = document.createElement("img");
            img.src = `images/${photo}`;
            img.alt = `Photo ${index + 1}`;
            img.addEventListener("click", () => openLightbox(index));
            photoGallery.appendChild(img);
        });
    }

    function openLightbox(index) {
        currentPhotoIndex = index;
        lightboxImg.src = `images/${photos[currentPhotoIndex]}`;
        lightbox.style.display = "block";
        document.body.style.overflow = "hidden";
    }

    function closeLightboxHandler() {
        lightbox.style.display = "none";
        document.body.style.overflow = "auto";
    }

    function navigatePhotos(direction) {
        currentPhotoIndex =
            (currentPhotoIndex + direction + photos.length) % photos.length;
        lightboxImg.src = `images/${photos[currentPhotoIndex]}`;
    }

    function startBackgroundMusic() {
        if (!backgroundAudio) return;
        backgroundAudio.loop = true;
        backgroundAudio.volume = 0.5;
        backgroundAudio.currentTime = 0;
        backgroundAudio.play().catch((error) => {
            console.warn("Background audio could not play:", error);
        });
    }

    function startSecretMusic() {
        if (backgroundAudio) {
            backgroundAudio.pause();
        }

        if (!secretAudio) return;

        secretAudio.loop = true;
        secretAudio.volume = 0.5;

        const playFromSecretTimestamp = () => {
            try {
                secretAudio.currentTime = SECRET_SONG_START;
            } catch (error) {
                console.warn("Could not seek secret audio yet:", error);
            }

            secretAudio.play().catch((error) => {
                console.warn("Secret audio could not play:", error);
            });
        };

        if (secretAudio.readyState >= 1) {
            playFromSecretTimestamp();
        } else {
            secretAudio.addEventListener("loadedmetadata", playFromSecretTimestamp, {
                once: true
            });
            secretAudio.load();
        }
    }

    function showErrorDialog() {
        errorDialog.classList.add("active");
        errorDialog.setAttribute("aria-hidden", "false");
    }

    function hideErrorDialog() {
        errorDialog.classList.remove("active");
        errorDialog.setAttribute("aria-hidden", "true");
    }

    openButton.addEventListener("click", () => {
        startBackgroundMusic();
        welcomePage.classList.add("leaving");

        setTimeout(() => {
            welcomePage.classList.remove("leaving");
            showOnly("gallery");
        }, 450);
    });

    continueButton.addEventListener("click", () => {
        showOnly("fake");
    });

    goBackButton.addEventListener("click", () => {
        showOnly("secret");
        startSecretMusic();
    });

    closeLightbox.addEventListener("click", closeLightboxHandler);
    prevBtn.addEventListener("click", (event) => {
        event.preventDefault();
        navigatePhotos(-1);
    });
    nextBtn.addEventListener("click", (event) => {
        event.preventDefault();
        navigatePhotos(1);
    });

    yesButton.addEventListener("click", showErrorDialog);
    absolutelyButton.addEventListener("click", showErrorDialog);
    errorClose.addEventListener("click", hideErrorDialog);
    errorOkButton.addEventListener("click", hideErrorDialog);

    errorDialog.addEventListener("click", (event) => {
        if (event.target === errorDialog) {
            hideErrorDialog();
        }
    });

    initGallery();
    showOnly("welcome");
});
