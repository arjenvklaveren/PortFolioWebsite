var totalHeight;
var currentHeight;
var currentHeightPercentage;

var pagesHeights = [];
var contentPages = [];
var transitionBlocks = [];

var parralaxBG;

var currentBlockID = 1;

var canTransition = true;

var currentProjectCardsPage = 1;
var maxProjectCardsPage = 1;

var hasSelectedCard;

window.onload = function() 
{
    generateTransitionBlocks();
    scrollToBottom();
    setHeightValues();
    
    parralaxBG = new ParralaxBackground();
    
    setInterval(update, 10);
    typeWriterHome();
    scrollToBottom();
};
window.onresize = function()
{
    setHeightValues();
    onExitProjectCard();
    currentProjectCardsPage = 1;
    if(parralaxBG != null) parralaxBG.resetVisuals();
    // scrollToBottom();
}
window.onbeforeunload = function () 
{
    scrollToBottom();
};

function setHeightValues()
{
    totalHeight = document.body.scrollHeight;
    var pages = document.getElementsByClassName("contentPage");
    for (var i = 0; i < pages.length; i++) {
        pagesHeights[i] = pages[i].offsetTop;
        contentPages[i] = pages[i];
    }
    pagesHeights[4] = 999999999;
}

function scrollToBottom()
{
    window.scrollTo(0, 999999);
}

function generateTransitionBlocks()
{
    //set random height of transition blocks
    var blocks = document.getElementsByClassName("transitionBlock");
    for (var i = 0; i < blocks.length; i++) {
        var randomHeight = Math.floor(Math.random() * (12000 - 4000 + 1)) + 4000;
        blocks[i].style.height = randomHeight + "px";
        transitionBlocks[i] = blocks[i];
    }
}

function setContentPageHeight()
{
    if(!isMobileDevice() || !canTransition) return;

    var pages = document.getElementsByClassName("contentPage");
    for (var i = 0; i < pages.length; i++) {
        pages[i].setAttribute('style', 'height: ' + window.innerHeight + 'px !important');
    }
    document.getElementById('sideNavBarDiv').setAttribute('style', 'height: ' + window.innerHeight + 'px !important');

    setHeightValues();
}

function typeWriterHome()
{
    var texts = [];

    const allElements = document.getElementsByClassName('typewriter');
    for(var i = 0; i < allElements.length; i++)
    {
        texts[i] = allElements[i].textContent;
        allElements[i].innerHTML = "";
        allElements[i].style.borderRight = "solid white 4px";
        allElements[i].style.animation = "blinkCaret 1s infinite";
    }
    
    let paragraphIndex = 0;
    let charIndex = 0;

    function type() {
        const element = allElements[paragraphIndex];
        const currentText = texts[paragraphIndex]; 
        element.innerHTML = currentText.slice(0, charIndex) + "&nbsp;";

        charIndex++;

        if (charIndex <= currentText.length) {
            setTimeout(type, 75);
        } else {
            allElements[paragraphIndex].style.borderRight = "none";
            allElements[paragraphIndex].style.animation = "none";
            paragraphIndex++;
            charIndex = 0;

            if (paragraphIndex < texts.length) {
            setTimeout(type, 500);
            }
        }
    }
    type();
}

function setNavRocket()
{
    var navRocket = document.getElementById("navRocket");

    currentHeight = Math.ceil(document.documentElement.scrollTop);

    var currentTopPageHeight = 0;
    var currentBotttomPageHeight = 0;
    
    currentHeightPercentage = (currentHeight /  totalHeight) * 100;
    currentHeightPercentage = currentHeightPercentage.toFixed(2);

    for (var i = 0; i < 4; i++) {
        if(currentHeight >= pagesHeights[i] && currentHeight < pagesHeights[i + 1])
        {
            currentTopPageHeight = pagesHeights[i];
            currentBotttomPageHeight = pagesHeights[i + 1];
            currentBlockID = i + 1;
        }
    }

    var currentPageHeightPercentage = (currentHeight - currentTopPageHeight) / (currentBotttomPageHeight - currentTopPageHeight) * 100;

    var navRocketHeight = currentPageHeightPercentage;

    var lowerPerOffset = -12.5 + (25 * currentBlockID);
    var higherPerOffset = lowerPerOffset + 25;

    navRocketHeight = ((navRocketHeight - 0) / (100 - 0)) * (higherPerOffset - lowerPerOffset) + lowerPerOffset;
    navRocket.style.top = navRocketHeight + "%"; 
}

