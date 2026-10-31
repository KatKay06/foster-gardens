// Menu-bar section functionality 
$(document).ready(function () { 
    // The given media query sizes for the dropdown menu
    const mobileTablet = window.matchMedia( 
        "(max-width:1023px)"
    ); 

    // Open the dropdown menu when the burger is hovered over 
    $(".burger-menu").on("mouseenter", function () { 
        // If the screen size is not within the given restriction, do not
        // continue running the code
        if (!mobileTablet.matches) return;

        // If screen size is within given restriction, continue running code
        $(".menu-bar").stop(true, true).slideDown(200);
        $(this).attr("aria-expanded", "true");
    });

    // Close the dropdown menu when no longer hovering on burger menu
    $(".burger-menu, .menu-bar").on("mouseleave", function () {
        // If the screen size is not within the given restriction, do not 
        // continue running the code
        if (!mobileTablet.matches) return; 

        // If the screen size is within given restriction, continue running code
        setTimeout(function () { 
            if (
                // If the mouse is not hovering over burger menu and the 
                // 
                !$(".burger-menu:hover").length && 
                !$(".menu-bar:hover").length
            ) {
                // If given conditions are true, close the dropdown menu
                $(".menu-bar").stop(true, true).slideUp(200);
                $(".burger-menu").attr("aria-expanded", "false");
            }
        }, 150);
    });
}); 

// Reviews section functionality 
$(document).ready(function() {

    const $reviewSection = $('#reviews');
    const $reviews = $('.review');
    const $dotsContainer = $('.review-dots');

    let currentIndex = 0;
    let slideInterval = null;
    let isAnimating = false;

    if (!$reviewSection.length || $reviews.length < 2) {
        console.error("Review carousel elements missing!");
        return;
    }

    // Create pagination dots
    $reviews.each(function(index) {
        $dotsContainer.append(
            $('<button>', {
                class: 'review-dot',
                type: 'button',
                'aria-label': 'Go to review ' + (index + 1)
            })
        );
    });

    const $dots = $dotsContainer.find('.review-dot');

    // Get the text elements
    function getTextElements($review) {
        return $review.find('h3, p, strong');
    }

    // Update the dots
    function updateDots() {
        $dots.removeClass('active')
            .attr('aria-current', 'false');

        $dots.eq(currentIndex)
            .addClass('active')
            .attr('aria-current', 'true');
    }

    // Initialise
    $reviews.each(function(index) {

        const $review = $(this);
        const $text = getTextElements($review);

        if (index === 0) {

            $review.addClass('active')
                .css('visibility', 'visible');

            $text.css({
                transform: 'translateX(0)',
                opacity: 1
            });

        } else {

            $review.css('visibility', 'hidden');

            $text.css({
                transform: 'translateX(100%)',
                opacity: 0
            });

        }

    });

    // Show next review
    function showReview(index) {

        if (isAnimating || index === currentIndex) return;

        isAnimating = true;

        const $current = $reviews.eq(currentIndex);
        const $next = $reviews.eq(index);

        const $currentText = getTextElements($current);
        const $nextText = getTextElements($next);

        // Prepare next review outside the viewport
        $next.css('visibility', 'visible');

        $nextText.css({
            transition: 'none',
            transform: 'translateX(100%)',
            opacity: 0
        });

        // Force layout
        $next[0].offsetHeight;

        // Animate both reviews simultaneously
        $currentText.css({
            transform: 'translateX(-100%)',
            opacity: 0
        });

        $nextText.css({
            transition: 'transform 0.7s ease, opacity 0.7s ease',
            transform: 'translateX(0)',
            opacity: 1
        });

        // Update active review
        currentIndex = index;
        updateDots();

        // Finish transition
        setTimeout(function() {

            $current.removeClass('active')
                .css('visibility', 'hidden');

            $next.addClass('active');

            isAnimating = false;

        }, 750);
    }

    // Next review
    function nextReview() {
        const nextIndex = (currentIndex + 1) % $reviews.length;
        showReview(nextIndex);
    }

    // Start autoplay
    function startSlider() {
        if (!slideInterval) {
            slideInterval = setInterval(nextReview, 6000);
        }
    }

    // Stop autoplay
    function stopSlider() {
        clearInterval(slideInterval);
        slideInterval = null;
    }

    // Pagination clicks
    $dots.on('click', function() {

        const selectedIndex = $(this).index();

        if (selectedIndex === currentIndex || isAnimating) return;

        stopSlider();
        showReview(selectedIndex);
        startSlider();

    });

    updateDots();

    // Intersection Observer
    const observer = new IntersectionObserver(
        function(entries) {

            entries.forEach(function(entry) {

                if (entry.isIntersecting) {
                    startSlider();
                } else {
                    stopSlider();
                }

            });

        },
        {
            threshold: 0.1
        }
    );

    observer.observe($reviewSection[0]);

});

// Portfolio gallery functionality 

$(document).ready(function() {

    // Open enlarged image
    $('.portfolio-gallery a.lightbox-image').on('click', function(e) {

        e.preventDefault();

        const imageSource = $(this).attr('href');
        const imageAlt = $(this).find('img').attr('alt');

        $('#enlargedImage')
            .attr('src', imageSource)
            .attr('alt', imageAlt);

        $('#imageLightbox').css('display', 'flex');

        $('body').css('overflow', 'hidden');

    });

    // Close lightbox
    function closeLightbox() {

        $('#imageLightbox').hide();

        $('#enlargedImage').attr('src', '');

        $('body').css('overflow', '');

    }

    // Back button
    $('#closeLightbox').on('click', closeLightbox);

    // Click outside image
    $('#imageLightbox').on('click', function(e) {

        if ($(e.target).is('#imageLightbox')) {
            closeLightbox();
        }

    });

    // Escape key
    $(document).on('keydown', function(e) {

        if (e.key === 'Escape') {
            closeLightbox();
        }

    });

});
