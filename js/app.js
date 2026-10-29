// Cache the elements used by the layout and page-navigation code.
const elements = {
    lastName: document.getElementById("lastName"),
    pageStage: document.getElementById("pageStage"),
    pageTrack: document.getElementById("pageTrack"),
};

// Keep the content width and text size tied to the rendered hero name.
function updateLayout() {
    const rect = elements.lastName.getBoundingClientRect();

    document.documentElement.style.setProperty(
        "--contentWidth",
        rect.width + "px"
    );

    const fontSize = Math.round(rect.height * 0.175);
    document.documentElement.style.setProperty(
        "--codeTextFontSize",
        fontSize + "px"
    );
}

// Recalculate the layout when the hero name changes size, including on resize.
const layoutObserver = new ResizeObserver(updateLayout);
layoutObserver.observe(elements.lastName);
updateLayout();

// Collect the main page tabs and panels, then size the sliding page track.
const tabButtons = document.querySelectorAll(".tabButton");
const pageContent = document.querySelectorAll(".pageContent");
const pageWidthPercent = 100 / pageContent.length;

elements.pageTrack.style.width = pageContent.length * 100 + "%";
pageContent.forEach(function(page) {
    page.style.flexBasis = pageWidthPercent + "%";
});

function getPageStageHeight(page) {
    const stageStyle = getComputedStyle(elements.pageStage);
    const verticalPadding =
        parseFloat(stageStyle.paddingTop) + parseFloat(stageStyle.paddingBottom);

    // Include the stage's vertical padding so its explicit height fits the panel.
    return page.getBoundingClientRect().height + verticalPadding;
}

// Set up one independent carousel, including its controls and swipe handling.
function createCardCarousel(root) {
    const buttons = root.querySelectorAll(".cardCarouselButton");
    const carousel = {
        content: root.closest(".pageContent"),
        viewport: root.querySelector(".cardCarouselViewport"),
        track: root.querySelector(".cardCarouselTrack"),
        cards: root.querySelectorAll(".cardCarouselCard"),
        previousButton: buttons[0],
        nextButton: buttons[1],
        counter: root.querySelector(".cardCarouselCounter"),
        activeIndex: 0,
        pointerStart: null,
    };
    const cardWidthPercent = 100 / carousel.cards.length;

    // Make the track wide enough for every card and assign each card one slot.
    carousel.track.style.width = carousel.cards.length * 100 + "%";
    carousel.cards.forEach(function(card, index) {
        card.style.flexBasis = cardWidthPercent + "%";
        card.setAttribute("aria-label", (index + 1) + " of " + carousel.cards.length);
    });

    // Synchronize button states, screen-reader state, counter, and visible slide.
    function updateControls() {
        carousel.previousButton.setAttribute(
            "aria-disabled",
            carousel.activeIndex === 0 ? "true" : "false"
        );
        carousel.nextButton.setAttribute(
            "aria-disabled",
            carousel.activeIndex === carousel.cards.length - 1 ? "true" : "false"
        );
        carousel.counter.textContent =
            (carousel.activeIndex + 1) + " / " + carousel.cards.length;

        carousel.cards.forEach(function(card, index) {
            const isActive = index === carousel.activeIndex;
            card.setAttribute("aria-hidden", isActive ? "false" : "true");
            card.inert = !isActive;
        });

        carousel.track.style.transform =
            "translateX(-" + carousel.activeIndex * cardWidthPercent + "%)";
    }

    // Match the viewport and page stage to the currently selected card's height.
    function updateHeight() {
        const nextHeight =
            carousel.cards[carousel.activeIndex].getBoundingClientRect().height;
        const currentViewportHeight =
            carousel.viewport.getBoundingClientRect().height;
        const isActive = carousel.content.classList.contains("active");
        const currentStageHeight =
            elements.pageStage.getBoundingClientRect().height;
        const nextStageHeight =
            getPageStageHeight(carousel.content) +
            nextHeight -
            currentViewportHeight;

        // Set the starting height before changing the viewport, so CSS can animate.
        if (isActive) {
            elements.pageStage.style.height = currentStageHeight + "px";
        }

        carousel.viewport.style.height = nextHeight + "px";

        if (isActive) {
            elements.pageStage.style.height = nextStageHeight + "px";
        }
    }

    // Ignore attempts to move before the first card or beyond the last one.
    function setActiveCard(nextIndex) {
        if (nextIndex < 0 || nextIndex >= carousel.cards.length) {
            return;
        }

        carousel.activeIndex = nextIndex;
        updateControls();
        updateHeight();
    }

    // Let the carousel buttons move one card in either direction.
    carousel.previousButton.addEventListener("click", function() {
        setActiveCard(carousel.activeIndex - 1);
    });
    carousel.nextButton.addEventListener("click", function() {
        setActiveCard(carousel.activeIndex + 1);
    });

    // Support left/right arrow navigation when the carousel viewport has focus.
    carousel.viewport.addEventListener("keydown", function(event) {
        if (event.key === "ArrowLeft") {
            event.preventDefault();
            setActiveCard(carousel.activeIndex - 1);
        } else if (event.key === "ArrowRight") {
            event.preventDefault();
            setActiveCard(carousel.activeIndex + 1);
        }
    });

    // Remember the start of a primary pointer gesture for swipe detection.
    carousel.viewport.addEventListener("pointerdown", function(event) {
        if (!event.isPrimary || event.button !== 0) {
            return;
        }

        carousel.pointerStart = {
            id: event.pointerId,
            x: event.clientX,
            y: event.clientY,
        };
    });

    // Change cards only for a clear horizontal swipe, not a vertical scroll.
    carousel.viewport.addEventListener("pointerup", function(event) {
        if (!carousel.pointerStart || event.pointerId !== carousel.pointerStart.id) {
            return;
        }

        const distanceX = event.clientX - carousel.pointerStart.x;
        const distanceY = event.clientY - carousel.pointerStart.y;
        carousel.pointerStart = null;

        if (Math.abs(distanceX) < 50 || Math.abs(distanceX) <= Math.abs(distanceY) * 1.2) {
            return;
        }

        setActiveCard(carousel.activeIndex + (distanceX < 0 ? 1 : -1));
    });

    // Discard a swipe if the browser cancels the pointer gesture.
    carousel.viewport.addEventListener("pointercancel", function(event) {
        if (carousel.pointerStart && event.pointerId === carousel.pointerStart.id) {
            carousel.pointerStart = null;
        }
    });

    // Re-measure the card when its dimensions change, such as after text reflow.
    const resizeObserver = new ResizeObserver(updateHeight);
    carousel.cards.forEach(function(card) {
        resizeObserver.observe(card);
    });

    updateControls();
    updateHeight();
}