function setContentRocket()
{
    var fixedNavBar = document.getElementById('headerNavBar');
    var sampleID = (currentBlockID == 1) ? 2 : 0;
    var sampleNavBar = document.getElementsByClassName("contentTopBar")[sampleID];
    fixedNavBar.style.width = sampleNavBar.getBoundingClientRect().width + 'px';

    var navMiddle = document.getElementById("headerNavBarMainCentre");
    var contentRocket = document.getElementById("contentRocket");
    var rect = navMiddle.getBoundingClientRect();

    contentRocket.style.left = rect.left + "px";
    contentRocket.style.top = rect.top + "px";
    contentRocket.style.width = rect.width + "px";
    contentRocket.style.height = rect.height + "px";
}

function goToNavPage(pageID)
{
    if(pageID == currentBlockID - 1) return;
    if(canTransition) window.scrollTo(0, pagesHeights[pageID] + 1);
    if(pageID != 0) document.getElementById("contentRocket").style.animation = "rocketClickAble 4s infinite";
    else document.getElementById("contentRocket").style.animation = "none";
    parralaxBG.resetVisuals();
}

async function scrollToNextPage()
{
    if(!canTransition) return;
    if(currentBlockID == 1)
    {
        //Do custom stuff if at end of scroll(?)
        console.log("END OF WEBSITE");
        return;
    }

    canTransition = false;

    var scrollSpeed = 40;

    var startPos = pagesHeights[currentBlockID - 1];
    var endPos = pagesHeights[currentBlockID - 2] + 1;

    var contentRocket = document.getElementById("contentRocket");
    var transitionTime = 2;
    
    contentRocket.style.animation = "rocketOut " + transitionTime + "s";
    contentRocket.style.animationFillMode = "forwards";

    var currentFade = contentPages[currentBlockID - 1].getElementsByClassName('contentPageWrapper');
    var nextFade = contentPages[currentBlockID - 2].getElementsByClassName('contentPageWrapper');

    $(currentFade).animate({opacity: 0.0}, 500, 'linear');
    $(nextFade).css('opacity', 0);

    await new Promise(resolve => setTimeout(resolve, 500));

    for(var i = startPos; i > endPos; i -= scrollSpeed)
    {
        window.scrollTo(0, i);
        parralaxBG.updateVisuals();
         
        await new Promise(resolve => setTimeout(resolve, 10));
    }   
    window.scrollTo(0, endPos);
    contentRocket.style.animation = "rocketIn " + transitionTime + "s";

    await new Promise(resolve => setTimeout(resolve, 1500));

    $(currentFade).css('opacity', 1.0);
    $(nextFade).animate({opacity: 1.0}, 500, 'linear');

    await new Promise(resolve => setTimeout(resolve, 1000));
    canTransition = true;
    contentRocket.style.animation = "rocketClickAble 4s infinite";
}

function setProjectCards()
{
     if(hasSelectedCard) return;

    var cardsContainer = document.getElementById('projectsCardsDiv');
    var projectCards = [];
    var maxCardsPerPage;

    projectCards = cardsContainer.getElementsByClassName('projectCard');

    //get height and width values of box and cards
    projectCards[0].style.display = "block";
    var cardHeight = $(projectCards[0]).outerHeight(true);
    var cardWidth = $(projectCards[0]).outerWidth(true);
    var containerBox = cardsContainer.getBoundingClientRect();
    projectCards[0].style.display = "none";

    //set height of container
    cardsContainer.style.height = (document.getElementById('contentProjectWrapper').offsetHeight - document.getElementById('projectsNavDiv').offsetHeight) + "px";

    //calculate how many cards fit 
    var wrapperHorFit = Math.floor(containerBox.width / cardWidth);
    var wrapperVertFit = Math.floor(containerBox.height / cardHeight);
    var totalWrapperfit = wrapperHorFit * wrapperVertFit;

    maxCardsPerPage = totalWrapperfit;
    maxProjectCardsPage = Math.ceil(projectCards.length / maxCardsPerPage);
    
    //set visible cards based on current page
    for(var i = 0; i <= projectCards.length - 1; i++)
    {
        if(i >= (currentProjectCardsPage - 1) * maxCardsPerPage && i < maxCardsPerPage * currentProjectCardsPage)
        {
            projectCards[i].style.display = "block";
        }
        else{
            projectCards[i].style.display = "none";
        }
    }
    document.getElementById('projectsCardsPageText').innerHTML = currentProjectCardsPage + " of " + maxProjectCardsPage;  
}

function projectsNextPage()
{
    if(currentProjectCardsPage < maxProjectCardsPage) currentProjectCardsPage++;

    document.getElementsByClassName('cardPageArrow')[0].style.opacity = 1;
    if(currentProjectCardsPage == maxProjectCardsPage) document.getElementsByClassName('cardPageArrow')[1].style.opacity = 0;
}
function projectsPreviousPage()
{
    if(currentProjectCardsPage > 1) currentProjectCardsPage--;

    document.getElementsByClassName('cardPageArrow')[1].style.opacity = 1;
    if(currentProjectCardsPage == 1) document.getElementsByClassName('cardPageArrow')[0].style.opacity = 0;
}

