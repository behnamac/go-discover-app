import { useEffect } from "react";
import { gsap } from "gsap";
import { floating } from "@/lib/animations";

export const useHeroBackground = () => {
  useEffect(() => {
    floating(".hero-background");

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
