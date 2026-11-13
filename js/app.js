// Cache the elements used by the layout and page-navigation code.
const elements = {
    lastName: document.getElementById("lastName"),
    hero: document.getElementById("heroElement"),
    heroInner: document.getElementById("heroContainer"),
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
const homeHighlights = document.getElementById("homeHighlights");
const pageWidthPercent = 100 / pageContent.length;
const homeHighlightItems = homeHighlights.querySelectorAll(".homeHighlightItem");
let pageStageAnimationFrame = null;
let heroLayoutTimeout = null;
let heroStageTransitionHandler = null;
const homeHighlightObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (!entry.isIntersecting) {
            return;
        }

        entry.target.classList.add("is-in-view");
        entry.target.inert = false;
        homeHighlightObserver.unobserve(entry.target);
    });
}, {
    threshold: 0.16,
    rootMargin: "0px 0px -8% 0px",
});

elements.pageTrack.style.width = pageContent.length * 100 + "%";
pageContent.forEach(function(page) {
    page.style.flexBasis = pageWidthPercent + "%";
});
homeHighlightItems.forEach(function(item) {
    item.inert = true;
    homeHighlightObserver.observe(item);
});

function getPageStageHeight(page) {
    return page.getBoundingClientRect().height;
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

// Keep the Home highlights available on every page and reveal them as they enter view.
function showHomeHighlights() {
    homeHighlights.hidden = false;
    homeHighlights.inert = false;
    homeHighlights.removeAttribute("aria-hidden");
    homeHighlights.classList.add("is-visible");

    homeHighlightItems.forEach(function(item) {
        if (!item.classList.contains("is-in-view")) {
            item.inert = true;
            homeHighlightObserver.observe(item);
        }
    });
}

document.getElementById("scrollCue").addEventListener("click", function(event) {
    event.preventDefault();
    homeHighlights.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
        block: "start",
    });
});

function cancelHeroLayoutRelease() {
    if (heroLayoutTimeout !== null) {
        clearTimeout(heroLayoutTimeout);
        heroLayoutTimeout = null;
    }

    if (heroStageTransitionHandler !== null) {
        elements.pageStage.removeEventListener("transitionend", heroStageTransitionHandler);
        heroStageTransitionHandler = null;
    }
}

function releaseHeroLayout() {
    cancelHeroLayoutRelease();
    elements.hero.style.removeProperty("height");
    elements.hero.style.removeProperty("min-height");
    elements.hero.style.removeProperty("flex");
    elements.hero.style.removeProperty("justify-content");
    elements.hero.style.removeProperty("transition");
    elements.heroInner.style.removeProperty("transition");
    elements.heroInner.style.removeProperty("transform");
}

// Find and display the page marked active in the HTML when the site loads.
const initialPage = document.querySelector(".pageContent.active");
const initialIndex = Array.from(pageContent).indexOf(initialPage);
elements.pageTrack.style.transform =
    "translateX(-" + initialIndex * pageWidthPercent + "%)";
elements.pageStage.style.height =
    initialPage.id === "homeContent" ? "0px" : getPageStageHeight(initialPage) + "px";
document.querySelector("main.production").classList.toggle(
    "home-view",
    initialPage.id === "homeContent"
);
showHomeHighlights();