function onClickProjectCard(cardContentID)
{
    var allProjectCardContent =  document.getElementsByClassName('projectCardContent');
    var currentSelectedCard = allProjectCardContent[cardContentID - 1];

    var contentWrapper = document.getElementById('projectsMainDiv');
    var contentWrapperBox = contentWrapper.getBoundingClientRect();

    currentSelectedCard.setAttribute('style', 'display:flex !important');
    currentSelectedCard.style.position = "absolute";
    currentSelectedCard.style.width = (contentWrapper.offsetWidth + 1) + 'px';
    currentSelectedCard.style.height = contentWrapper.offsetHeight+ 'px';;
    currentSelectedCard.style.left = contentWrapperBox.left +'px';
    currentSelectedCard.style.top = (contentWrapperBox.top - 1) + 'px';

    hasSelectedCard = true;
}
function onExitProjectCard()
{
    var allProjectCardContent = document.getElementsByClassName('projectCardContent');
    for(var i = 0; i < allProjectCardContent.length; i++)
    {
        allProjectCardContent[i].style.width = 0 + 'px';
        allProjectCardContent[i].style.height = 0 + 'px';
        allProjectCardContent[i].setAttribute('style', 'display:none !important');
    }
    hasSelectedCard = false;
}

function blockLandscape()
{
    if(isMobileDevice() == true)
    {
        if(screen.availHeight < screen.availWidth){
            alert("Landscape mode under construction. Please rotate your device into portrait mode");
        }
    }
    else if(screen.availHeight < 500)
    {
        alert("Small window height compatibility under construction. Please resize your window");
    }
}

function update()
{
    setNavRocket();
    setContentRocket();
    setProjectCards();
    setContentPageHeight();
    blockLandscape();
}

class ParralaxBackground
{
    #imageVisuals = [];
    #folderPath = 'Images/TransitionRandom/';
    #imageArray = ['image1.png', 'image2.png', 'image3.png'];

    #container = document.getElementById('parralaxBackground');
    #blockRect = this.#container.getBoundingClientRect();

    #startImgCount = 5 + (window.innerWidth / 50);

    #randSeed = "Parralax";
    #random = new Math.seedrandom(this.#randSeed);

    constructor()
    {
        this.#fillFullArea();
    }

    #fillFullArea()
    {
        for(var i = 0; i < this.#startImgCount; i++)
        {
            this.createNewVisual();
        }
    }

    updateVisuals()
    {
        const styleChanges = [];
        for(var i = 0; i < this.#imageVisuals.length; i++)
        {   
            var currentTop = parseInt(this.#imageVisuals[i].style.top) || 0;
            if(currentTop >= 0) 
            { 
                var size = parseInt(this.#imageVisuals[i].style.width) || 0;
                styleChanges.push({index: i, top: currentTop + 5 + ((size * size) / 20), });  
            }
            else
            {
                styleChanges.push({index: i,top: this.#container.getBoundingClientRect().height,});
            }
            if(currentTop > this.#container.getBoundingClientRect().height)
            {
                var newWidth = Math.floor(this.#random() * this.#blockRect.width);
                styleChanges.push({index: i, top: 0, left: newWidth});
            }
        }
        for (const change of styleChanges) {
            this.#imageVisuals[change.index].style.top = change.top + 'px';
            if(change.left != null) this.#imageVisuals[change.index].style.left = change.left + 'px';
        }
    }

    createNewVisual()
    {
        var image = document.createElement('img');
    
        var randomImg = Math.floor(this.#random() * this.#imageArray.length); 

        image.src = this.#folderPath + this.#imageArray[Math.floor(randomImg)];

        image.style.position = "absolute";

        var imageSize = Math.floor(this.#random() * (20 - 2 + 1) + 2);     
        image.style.width = imageSize + "px";
        image.style.height = imageSize + "px";

        var widthOffset = Math.floor(this.#random() * this.#blockRect.width - imageSize);
        var heightOffset = Math.floor(this.#random() * this.#blockRect.height - imageSize);
        image.style.left = widthOffset + "px";
        image.style.top = heightOffset + "px";

        this.#container.appendChild(image);
        this.#imageVisuals.push(image);
    }

    resetVisuals()
    {
        this.#startImgCount = 10 + (window.innerWidth / 50);
        this.destroyVisuals();
        this.#fillFullArea();
    }

    destroyVisuals()
    {
        for(var i = 0; i < this.#imageVisuals.length; i++)
        {
            this.#imageVisuals[i].remove();
        }
        this.#imageVisuals = [];
    }
}

function isMobileDevice() {
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return mobileRegex.test(navigator.userAgent);
  }
  
