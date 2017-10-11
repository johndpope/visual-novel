var actions = {};
var trail = [];
var currentPage = {};
var textIndex = 0;
var story = {};

/* global $ */

actions.loadCover = function() {
    console.log('Loading cover...');

    // The load the cover page to start the story
    currentPage = story.cover;
    currentPage.isCover = true;

    // Hide all the body divs (page views) whilst updating the background
    $('body>div').hide();
    $('.start-btn').click(actions.nextPage).show();
    renderBackground('#cover').show();
};

actions.moreText = function(e) {
    if (e) { e.stopImmediatePropagation(); }
    
    if (!(currentPage.isNarrative || currentPage.isSide)) {
        return;
    }
    
    // Scroll more text if available
    if (textIndex < currentPage.text.length-1) {
        textIndex++;
        $('#prevText').css('opacity', '0.95');
        renderCharacterSprites({from: textIndex-1, to: textIndex});

        // When no more to scroll dim the more-text button
        if (textIndex == currentPage.text.length-1) {
            $('#moreText').css('opacity', '0.1');
        }
    }
    
    // Load the next text block
    $('#text').text(currentPage.text[textIndex]);
};

actions.priorText = function(e) {
    if (e) { e.stopImmediatePropagation(); }
    
    if (!(currentPage.isNarrative || currentPage.isSide)) {
        return;
    }
    
    // Scroll previous text if available
    if (textIndex > 0) {
        textIndex--;
        $('#moreText').css('opacity', '0.95');
        renderCharacterSprites({from: textIndex+1, to: textIndex});

        // When no previous to scroll dim the prev-text button
        if (textIndex == 0) {
            $('#prevText').css('opacity', '0.1');
        }
    }

    // Load the previous text block
    $('#text').text(currentPage.text[textIndex]);
};

actions.nextPage = function(e) {
    if (e) { e.stopImmediatePropagation(); }

    trackToPage(currentPage.next);
};

actions.optionA = function(e) {
    if (e) { e.stopImmediatePropagation(); }

    trackToPage(currentPage.nextA);
};

actions.optionB = function(e) {
    if (e) { e.stopImmediatePropagation(); }

    trackToPage(currentPage.nextB);
};

actions.sidePage = function(e) {
    if (e) { e.stopImmediatePropagation(); }

    trackToPage(currentPage.side);
};

function trackToPage(page) {
    console.log('Tracking page...');
    trail.push(page);
    changePage(page);
}

actions.lastPage = function(e) {
    if (e) { e.stopImmediatePropagation(); }

    trail.pop();
    var page = (trail.length > 0) ? trail[trail.length-1] : undefined;
    // console.log(trail);
    if (page !== undefined) {
        changePage(page);
    } else {
        actions.restartStory();
    }
}

function changePage(pageId) {
    console.log('Changing page... '+pageId);
    
    // Remove event handlers
    $('.start-btn').off("click");
    $('.pageTurn').off("click");
    $('.sidepage-btn').off("click");
    $('#optionA').off("click");
    $('#optionB').off("click");
    $('#restart').off("click");
    $('#credits').off("click");

    // Clear image sprites
    $('img.sprite').attr('src','');
    
    // Hide conditional elements
    $('#text').hide();
    $('#moreText').hide();
    $('#prevText').hide();
    $('.lastPage').hide();
    $('.nextPage').hide();
    $('.sidepage-btn').hide();
    $('.restart-btn').hide();
    $('.credits-btn').hide();

    // Reset the paragraph index
    textIndex = 0;
    if (pageId && pageId !== '') {
        actions.loadPage(pageId);
    } else {
        actions.restartStory();
    }
}

actions.loadPage = function(pageId) {
    console.log('Loading page...'+pageId);

    // Using the supplied page identifier, load the page (be it narrative or decision)
    var sidePage = story.sides[pageId];
    var choicePage = story.choices[pageId];
    var storyPage = story.pages[pageId];
    
    currentPage = storyPage || choicePage || sidePage;
    currentPage.id = pageId;
    
    // console.log(trail.join(' '));
    
    // Hide all the body divs (page views) whilst updating the background
    $('body>div').hide();
    
    // Load a decision page or a narrative page
    if (choicePage) {
        currentPage.isChoice = true;
        loadDecisionPage();
    } else if (sidePage) {
        currentPage.isSide = true;
        loadSidePage();
    } else {
        currentPage.isNarrative = true;
        currentPage.hasSide = (currentPage.side && currentPage.side.length > 1);
        loadNarrativePage();
    }
};

function stylesForPage(page) {
    return { "background-image": `url('./images/background/${page.background}')` };
}

function loadNarrativePage() {
    var view = $('#narrative');

    renderNarrativeText();
    renderPagingControls();
    renderTheEndControls();
    renderSidePageControls();
    renderCharacterSprites();

    renderBackground(view).show();
}

function loadSidePage() {
    var view = $('#narrative');

    renderNarrativeText();
    renderSidePageControls();    

    renderBackground(view).show();
}

function renderBookmark() {
    
    if (currentPage.isNarrative) {
        console.log('Render bookmark');
        $('#quickBookmark').click(actions.toggleBookmark).show();
        if (window.localStorage.getItem("bitsBookmark")) {
            console.log('Set bookmark');
            $('#quickBookmark').addClass('bookmark-set');
        } else {
            console.log('Clear bookmark');
            $('#quickBookmark').removeClass('bookmark-set');
        }
    }
}

