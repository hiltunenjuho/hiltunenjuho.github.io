// DOM elements
const elements = {
    lastName: document.getElementById("lastName"),
    pageStage: document.getElementById("pageStage"),
};

// Update responsive layout
function updateLayout() {
    const rect = elements.lastName.getBoundingClientRect();

    const mainHeaderHeight = rect.height * 0.7;
    const headerItemHeight = mainHeaderHeight * 0.5;
    const fontSize = Math.round(headerItemHeight / 2);

    document.documentElement.style.setProperty(
        "--mainHeaderHeight",
        mainHeaderHeight + "px"
    );

    document.documentElement.style.setProperty(
        "--headerTabsetWidth",
        rect.width + "px"
    );

    document.documentElement.style.setProperty(
        "--headerItemHeight",
        headerItemHeight + "px"
    );

    document.documentElement.style.setProperty(
        "--logoSize",
        mainHeaderHeight * 0.7 + "px"
    );

    document.documentElement.style.setProperty(
        "--logoMarginLeft",
        mainHeaderHeight * 0.15 + "px"
    );

    document.documentElement.style.setProperty(
        "--codeTextFontSize",
        fontSize + "px"
    );

    document.documentElement.style.setProperty(
        "--tabButtonBorderRadius",
        Math.round(headerItemHeight / 2.4) + "px"
    );
}
const layoutObserver = new ResizeObserver(updateLayout);
layoutObserver.observe(elements.lastName);
// window.addEventListener("resize", updateLayout);
updateLayout();

// Active tab
const tabButtons = document.querySelectorAll(".tabButton");
const pageContent = document.querySelectorAll(".pageContent");

function getPageStageHeight(page) {
    const stageStyle = getComputedStyle(elements.pageStage);
    const verticalPadding =
        parseFloat(stageStyle.paddingTop) + parseFloat(stageStyle.paddingBottom);

    return page.getBoundingClientRect().height + verticalPadding;
}

const initialPage = document.querySelector(".pageContent.active");
elements.pageStage.style.height = getPageStageHeight(initialPage) + "px";

function setActiveTab(clickedButton) {
    if (clickedButton.classList.contains("active")) {
        return;
    }

    const pageId = clickedButton.dataset.page;
    const activePage = document.getElementById(pageId);
    const currentHeight = elements.pageStage.getBoundingClientRect().height;
    elements.pageStage.style.height = currentHeight + "px";

    tabButtons.forEach(function(button) {
        button.classList.remove("active");
    });
    pageContent.forEach(function(content){
        content.classList.remove("active");
    });

    clickedButton.classList.add("active");
    activePage.classList.add("active");

    const nextHeight = getPageStageHeight(activePage);
    elements.pageStage.style.height = nextHeight + "px";
}

tabButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        setActiveTab(button);
    });
});
