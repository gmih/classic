/* globals jQuery, document */
(function ($, undefined) {
    "use strict";

    var $document = $(document);

    $document.ready(function () {

        $(".scroll-down").arctic_scroll();
        $(".scroll-to-link").arctic_scroll();

    });

    // Arctic Scroll by Paul Adam Davis
    // https://github.com/PaulAdamDavis/Arctic-Scroll
    $.fn.arctic_scroll = function (options) {

        var defaults = {
            elem: $(this),
            speed: 500
        },

        allOptions = $.extend(defaults, options);

        allOptions.elem.click(function (event) {
            event.preventDefault();
            var $this = $(this),
                $htmlBody = $('html, body'),
                offset = ($this.attr('data-offset')) ? $this.attr('data-offset') : false,
                position = ($this.attr('data-position')) ? $this.attr('data-position') : false,
                toMove;

            if (offset) {
                toMove = parseInt(offset);
                $htmlBody.stop(true, false).animate({scrollTop: ($(this.hash).offset().top + toMove) }, allOptions.speed);
            } else if (position) {
                toMove = parseInt(position);
                $htmlBody.stop(true, false).animate({scrollTop: toMove }, allOptions.speed);
            } else {
                $htmlBody.stop(true, false).animate({scrollTop: ($(this.hash).offset().top) }, allOptions.speed);
            }
        });

    };
})(jQuery);


var anchorForId = function (id) {
  var anchor = document.createElement("a");
  anchor.className = "header-link";
  anchor.href      = "#" + id;
  anchor.innerHTML = "<i class=\"fa fa-link\"></i>";
  return anchor;
};

var linkifyAnchors = function (level, containingElement) {
  var headers = containingElement.getElementsByTagName("h" + level);
  for (var h = 0; h < headers.length; h++) {
    var header = headers[h];

    if (typeof header.id !== "undefined" && header.id !== "") {
      header.insertBefore(anchorForId(header.id), header.childNodes[0]);
    }
  }
};


function isScrolledIntoView(el) {
    let scrollpos = window.scrollY + window.innerHeight;

    const raidInstances = Array.from(document.getElementsByClassName("raid-instance"));


    

    raidInstances.forEach(function (instance) {

        if (scrollpos >= instance.getBoundingClientRect().bottom) {
            instance.getElementsByClassName('progress-meter')[0].classList.add("progress");
        } else {

            window.addEventListener('scroll', function() { 
                scrollpos = window.innerHeight;

                raidInstances.forEach(function (instance) {

                    if (scrollpos >= instance.getBoundingClientRect().bottom) {
                        instance.getElementsByClassName('progress-meter')[0].classList.add("progress");
                    }
                });

            })
        }
    });

}

document.onreadystatechange = function () {
  if (this.readyState === "complete") {
    isScrolledIntoView();
    var contentBlock = document.getElementsByClassName("docs")[0];
    if (!contentBlock) {
      return;
    }
    for (var level = 2; level <= 2; level++) {
      linkifyAnchors(level, contentBlock);
    }
  }
};
