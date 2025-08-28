import { useEffect } from "react";
import { gsap } from "gsap";
import {
  fadeIn,
  staggerFadeIn,
  floating,
  cardHover,
} from "@/lib/animations";

export const useHeroAnimations = () => {
  useEffect(() => {
    // Hero content animations
    fadeIn(".hero-title", 0.2);
    fadeIn(".hero-subtitle", 0.4);
    fadeIn(".hero-buttons", 0.6);
    fadeIn(".hero-stats", 0.8);

    // Stagger animation for feature cards
    staggerFadeIn(".hero-card", 1);

    // Floating animation for background elements
    floating(".hero-background");

    // Card hover animations
    cardHover(".hero-card");

    // Parallax effect for background
    gsap.to(".hero-background", {
      yPercent: -20,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  }, []);
};
