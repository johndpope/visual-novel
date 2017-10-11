/* global $ */

var editor = {};

editor.story = {};
editor.gallery = { background: [], character: [] };

var asImageOptions = function(c) {
    return `<option value="${c}">${c}</option>`;
};

var asImageThumbs = function(c) {
    return `<div class="col-sm-4 text-center thumbcell"><div class="thumb-border ${this}" data-image="${c}"><span>${c}</span><img class="thumbnail" src="../gallery/${this}/${c}" /></div></div>`;
};

var asPageOptions = function(p) {
    return `<option value="${p.id}">${p.title}</option>`;
};

var asOptionGroups = function(g) {
    return `<optgroup label="${g.label}">${g.options}</optgroup>`;
};

var coverListItem = function(c) {
    var content = `<img src='images/cover-icon.png' class='pull-left list-icons'/><span class="lead">Cover Page</span>`
    return `<a href="#" class="list-group-item cover-list-item">${content}</a>`;
};

var pageListItem = function(p) {
    var target = findPage(p.next);
    var dest = target ? target.title : p.next;
    var icon = `<img src='images/${p.next ? 'page':'end'}-icon.png' class='pull-left list-icons'/>`;
    var title = `<span class="lead">${p.title}</span>`;
    var thumb = `<img src='../gallery/background/${p.background}' class='list-thumb'/>`;
    return `<a href="#" class="list-group-item page-list-item" data-id="${p.id}">${icon}${thumb}${title}<span class="badge linkPage">${dest}</span></a>`;
};

var choiceListItem = function(p) {
    var targetA = findPage(p.nextA);
    var targetB = findPage(p.nextB);
    var destA = targetA ? targetA.title : p.nextA;
    var destB = targetB ? targetB.title : p.nextB;
    var icon = `<img src='images/choice-icon.png' class='pull-left list-icons'/>`;
    var title = `<span class="lead">${p.title}</span>`;
    var thumb = `<img src='../gallery/background/${p.background}' class='list-thumb'/>`;
    return `<a href="#" class="list-group-item choice-list-item" data-id="${p.id}">${icon}${thumb}${title}<span class="badge linkPage">${destA}</span><span class="badge linkPage">${destB}</span></a>`;
};

var sideListItem = function(p) {
    var icon = `<img src='images/sidebar-icon.png' class='pull-left list-icons'/>`;
    var title = `<span class="lead">${p.title}</span>`;
    var thumb = `<img src='../gallery/background/${p.background}' class='list-thumb'/>`;
    return `<a href="#" class="list-group-item side-list-item" data-id="${p.id}">${icon}${thumb}${title}</a>`;
};

var actionIcon = function(a,i) {
    var content = `<img src='../gallery/character/${a.image}' class='pull-left action-icon' title='When ${a.trigger}\nat ${a.position}\nshow ${a.image}' />`;
    return `<a href="#" data-position="${i}" class="action-icon-remove">${content}</a>`;
};

editor.loadStory = function(story) {
    if (!story) {
        $.getJSON("/data/")
            .done(function(data) {
                editor.story = data;
                editor.setupStory();
            })
            .fail(function(data) {
                console.error(data);
            });
    } else {
        editor.story = story;
        editor.setupStory();
    }
};

editor.setupStory = function() {
    // Set page image selection options
    $('#add-page-image').empty().append('<option></option>'+editor.gallery.background.map(asImageOptions).join(''));
    $('#edit-page-image').empty().append('<option></option>'+editor.gallery.background.map(asImageOptions).join(''));
    $('#add-action-image').empty().append('<option></option>'+editor.gallery.character.map(asImageOptions).join(''));
    
    // Load pages list
    var pages = Object.keys(editor.story.pages).map(id=>editor.story.pages[id]);
    var choices = Object.keys(editor.story.choices).map(id=>editor.story.choices[id]);
    var sides = Object.keys(editor.story.sides).map(id=>editor.story.sides[id]);
    //pages = pages.sort(function(a,b) { return (a.next?0:1)-(b.next?0:1); });
    $('#page-list-items').empty()
        .append(coverListItem(editor.story.cover))
        .append(pages.map(pageListItem))
        .append(choices.map(choiceListItem))
        .append(sides.map(sideListItem));
    
    var nextPageOptions = [];
    var sidePageOptions = [];
    nextPageOptions.push({ 'label': 'Narration', 'options': pages.map(asPageOptions).join('') });
    nextPageOptions.push({ 'label': 'Choice', 'options': choices.map(asPageOptions).join('') });
    sidePageOptions.push({ 'label': 'Side', 'options': sides.map(asPageOptions).join('') });

    $('.next-page-select').empty()
        .append('<option />')
        .append(nextPageOptions.map(asOptionGroups));

    $('.side-page-select').empty()
        .append('<option />')
        .append(sidePageOptions.map(asOptionGroups));

    // Add page list item event listeners
    $('.cover-list-item').click("cover", editor.openEditPage);
    $('.page-list-item').click("page", editor.openEditPage);
    $('.choice-list-item').click("choice", editor.openEditPage);
    $('.side-list-item').click("sidebar", editor.openEditPage);
};

