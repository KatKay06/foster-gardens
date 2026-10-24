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