// Switch the active page, slide the track, and animate the stage to its height.
function setActiveTab(clickedButton) {
    if (clickedButton.classList.contains("active")) {
        return;
    }

    const pageId = clickedButton.dataset.page;
    const activePage = document.getElementById(pageId);
    const previousPage = document.querySelector(".pageContent.active");
    const nextIndex = Array.from(tabButtons).indexOf(clickedButton);
    const isHomePage = activePage.id === "homeContent";
    const wasHomePage = previousPage.id === "homeContent";
    const shouldPreserveHeroLayout = isHomePage || wasHomePage;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const shouldAnimateHero = shouldPreserveHeroLayout && !prefersReducedMotion;
    const currentHeroRect = elements.hero.getBoundingClientRect();
    const currentInnerRect = elements.heroInner.getBoundingClientRect();
    const currentInnerOffset = currentInnerRect.top - currentHeroRect.top;
    const heroHeight = currentHeroRect.height + "px";
    let targetHeroHeight = null;
    if (isHomePage || document.querySelector(".pageContent.active").id === "homeContent") {
        window.scrollTo({ top: 0, behavior: "auto" });
    }

    if (shouldAnimateHero) {
        cancelHeroLayoutRelease();
        elements.hero.style.transition = "none";
        elements.hero.style.height = heroHeight;
        elements.hero.style.minHeight = heroHeight;
        elements.hero.style.flex = "0 0 auto";
        elements.hero.style.justifyContent = "flex-start";
        elements.heroInner.style.transition = "none";
        elements.heroInner.style.transform = "translateY(" + currentInnerOffset + "px)";
    }

    const currentHeight = elements.pageStage.getBoundingClientRect().height;
    document.querySelector("main.production").classList.toggle("home-view", isHomePage);
    elements.pageStage.style.height = currentHeight + "px";

    tabButtons.forEach(function(button) {
        button.classList.remove("active");
    });

    pageContent.forEach(function(page) {
        page.classList.remove("active");
    });
    clickedButton.classList.add("active");
    activePage.classList.add("active");
    const nextHash = clickedButton.id === "contactTabButton" ? "#contact" : "";
    if (window.location.hash !== nextHash) {
        window.history.replaceState(
            null,
            "",
            window.location.pathname + window.location.search + nextHash
        );
    }
    if (homeHighlights.contains(document.activeElement)) {
        clickedButton.focus();
    }
    elements.pageTrack.style.transform =
        "translateX(-" + nextIndex * pageWidthPercent + "%)";

    let nextHeight = 0;
    let targetInnerOffset = 0;
    if (!isHomePage) {
        nextHeight = getPageStageHeight(activePage);
        if (shouldAnimateHero) {
            elements.hero.style.removeProperty("height");
            elements.hero.style.removeProperty("min-height");
            elements.hero.style.removeProperty("flex");
            elements.hero.style.removeProperty("justify-content");
            targetHeroHeight = elements.hero.getBoundingClientRect().height;
            elements.hero.style.height = heroHeight;
            elements.hero.style.minHeight =
                Math.min(currentHeroRect.height, targetHeroHeight) + "px";
            elements.hero.style.flex = "0 0 auto";
            elements.hero.style.justifyContent = "flex-start";
        }
    } else if (shouldAnimateHero) {
        elements.hero.style.removeProperty("min-height");
        targetHeroHeight = parseFloat(getComputedStyle(elements.hero).minHeight);
        const innerHeight = elements.heroInner.getBoundingClientRect().height;
        targetInnerOffset = Math.max(0, (targetHeroHeight - innerHeight) / 2);
        elements.hero.style.minHeight = heroHeight;
    }

    if (shouldAnimateHero) {
        elements.heroInner.getBoundingClientRect();
    }

    if (pageStageAnimationFrame !== null) {
        cancelAnimationFrame(pageStageAnimationFrame);
    }

    if (prefersReducedMotion) {
        elements.pageStage.style.height = nextHeight + "px";
        if (shouldPreserveHeroLayout || heroLayoutTimeout !== null) {
            releaseHeroLayout();
        }
    } else {
        pageStageAnimationFrame = requestAnimationFrame(function() {
            if (shouldAnimateHero) {
                elements.hero.style.transition =
                    "height .7s cubic-bezier(.4, 0, .2, 1)";
                elements.hero.style.height = targetHeroHeight + "px";
                elements.heroInner.style.transition =
                    "transform .7s cubic-bezier(.4, 0, .2, 1)";
                elements.heroInner.style.transform = "translateY(" + targetInnerOffset + "px)";
            }
            elements.pageStage.style.height = nextHeight + "px";
            pageStageAnimationFrame = null;
        });

        if (shouldAnimateHero) {
            heroStageTransitionHandler = function(event) {
                if (event.target !== elements.pageStage || event.propertyName !== "height") {
                    return;
                }

                releaseHeroLayout();
            };
            elements.pageStage.addEventListener("transitionend", heroStageTransitionHandler);
            heroLayoutTimeout = window.setTimeout(releaseHeroLayout, 800);
        }
    }
}

// Connect every main navigation button to the page-switching function.
tabButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        setActiveTab(button);
    });
});

// Deep-link the Contact tab so external project links can open it directly.
function activateContactHash() {
    if (window.location.hash === "#contact") {
        document.getElementById("contactTabButton").click();
    }
}
window.addEventListener("hashchange", activateContactHash);
activateContactHash();

// Route Home highlight actions through the same tab behavior as main navigation.
document.querySelectorAll("[data-target-tab]").forEach(function(button) {
    button.addEventListener("click", function() {
        document.getElementById(button.dataset.targetTab).click();
    });
});