editor.loadGallery = function() {
    $.getJSON("/gallery")
        .done(function(data) {
            editor.gallery = data;
            editor.setupGallery();
            editor.loadStory();
        })
        .fail(function(data) {
            console.error(data);
        });
};

editor.setupGallery = function() {
    $('#background-image-grid').empty().append(editor.gallery.background.map(asImageThumbs, "background"));
    $('#character-image-grid').empty().append(editor.gallery.character.map(asImageThumbs, "character"));
    $('.thumb-border.background').click("background", editor.removeGalleryImage);
    $('.thumb-border.character').click("character", editor.removeGalleryImage);
};

editor.removeGalleryImage = function(e) {
    console.log(e);
    e.stopImmediatePropagation();
    var image = e.currentTarget.dataset.image;

    // Send to server (ignore response)
    $.ajax({
      url: `/gallery/${e.data}/${image}`,
      method: "DELETE"
    }).done(function(res) {
        editor.loadGallery();
    });
};

editor.updateImagePreview = function(e) {
    var image = (e.currentTarget.value != '') ? `../gallery/background/${e.currentTarget.value}` : 'images/missing-image.png';
    $(`#${e.data}-page-image-preview`).attr('src', image);

};

editor.titleCase = function(e) {
    if (e.target.value.length > 0 && e.key>='a' && e.key <='z') {
        e.target.value = e.target.value.toTitleCase();
    } else {
        console.log(e.key);
    }
};

function idFromTitle(title) {
    return title.toLowerCase().replace(/[\s]+/g,'-').replace(/[^a-z0-9-]+/g,'');    
}

// Extend String for title case support
String.prototype.toTitleCase = function() {
    return (this.toString()==undefined || this.toString().trim().length==0)
        ? this.toString()
        : this
            .split(' ').map(function(w) {
                var x = w.trim();
                if (x.length <2) {
                    return w;
                }
                return x[0].toUpperCase() + x.slice(1);
                })
            .join(' ');
};

editor.openAddPage = function(e) {
    // Hide Add page/choice/sidebar Controls
    $('#add-page-controls').hide();
    $('#add-page-heading').text(`Add ${e.data.toTitleCase()}`);

    // Hide List
    $('#page-list').hide();

    // Show Add form
    $('#form-add-page').removeClass('hidden');
    $('#add-page-type').val(e.data);

    // Selectively display appropriate fields for page/choice/sidebar mode
    editor.showAppropriateFields(e.data);
};

editor.savePage = function(e) {
    e.preventDefault();

    var id = idFromTitle($('#add-page-title').val());
    var pageType = $('#add-page-type').val();
    
    if (pageType === "page") {
        var newPage = {
            id: id,
            background: $('#add-page-image').val(),
            title: $('#add-page-title').val(),
            text: $('#add-page-text').val(),
            next: $('#add-page-next').val(),
            side: $('#add-page-side').val(),
            actions: []
        };
        $.post("/addPage", newPage, editor.loadStory);

    } else if (pageType === "choice") {
        var newChoicePage = {
            id: id,
            background: $('#add-page-image').val(),
            title: $('#add-page-title').val(),
            question: $('#add-page-question').val(),
            optionA: $('#add-page-choice-a').val(),
            optionB: $('#add-page-choice-b').val(),
            nextA: $('#add-page-next-a').val(),
            nextB: $('#add-page-next-b').val(),
            side: $('#add-page-side').val()
        };
        $.post("/addChoice", newChoicePage, editor.loadStory);

    } else if (pageType === "sidebar") {
        var newSide = {
            id: id,
            background: $('#add-page-image').val(),
            title: $('#add-page-title').val(),
            text: $('#add-page-text').val(),
            next: null
        };
        $.post("/addSide", newSide, editor.loadStory);
    }

    e.currentTarget.reset();
    $('#add-page-image').trigger("change");
    
    $('#form-add-page').addClass('hidden');
    $('#add-page').show();


    editor.cancelAddPage();
};

