// Menu-bar section 
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

$(document).ready(function() {
    // Select the review elements
    const $reviewSection = $('#reviews');
    const $track = $('.review-track'); 
    const $reviews = $('.review');
    const $dotsContainer = $('.review-dots'); 

    let currentIndex = 0; 
    let slideInterval = null; 

    if(!$reviewSection.length || $reviews.length < 2) { 
        console.error("Review carousel elements missing!"); 
        return;
    }

    // Create pagination dots 
    $reviews.each(function(index) {
        const $dot = $('<button>', {
            class: 'review-dot', 
            type: 'button', 
            'aria-label': 'Go to review' + (index + 1)
        }); 

        $dotsContainer.append($dot); 
    }); 

    const $dots = $('.review-dot'); 

    //Update the active dot 
    function updateDots() {
        $dots
            .removeClass('active')
            .attr('aria-current', 'false'); 

        $dots.eq(currentIndex)
            .addClass('active')
            .attr('aria-current', 'true'); 
    }

    //Move to a specific review 
    function showReview(index) { 
        currentIndex = index; 

        $track.css(
            'transform', 
            'translateX(-' + (currentIndex * 100) + '%)'
        ); 
        updateDots(); 
    }

    // Move to the next review 
    function nextReview() { 
        let nextIndex = (currentIndex + 1) % 
        $reviews.length; 
        
        showReview(nextIndex); 
    }

    // Start slider once close to the section 
    function startSlider() {
        if (!slideInterval) { 
            slideInterval = setInterval(nextReview, 5000); 
        }
    }

    // Stop slider automatically once away from section
    function stopSlider() {
         clearInterval(slideInterval); 
         slideInterval = null; 
    } 

    // Clickable pagination dots
    $dots.on('click', function() { 
        const selectedIndex = $(this).index(); 

        showReview(selectedIndex); 

        //Restart the timer after manual selection 
        stopSlider(); 
        startSlider(); 
    }); 

    //Initialise first preview 
    showReview(0); 

    // Intersection observer 
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