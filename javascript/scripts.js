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

    let currentIndex = 0; 
    let slideInterval = null; 

    // Move to the next review 
    function nextReview() { 
        currentIndex = (currentIndex + 1) % $reviews.length; 

        $track.css(
            'transform', 
            'translateX(-' + (currentIndex * 100) + '%)'
        ); 
    }

    // Start automatically sliding when close to the section 
    function startSlider() {
        if (!slideInterval) { 
            slideInterval = setInterval (
                nextReview, 
                5000
            );
        }
    }

    // Stop automatically sliding once away from the section 
    function stopSlider() {
        clearInterval(slideInterval); 
        slideInterval = null; 
    }

    //Intersection Observer
    const observer = new IntersectionObserver(
        function(entries) { 
            $.each(entries, function(index, entry) { 
                if (entry.isIntersecting) { 
                    
                    //reviews section is visible 
                    startSlider(); 
                } else { 
                    // Reviews section is outside viewport 
                    stopSlider(); 
                }
            }); 
        },
        {
            threshold: 0.1
        }
    ); 
    //Observe the reviews section 
    observer.observe($reviewSection[0]);
});