editor.cancelAddPage = function(e) {
    // Reset and hide add view
    $('#form-add-page').trigger("reset");
    $('#add-page-image').trigger("change");
    $('#form-add-page').addClass('hidden');
    
    // Redisplay list and controls
    $('#page-list').show();
    $('#add-page-controls').show();
};

editor.showAppropriateFields = function(pageType) {
    
    if (pageType === "cover") {
        $('.hide-choice').show();
        $('.hide-sidebar').show();
        $('.hide-page').show();
        $('.hide-cover').hide();
    } else if (pageType === "page") {
        $('.hide-choice').show();
        $('.hide-sidebar').show();
        $('.hide-cover').show();
        $('.hide-page').hide();
    } else if (pageType === "choice") {
        $('.hide-page').show();
        $('.hide-sidebar').show();
        $('.hide-cover').show();
        $('.hide-choice').hide();
    } else {
        $('.hide-page').show();
        $('.hide-choice').show();
        $('.hide-cover').show();
        $('.hide-sidebar').hide();
    }
};

editor.openEditPage = function(e) {
    // Hide Add page/choice/sidebar Controls
    $('#add-page-controls').hide();
    $('#edit-page-heading').text(`Edit ${e.data.toTitleCase()}`);

    // Hide List
    $('#page-list').hide();

    // Show Edit form
    $('#form-edit-page').removeClass('hidden');
    $('#edit-page-type').val(e.data);

    // Selectively display appropriate fields for edit mode
    editor.showAppropriateFields(e.data);
    
    // Pre-populate with page data
    if (e.data === "cover") {
        var page = editor.story.cover;
        $('#edit-page-id').val('CoverPage');
        $('#edit-page-image').val(page.background);
        $('#edit-page-image').trigger('change');
        $('#edit-page-next').val(page.next);
        
    } else if (e.data === "page") {
        var pageId = e.delegateTarget.dataset.id;
        var page = editor.story.pages[pageId];
        $('#edit-page-id').val(pageId);
        $('#edit-page-title').val(page.title);
        $('#edit-page-text').val(page.text ? page.text.join('\n\n'):'');
        $('#edit-page-image').val(page.background);
        $('#edit-page-image').trigger('change');
        $('#edit-page-next').val(page.next);
        $('#edit-page-side').val(page.side);
        $('#edit-page-actions').empty().append(pageActions(page));
        $('.action-icon-remove').click(editor.removeAction);
        
    } else if (e.data === "choice") {
        var pageId = e.delegateTarget.dataset.id;
        var choice = editor.story.choices[pageId];
        $('#edit-page-id').val(pageId);
        $('#edit-page-title').val(choice.title);
        $('#edit-page-question').val(choice.question);
        $('#edit-page-choice-a').val(choice.optionA);
        $('#edit-page-choice-b').val(choice.optionB);
        $('#edit-page-next-a').val(choice.nextA);
        $('#edit-page-next-b').val(choice.nextB);
        $('#edit-page-image').val(choice.background);
        $('#edit-page-image').trigger('change');
        $('#edit-page-side').val(choice.side);

    } else if (e.data === "sidebar") {
        var pageId = e.delegateTarget.dataset.id;
        var side = editor.story.sides[pageId];
        $('#edit-page-id').val(pageId);
        $('#edit-page-title').val(side.title);
        $('#edit-page-text').val(side.text.join('\n\n'));
        $('#edit-page-image').val(side.background);
        $('#edit-page-image').trigger('change');
    }
};

editor.removeAction = function(e) {
    console.log(e);
    e.stopImmediatePropagation();
    var pos = e.currentTarget.dataset.position;
    var id = $('#edit-page-id').val();
    var page = editor.story.pages[id];

    // Update the loaded story page
    editor.story.pages[id].actions.splice(pos,1);

    // Send to server (ignore response)
    $.post("/removeAction", { id: id, position: pos });
    
    $('#edit-page-actions').empty().append(pageActions(page));
};