// Initialize the About and Projects carousels using the same behavior.
document.querySelectorAll(".cardCarousel").forEach(createCardCarousel);

// Prepare a mailto link from the validated form fields; the visitor sends it.
document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const subject = "Website contact from " + formData.get("name");
    const body = [
        "Name: " + formData.get("name"),
        "Email: " + formData.get("email"),
        "",
        "Message:",
        formData.get("message"),
    ].join("\n");

    window.location.href =
        "mailto:juho.m.hiltunen@gmail.com" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
});

// Make the animated "build" word open the Projects panel.
const projectsHeroLink = document.getElementById("purpleTypedText");
projectsHeroLink.addEventListener("click", function() {
    document.getElementById("projectsTabButton").click();
});
projectsHeroLink.addEventListener("keydown", function(event) {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        document.getElementById("projectsTabButton").click();
    }
});

// Show the current year in the footer without requiring a manual yearly edit.
document.getElementById("currentYear").textContent = new Date().getFullYear();

// Find and display the page marked active in the HTML when the site loads.
const initialPage = document.querySelector(".pageContent.active");
const initialIndex = Array.from(pageContent).indexOf(initialPage);
elements.pageTrack.style.transform =
    "translateX(-" + initialIndex * pageWidthPercent + "%)";
elements.pageStage.style.height = getPageStageHeight(initialPage) + "px";

// Switch the active page, slide the track, and animate the stage to its height.
function setActiveTab(clickedButton) {
    if (clickedButton.classList.contains("active")) {
        return;
    }

    const pageId = clickedButton.dataset.page;
    const activePage = document.getElementById(pageId);
    const nextIndex = Array.from(tabButtons).indexOf(clickedButton);
    const currentHeight = elements.pageStage.getBoundingClientRect().height;
    elements.pageStage.style.height = currentHeight + "px";

    tabButtons.forEach(function(button) {
        button.classList.remove("active");
    });

    pageContent.forEach(function(page) {
        page.classList.remove("active");
    });
    clickedButton.classList.add("active");
    activePage.classList.add("active");

    elements.pageTrack.style.transform =
        "translateX(-" + nextIndex * pageWidthPercent + "%)";

    const nextHeight = getPageStageHeight(activePage);
    elements.pageStage.style.height = nextHeight + "px";
}

// Connect every main navigation button to the page-switching function.
tabButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        setActiveTab(button);
    });
});
