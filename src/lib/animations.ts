import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Common animation configurations
export const animationDefaults = {
  duration: 0.8,
  ease: "power2.out",
  stagger: 0.1,
};

// Fade in animation
export const fadeIn = (element: string | Element, delay = 0) => {
  return gsap.fromTo(
    element,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: animationDefaults.duration,
      ease: animationDefaults.ease,
      delay,
    }
  );
};

// Slide in from left
export const slideInLeft = (element: string | Element, delay = 0) => {
  return gsap.fromTo(
    element,
    { opacity: 0, x: -50 },
    {
      opacity: 1,
      x: 0,
      duration: animationDefaults.duration,
      ease: animationDefaults.ease,
      delay,
    }
  );
};

// Slide in from right
export const slideInRight = (element: string | Element, delay = 0) => {
  return gsap.fromTo(
    element,
    { opacity: 0, x: 50 },
    {
      opacity: 1,
      x: 0,
      duration: animationDefaults.duration,
      ease: animationDefaults.ease,
      delay,
    }
  );
};

// Scale in animation
export const scaleIn = (element: string | Element, delay = 0) => {
  return gsap.fromTo(
    element,
    { opacity: 0, scale: 0.8 },
    {
      opacity: 1,
      scale: 1,
      duration: animationDefaults.duration,
      ease: "back.out(1.7)",
      delay,
    }
  );
};

// Stagger animation for multiple elements
export const staggerFadeIn = (elements: string | Element[], delay = 0) => {
  return gsap.fromTo(
    elements,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: animationDefaults.duration,
      ease: animationDefaults.ease,
      delay,
      stagger: animationDefaults.stagger,
    }
  );
};

// Parallax effect
export const parallax = (element: string | Element, speed = 0.5) => {
  return gsap.to(element, {
    yPercent: -50 * speed,
    ease: "none",
    scrollTrigger: {
      trigger: element,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
};

// Text reveal animation
export const textReveal = (element: string | Element, delay = 0) => {
  return gsap.fromTo(
    element,
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power3.out",
      delay,
    }
  );
};

// Floating animation
export const floating = (element: string | Element) => {
  return gsap.to(element, {
    y: -10,
    duration: 2,
    ease: "power1.inOut",
    yoyo: true,
    repeat: -1,
  });
};

// Pulse animation
export const pulse = (element: string | Element) => {
  return gsap.to(element, {
    scale: 1.05,
    duration: 1,
    ease: "power1.inOut",
    yoyo: true,
    repeat: -1,
  });
};

// Bounce in animation
export const bounceIn = (element: string | Element, delay = 0) => {
  return gsap.fromTo(
    element,
    { opacity: 0, scale: 0.3 },
    {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: "bounce.out",
      delay,
    }
  );
};

// Hero section animations
export const heroAnimations = () => {
  const tl = gsap.timeline();

  tl.add(() => {
    fadeIn(".hero-title", 0.2);
    fadeIn(".hero-subtitle", 0.4);
    fadeIn(".hero-buttons", 0.6);
    fadeIn(".hero-stats", 0.8);
    staggerFadeIn(".hero-card", 1);
  });

  return tl;
};

// Map section animations
export const mapAnimations = () => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".map-section",
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play none none reverse",
    },
  });

  tl.add(() => {
    slideInLeft(".map-content", 0);
    slideInRight(".map-container", 0.2);
    staggerFadeIn(".nearby-place", 0.4);
  });

  return tl;
};

// Card hover animations
export const cardHover = (element: string | Element) => {
  const card = gsap.utils.toArray(element);

  card.forEach((el) => {
    gsap.set(el, { transformOrigin: "center center" });

    el.addEventListener("mouseenter", () => {
      gsap.to(el, {
        scale: 1.02,
        y: -5,
        duration: 0.3,
        ease: "power2.out",
      });
    });

    el.addEventListener("mouseleave", () => {
      gsap.to(el, {
        scale: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    });
  });
};

// Button click animation
export const buttonClick = (element: string | Element) => {
  return gsap.to(element, {
    scale: 0.95,
    duration: 0.1,
    ease: "power2.out",
    yoyo: true,
    repeat: 1,
  });
};

// Page transition animation
export const pageTransition = (element: string | Element) => {
  return gsap.fromTo(
    element,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out",
    }
  );
};

// Location button animation
export const locationButtonAnimation = (
  element: string | Element,
  isEnabled: boolean
) => {
  if (isEnabled) {
    return gsap.to(element, {
      scale: 1.05,
      backgroundColor: "hsl(var(--primary))",
      color: "hsl(var(--primary-foreground))",
      duration: 0.3,
      ease: "power2.out",
    });
  } else {
    return gsap.to(element, {
      scale: 1,
      backgroundColor: "transparent",
      color: "inherit",
      duration: 0.3,
      ease: "power2.out",
    });
  }
};

// Marker animation
export const markerAnimation = (element: string | Element) => {
  return gsap.fromTo(
    element,
    { scale: 0, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      duration: 0.5,
      ease: "back.out(1.7)",
    }
  );
};

// Cleanup function
export const cleanupAnimations = () => {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  gsap.killTweensOf("*");
};