function pageActions(page) {
    var actions = page.actions ? page.actions.map(actionIcon) : [];
    actions.push(`<a href='#add-action' data-toggle="collapse" id="add-action-toggle"><img src='images/add-action-icon.png' class='pull-left'/></a>`);
    return actions.join('');
}

editor.cancelEditPage = function(e) {
    // Reset and hide edit view
    $('#form-edit-page').trigger("reset");
    $('#edit-page-image').trigger("change");
    $('#form-edit-page').addClass('hidden');
    
    // Redisplay list and controls
    $('#page-list').show();
    $('#add-page-controls').show();
};

editor.updatePage = function(e) {
    e.preventDefault();

    var id = $('#edit-page-id').val();
    var pageType = $('#edit-page-type').val();
    
    if (pageType === "cover") {
        var updateCover = {
            background: $('#edit-page-image').val(),
            next: $('#edit-page-next').val()
        };
        $.post("/cover", updateCover, editor.loadStory);

    } else if (pageType === "page") {
        var updatePage = {
            id: id,
            background: $('#edit-page-image').val(),
            title: $('#edit-page-title').val(),
            text: $('#edit-page-text').val(),
            next: $('#edit-page-next').val(),
            side: $('#edit-page-side').val()
        };
        $.post("/updatePage", updatePage, editor.loadStory);

    } else if (pageType === "choice") {
        var updateChoicePage = {
            id: id,
            background: $('#edit-page-image').val(),
            title: $('#edit-page-title').val(),
            question: $('#edit-page-question').val(),
            optionA: $('#edit-page-choice-a').val(),
            optionB: $('#edit-page-choice-b').val(),
            nextA: $('#edit-page-next-a').val(),
            nextB: $('#edit-page-next-b').val(),
            side: $('#edit-page-side').val()
        };
        $.post("/updateChoice", updateChoicePage, editor.loadStory);

    } else if (pageType === "sidebar") {
        var updateSidePage = {
            id: id,
            background: $('#edit-page-image').val(),
            title: $('#edit-page-title').val(),
            text: $('#edit-page-text').val(),
            next: null
        };
        $.post("/updateSide", updateSidePage, editor.loadStory);
    }
    
    editor.cancelEditPage();
};

editor.addPageAction = function(e) {
    e.preventDefault();

    var id = $('#edit-page-id').val();
    var page = editor.story.pages[id];

    var newAction = {
        id: id,
        image: $('#add-action-image').val(),
        trigger: $('#add-action-trigger').val(),
        position: $('#add-action-classes').val()
    };
    
    // Update the loaded story page
    editor.story.pages[id].actions = (editor.story.pages[id].actions || []).concat(newAction);

    // Send to server (ignore response)
    $.post("/addAction", newAction);
    
    // Clear fields and close toggle
    $('#add-action-image').val('');
    $('#add-action-trigger').val('');
    $('#add-action-classes').val('');
    $('#add-action-toggle').click();
    $('#edit-page-actions').empty().append(pageActions(page));
};

function findPage(id) {
    return editor.story.pages[id] || editor.story.choices[id] || editor.story.sides[id];
}

$().ready(function() {
    editor.loadGallery();
    
    // Save data event listeners
    $('#form-edit-page').submit(editor.updatePage);

    // Image changes update thumbnails
    $('#add-page-image').change("add", editor.updateImagePreview);
    $('#edit-page-image').change("edit", editor.updateImagePreview);

    // Add page
    $('#add-page').click("page", editor.openAddPage);
    $('#add-choice').click("choice", editor.openAddPage);
    $('#add-sidebar').click("sidebar", editor.openAddPage);
    $('#form-add-page').submit(editor.savePage);
    $('#cancel-add-page').click(editor.cancelAddPage);
    
    // Page edit cancellation  
    $('#cancel-edit-page').click(editor.cancelEditPage);
    
    // Add an action
    $('#do-add-action').click(editor.addPageAction);
    
    // Input modifiers
    $('.title-case').keyup(editor.titleCase);
    
    $(document).on('change', '#backgrounds :file', function() {
        var input = $(this);
        var filename = input.val().replace(/\\/g, '/').replace(/.*\//, '');
        $('#echoBackgroundFileName').val(filename);
    });
    $(document).on('change', '#characters :file', function() {
        var input = $(this);
        var filename = input.val().replace(/\\/g, '/').replace(/.*\//, '');
        $('#echoCharacterFileName').val(filename);
    });
});