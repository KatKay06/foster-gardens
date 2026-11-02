
// Mobile navigation functionality

$(document).ready(function () {

    const $menuButton = $('.burger-menu');
    const $menu = $('.menu-bar');

    // Screen size restriction
    const mobileTablet = window.matchMedia(
        '(max-width: 1023px)'
    );

    // Detect whether the device supports hover
    const mouseHover = window.matchMedia(
        '(hover: hover) and (pointer: fine)'
    );

    // Open menu
    function openMenu() {

        $menu.stop(true, true).slideDown(200);

        $menuButton.attr('aria-expanded', 'true');

    }

    // Close menu
    function closeMenu() {

        $menu.stop(true, true).slideUp(200);

        $menuButton.attr('aria-expanded', 'false');

    }

    // Toggle menu
    function toggleMenu() {

        const isExpanded =
            $menuButton.attr('aria-expanded') === 'true';

        if (isExpanded) {
            closeMenu();
        } else {
            openMenu();
        }

    }

    // MOUSE USERS
    $menuButton.on('mouseenter', function () {

        if (!mobileTablet.matches || !mouseHover.matches) return;

        openMenu();

    });

    // Close menu when mouse leaves the menu area
    $('header').on('mouseleave', function () {

        if (!mobileTablet.matches || !mouseHover.matches) return;

        closeMenu();

    });

    // TOUCHSCREEN AND KEYBOARD USERS
    $menuButton.on('click', function () {

        if (!mobileTablet.matches) return;

        toggleMenu();

    });

    // Close menu when a navigation link is selected
    $menu.find('a').on('click', function () {

        if (mobileTablet.matches) {
            closeMenu();
        }

    });

    // Close menu when clicking or tapping outside the header
    $(document).on('click', function (event) {

        if (
            mobileTablet.matches &&
            !$(event.target).closest('header').length
        ) {

            closeMenu();

        }

    });

    // Close menu using Escape key
    $(document).on('keydown', function (event) {

        if (event.key === 'Escape' && mobileTablet.matches) {

            closeMenu();

            $menuButton.trigger('focus');

        }

    });

    // Reset menu when screen size changes
    $(window).on('resize', function () {

        if (!mobileTablet.matches) {

            $menu.stop(true, true).removeAttr('style');

            $menuButton.attr('aria-expanded', 'false');

        } else {

            closeMenu();

        }

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

// Quotation form validation 
$(document).ready(function () {
    $('.quote-box form').on('submit', function (event){
        const form = this; 
        
        // Check required fields
        if(!form.checkValidity()) {
            event.preventDefault();
            form.reportValidity(); 
            return; 
        }

        // Check email format
        const email = $('#email').val().trim(); 

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

        if(!emailPattern.test(email)) {
            event.preventDefault();
            alert('Please enter a valid email address.');
            return; 
        }
    })
})

// Quotation / Enquiry Form Validation

$(document).ready(function () {

    const $quotationForm = $('#quotation-form');
    const $successMessage = $('#quotation-success');
    const $quotationHeading = $('#quotation-heading');

    $quotationForm.on('submit', function (event) {

        event.preventDefault();

        const form = this;

        // HTML5 validation
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Check service selection
        const selectedServices =
            $('input[name="services"]:checked');

        if (selectedServices.length === 0) {
            alert('Please select at least one preferred service.');
            return;
        }

        // Validate telephone number
        const phone = $('#phone').val().trim();

        const phonePattern = /^[0-9+\s()-]{7,20}$/;

        if (!phonePattern.test(phone)) {
            alert('Please enter a valid telephone number.');
            $('#phone').trigger('focus');
            return;
        }

        // Collect customer name
        const firstName = $('#name').val().trim();

        // Personalise confirmation message
        $successMessage.find('h3').text(
            'Thank You, ' + firstName + '!'
        );

        // Hide heading and form
        $quotationHeading.hide();
        $quotationForm.hide();

        // Display confirmation
        $successMessage.prop('hidden', false);

    });

    // Return to enquiry form
    $('#return-to-form').on('click', function () {

        $quotationForm[0].reset();

        $successMessage.prop('hidden', true);

        $quotationHeading.show();
        $quotationForm.show();

        // Return focus to first input
        $('#name').trigger('focus');

    });

});


// General Contact Form Validation and Email Preparation

$(document).ready(function () {

    const $messageForm = $('#message-form');
    const $successMessage = $('#message-success');
    const $messageHeading = $('#message-heading');

    $messageForm.on('submit', function (event) {

        event.preventDefault();

        const form = this;

        // Check HTML5 validation
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Collect customer information
        const name = $('#contact-name').val().trim();
        const email = $('#contact-email').val().trim();
        const phone = $('#contact-phone').val().trim();
        const messageType = $('#message-type').val();
        const message = $('#contact-message').val().trim();

        // Validate telephone number
        const phonePattern = /^[0-9+()\s-]{7,20}$/;

        if (!phonePattern.test(phone)) {
            alert('Please enter a valid telephone number.');
            $('#contact-phone').trigger('focus');
            return;
        }

        // Prepare email subject
        const subject = messageType + ' - Foster Gardens';

        // Compile email content
        const emailBody =
            'Name: ' + name + '\n\n' +
            'Email Address: ' + email + '\n\n' +
            'Contact Number: ' + phone + '\n\n' +
            'Message Type: ' + messageType + '\n\n' +
            'Message:\n' + message;

        // Construct mailto link
        const mailtoLink =
            'mailto:gardens@foster.co.za' +
            '?subject=' + encodeURIComponent(subject) +
            '&body=' + encodeURIComponent(emailBody);

        // Prepare the email
        window.location.href = mailtoLink;

        // Display instructions for completing the email
        $successMessage.find('h3').text(
        'Thank You, ' + name + '!'
        );

        $messageHeading.hide();
        $messageForm.hide();

        $successMessage.prop('hidden', false);

    });

    // Return to contact form
    $('#return-to-message').on('click', function () {

        $messageForm[0].reset();

        $successMessage.prop('hidden', true);

        $messageHeading.show();
        $messageForm.show();

        // Return focus to first input
        $('#contact-name').trigger('focus');

    });

});
