// Hero Section Animations
const animateHero = () => {
    const tl = gsap.timeline();
    
    // Animate heading
    tl.from('.hero-content h1', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    })
    // Animate description
    .from('.hero-content p', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    }, '-=0.5')
    // Animate CTA buttons
    .from('.hero-content div', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    }, '-=0.5')
    // Animate hero image
    .from('.hero-image', {
        x: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    }, '-=0.8');

    return tl;
};

// Form Animations
const animateForm = () => {
    return gsap.to('#formContainer', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
    });
};

// Form Shake Animation for Invalid Login
const shakeForm = () => {
    return gsap.timeline()
        .to('#formContainer', {
            x: -10,
            duration: 0.1
        })
        .to('#formContainer', {
            x: 10,
            duration: 0.1
        })
        .to('#formContainer', {
            x: -10,
            duration: 0.1
        })
        .to('#formContainer', {
            x: 10,
            duration: 0.1
        })
        .to('#formContainer', {
            x: 0,
            duration: 0.1
        });
};

// Form Exit Animation
const exitForm = () => {
    return gsap.to('#formContainer', {
        opacity: 0,
        y: -20,
        duration: 0.5,
        ease: 'power3.in'
    });
};

// Dashboard Animations
const animateDashboard = {
    // Welcome message animation
    welcome: () => {
        return gsap.to('#userName', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        });
    },

    // Course card animation (staggered)
    courseCard: (card, i) => {
        gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: 0.1 * i,
            ease: 'power3.out'
        });
    },

    // Progress bar animation
    progressBar: (element, targetProgress) => {
        gsap.to(element, {
            width: `${targetProgress}%`,
            duration: 1,
            ease: 'power3.out'
        });
    }
};

// Page Transition Animations
const pageTransitions = {
    exit: () => {
        return gsap.to('main', {
            opacity: 0,
            y: -20,
            duration: 0.3,
            ease: 'power2.in'
        });
    },
    
    enter: () => {
        return gsap.from('main', {
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: 'power2.out'
        });
    }
};

// Utility function to stagger animate multiple elements
const staggerAnimate = (elements, fromVars = {}, staggerAmount = 0.1) => {
    return gsap.from(elements, {
        ...fromVars,
        stagger: staggerAmount,
        ease: 'power3.out'
    });
};

// Export all animation functions
export {
    animateHero,
    animateForm,
    shakeForm,
    exitForm,
    animateDashboard,
    pageTransitions,
    staggerAnimate
}; 