function renderBackground(div) {
    
    $('#quickRestart').click(actions.restartStory).show();
    renderBookmark();
    
    return $(div).css({ "background-image": `url('./gallery/background/${currentPage.background}')` });
}

function renderNarrativeText() {

    if (currentPage.text.length > 0) {
        
        // Show first text block
        $('#text').text(currentPage.text[0]).show();
        
        // Show or hide text scroll controls
        if (currentPage.text.length > 1) {
            $('#prevText').css('opacity', '0.1').click(actions.priorText).show();
            $('#moreText').css('opacity', '0.95').click(actions.moreText).show();
        }
    }
}

function renderPagingControls() {
    
    if (currentPage.isChoice || currentPage.isNarrative) {
        $('.lastPage').click(actions.lastPage).show();
    }
    
    if (currentPage.isNarrative && currentPage.next && currentPage.next.length > 1) {
        $('.nextPage').click(actions.nextPage).show();
    }
}

function renderTheEndControls() {
    
    if (currentPage.isNarrative && !currentPage.next || currentPage.next.length == 0) {
        $('.restart-btn').click(actions.restartStory).show();
        $('.credits-btn').click(actions.showCredits).show();
    }
}

function renderSidePageControls() {

    if (currentPage.isNarrative && currentPage.hasSide) {
        $('.sidepage-btn').click(actions.sidePage).show();
    } else if (currentPage.isSide) {
        $('.sidepage-btn').click(actions.lastPage).show();
    }
}

function renderCharacterSprites(e) {
    
    if (currentPage.actions && currentPage.actions.length > 0) {
        
        // Fade out characters if leaving a scroll position
        if (e && e.from != undefined) {
            var fromPara = e.from;
            currentPage.actions.forEach(function(actor) {
                if (actor.trigger === `text:${fromPara+1}`) {
                    var isEven = fromPara%2 ? '-even' : '';
                    $(`#stage-${actor.position}${isEven}`).fadeOut(1000);
                }
            });
        }
        
        var toPara = (!e || e.to==undefined) ? 0 : e.to;
        currentPage.actions.forEach(function(actor) {
            if (actor.trigger === `text:${toPara+1}`) {
                var isEven = toPara%2 ? '-even' : '';
                $(`#stage-${actor.position}${isEven}`).hide().attr('src',`gallery/character/${actor.image}`).fadeIn(1000);
            }
        });
    }
}

function loadDecisionPage() {
    
    // Next page button
    $('.lastPage').click(actions.lastPage);

    // Set the question text
    $('#question').text(currentPage.question);
    
    // Branch A / B button choices
    $('#optionA').text(currentPage.optionA).click(actions.optionA);
    $('#optionB').text(currentPage.optionB).click(actions.optionB);

    // Let's go
    renderBackground('#decider').show();
}

actions.initStory = function() {
    $('.restart-btn').off("click");
    $('.credits-btn').off("click");

    $('body').keyup(function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        
        if (e.key == 'ArrowUp') {
            if (currentPage.isNarrative || currentPage.isSide) {
                actions.priorText(e);
            }
        } else if (e.key == 'ArrowDown') {
            if (currentPage.isNarrative || currentPage.isSide) {
                actions.moreText(e);
            }
        } else if (e.key == 'ArrowLeft') {
            if (currentPage.isChoice) {
                actions.optionA();
            } else if (currentPage.isNarrative) {
                actions.lastPage(e);
            }
        } else if (e.key == 'ArrowRight') {
            if (currentPage.isChoice) {
                actions.optionB();
            } else if (currentPage.isNarrative || currentPage.isCover) {
                actions.nextPage(e);
            }
        } else if (e.key == 'Escape') {
            if (currentPage.isNarrative && currentPage.hasSide) {
                actions.sidePage();
            } else if (currentPage.isSide) {
                actions.lastPage();
            }
        }
    });
    
    var resume = actions.restoreBookmark();

    if (resume == null) {
        actions.restartStory();
    } else {
        actions.loadStory(actions.resume);
    }
};

actions.loadStory = function(next) {
    $.getJSON("./story-data.json")
        .done(function(data) {
            story = data;
            if (next) {
                next();
            }
        })
        .fail(function(data) {
            console.error(data);
        });
};

actions.toggleBookmark = function(e) {
    if (e) { e.stopImmediatePropagation(); }

    if (typeof(Storage) !== "undefined") {
        if (!window.localStorage.getItem("bitsBookmark")) {
            window.localStorage.setItem("bitsBookmark", JSON.stringify({trail: trail, currentPage: currentPage.id }));
        } else {
            window.localStorage.removeItem("bitsBookmark");
        }
        
        renderBookmark();
    }
}

actions.restoreBookmark = function() {
    if (typeof(Storage) !== "undefined") {
        var restore = JSON.parse(window.localStorage.getItem("bitsBookmark"));
        if (restore) {
            //console.log(JSON.stringify(restore));
            trail = restore.trail;
            currentPage = { id: restore.currentPage };
            textIndex = 0;
            return currentPage;
        }
        return null;
    }
    return null;
};

actions.resume = function() {
    console.log('Resuming story...');

    if (currentPage.id) {
        changePage(currentPage.id);
    } else {
        actions.loadStory(actions.loadCover);
    }
};

actions.showCredits = function() {
    window.location.assign("/credits.html");    
}

actions.restartStory = function(e) {
    if (e) { e.stopImmediatePropagation(); }

    console.log('Restarting story...');

    // Clear breadcrumbs
    trail = [];
    textIndex = 0;
    currentPage = {};
    
    // Load the cover page
    actions.loadStory(actions.loadCover);
};