var devMode = true;

// Refer to http://stackoverflow.com/a/7557433/2740231
var isElementInViewport = function(el) {
    var showPartial = el.hasClass('show-partial');
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }

    var rect = el.getBoundingClientRect();

    return showPartial ?
        (rect.bottom >= 0
        && rect.right >= 0
        && rect.top <= (window.innerHeight || document.documentElement.clientHeight)
        && rect.left <= (window.innerWidth || document.documentElement.clientWidth)):
        (rect.top >= 0
        && rect.left >= 0
        && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) /*or $(window).height() */
        && rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
};

var supportsImports = function() {
    return 'import' in document.createElement('link');
};

$(document).ready(function () {
    var body = $('body');
    var flipImageIntervalId = 0;

    var openLink = function(url, newTab) {
        var time = new Date().getUTCMilliseconds();
        if (newTab) {
            body.append('<a class="hide ' + time + '" target="_blank" href="' + url + '"></a>');
        } else {
            body.append('<a class="hide ' + time + '" target="_self" href="' + url + '"></a>');
        }
        var aLink = body.find('.' + time);
        if (devMode) {
            console.log('Requested to open url: ' + url);
        }
        // Somehow jQuery .click() wasn't doing its job
        document.getElementsByClassName(time)[0].click();
        $(aLink).remove();
    };

    var flipToImage = function(descriptionElement) {
        $(descriptionElement).closest('.flip-img-container').find('img').removeClass('flipOutY').addClass('flipInY');
        $(descriptionElement).removeClass('flipInY').addClass('flipOutY');
        clearInterval(flipImageIntervalId);
    };

    // Only latest chrome (v31+) supports HTML5 imports, hence we are not using it right now.
    console.log(supportsImports() ? 'Yay! this browser supports HTML5 imports.' : "This browser doesn't support imports.");

    body.on('click', 'address', function (e) {
        var mapUrl = encodeURI($(this).attr('data-map'));
        if (mapUrl !== undefined && mapUrl.length) {
            openLink(mapUrl, true);
        }
    });

    $('.section-container section').each(function() {
        if(arguments[0]%2) {
            $(this).addClass('right');
        } else {
            $(this).addClass('left');
        }
    });

    body.on('click', '.out-link', function() {
        var url = encodeURI($(this).attr('data-href'));
        if (url !== undefined && url.length) {
            openLink(url, true);
        }
    });

    body.on('click', '.in-link', function() {
        var url = encodeURI($(this).attr('data-href'));
        if (url !== undefined && url.length) {
            openLink(url, false);
        }
    });

    body.on('mouseenter', '.flip-img-container img', function(e) {
        $(this).removeClass('flipInY').addClass('animated flipOutY');
        $(this).closest('.flip-img-container').find('.description').removeClass('flipOutY hide').addClass('animated flipInY');
        flipImageIntervalId = setInterval(function() {
            if(!$('.flip-img-container .description:hover').length) {
                $('.flip-img-container .description').each(function() {
                    flipToImage(this);
                });
            }
        }, 3000);
    });

    body.on('mouseout', '.flip-img-container .description', function(e) {
        var toElement = $(e.toElement);
        if(!toElement.hasClass('description') && !toElement.closest('.description').length) {
            flipToImage(this);
        }
    });

});
