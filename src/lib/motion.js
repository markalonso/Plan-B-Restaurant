/**
 * Premium Motion System for Plan B Restaurant
 * 
 * Centralized animation configuration for consistent premium feel.
 * Uses Framer Motion for smooth, hardware-accelerated animations.
 * 
 * Accessibility: Respects prefers-reduced-motion media query.
 * Performance: Uses transforms and opacity only for 60fps animations.
 */

// ============================================================================
// ACCESSIBILITY - REDUCED MOTION DETECTION
// ============================================================================
const getReducedMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// Helper to return reduced motion safe values
const motionSafe = (full, reduced) => getReducedMotion() ? reduced : full;

// ============================================================================
// DURATION TOKENS
// ============================================================================
export const durations = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  slower: 0.7,
  reveal: 0.8
};

// Reduced motion durations (shorter, snappier)
export const reducedDurations = {
  instant: 0.05,
  fast: 0.1,
  normal: 0.15,
  slow: 0.2,
  slower: 0.25,
  reveal: 0.3
};

// Get appropriate duration based on motion preference
export const getDuration = (key) => {
  const d = getReducedMotion() ? reducedDurations : durations;
  return d[key] || d.normal;
};

// ============================================================================
// EASING TOKENS
// ============================================================================
export const easings = {
  // Smooth ease-out for reveals and entrances
  smooth: [0.25, 0.1, 0.25, 1],
  // Premium ease-out with slight overshoot feel
  premium: [0.22, 1, 0.36, 1],
  // Soft ease-in-out for hover states
  soft: [0.4, 0, 0.2, 1],
  // Snappy for button presses
  snappy: [0.4, 0, 0.6, 1]
};

// ============================================================================
// SPRING PRESETS
// For natural, physics-based animations
// ============================================================================
export const springs = {
  // Gentle spring for subtle movements
  gentle: { type: "spring", stiffness: 120, damping: 14 },
  // Snappy spring for interactive elements
  snappy: { type: "spring", stiffness: 400, damping: 30 },
  // Bouncy spring for playful feedback
  bouncy: { type: "spring", stiffness: 300, damping: 10 },
  // Slow spring for large movements
  slow: { type: "spring", stiffness: 100, damping: 20 },
  // Button press spring
  button: { type: "spring", stiffness: 500, damping: 25 }
};

// ============================================================================
// PAGE TRANSITION VARIANTS
// Subtle fade + rise for page/section reveals (8-16px max movement)
// ============================================================================
export const pageTransition = {
  initial: { 
    opacity: 0, 
    y: motionSafe(12, 0)
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: getDuration("reveal"), 
      ease: easings.premium 
    }
  },
  exit: { 
    opacity: 0, 
    y: motionSafe(-8, 0),
    transition: { 
      duration: getDuration("fast"), 
      ease: easings.smooth 
    }
  }
};

// ============================================================================
// FADE VARIANTS
// Simple fade in/out for accessibility-friendly animations
// ============================================================================
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: getDuration("normal"), 
      ease: easings.smooth 
    }
  }
};

export const fadeUp = {
  hidden: { 
    opacity: 0, 
    y: motionSafe(8, 0)
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: getDuration("slow"), 
      ease: easings.premium 
    }
  }
};

// ============================================================================
// REVEAL VARIANTS
// Fade + subtle rise for scroll-triggered reveals (6-14px movement)
// ============================================================================
export const revealVariants = {
  hidden: { 
    opacity: 0, 
    y: motionSafe(10, 0)
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: getDuration("reveal"), 
      ease: easings.premium 
    }
  }
};

// ============================================================================
// STAGGER CONTAINER VARIANTS
// For staggered children animations
// ============================================================================
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: getReducedMotion() ? 0.03 : 0.08,
      delayChildren: getReducedMotion() ? 0 : 0.1
    }
  }
};

export const staggerItem = {
  hidden: { 
    opacity: 0, 
    y: motionSafe(10, 0)
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: getDuration("slow"), 
      ease: easings.premium 
    }
  }
};

// ============================================================================
// BUTTON VARIANTS
// Micro-lift (1-2px) on hover, spring compress (0.98) on press
// ============================================================================
export const buttonVariants = {
  initial: { scale: 1, y: 0 },
  hover: { 
    scale: motionSafe(1.02, 1),
    y: motionSafe(-2, 0),
    transition: springs.snappy
  },
  tap: { 
    scale: 0.98,
    y: 0,
    transition: springs.button
  }
};

// Pop animation for interactive elements
export const popVariants = {
  initial: { scale: 1 },
  hover: { 
    scale: motionSafe(1.05, 1),
    transition: springs.bouncy
  },
  tap: { 
    scale: 0.95,
    transition: springs.button
  }
};

// Hover lift for cards and interactive containers
export const hoverLift = {
  initial: { 
    y: 0,
    boxShadow: "0 1px 3px rgba(111, 78, 55, 0.08)"
  },
  hover: { 
    y: motionSafe(-4, 0),
    boxShadow: motionSafe(
      "0 12px 24px rgba(111, 78, 55, 0.12)",
      "0 1px 3px rgba(111, 78, 55, 0.08)"
    ),
    transition: { 
      duration: getDuration("normal"), 
      ease: easings.soft 
    }
  }
};

// ============================================================================
// CARD VARIANTS
// Hover with soft lift (2-4px) + shadow increase + image zoom (1.02-1.05)
// ============================================================================
export const cardVariants = {
  initial: { 
    y: 0,
    boxShadow: "0 1px 3px rgba(111, 78, 55, 0.08)"
  },
  hover: { 
    y: motionSafe(-4, 0),
    boxShadow: motionSafe(
      "0 12px 24px rgba(111, 78, 55, 0.12)",
      "0 2px 6px rgba(111, 78, 55, 0.1)"
    ),
    transition: { 
      duration: getDuration("normal"), 
      ease: easings.soft 
    }
  }
};

// Card image zoom on hover (1.02-1.05 max)
export const cardImageVariants = {
  initial: { scale: 1 },
  hover: { 
    scale: motionSafe(1.04, 1),
    transition: { 
      duration: getDuration("slow"), 
      ease: easings.soft 
    }
  }
};

// Card overlay fade on hover
export const cardOverlayVariants = {
  initial: { opacity: 0 },
  hover: { 
    opacity: 1,
    transition: { 
      duration: getDuration("normal"), 
      ease: easings.soft 
    }
  }
};

// ============================================================================
// INPUT FOCUS ANIMATION
// Soft highlight on focus, subtle shake for validation errors
// ============================================================================
export const inputFocusVariants = {
  initial: { 
    scale: 1,
    boxShadow: "0 0 0 0 rgba(111, 78, 55, 0)"
  },
  focus: { 
    scale: 1,
    boxShadow: "0 0 0 3px rgba(111, 78, 55, 0.15)",
    transition: { 
      duration: getDuration("fast"), 
      ease: easings.soft 
    }
  }
};

// Validation error shake animation
export const shakeVariants = {
  initial: { x: 0 },
  shake: {
    x: motionSafe([0, -4, 4, -4, 4, 0], 0),
    transition: { 
      duration: 0.4, 
      ease: easings.snappy 
    }
  }
};

// ============================================================================
// MODAL/DRAWER VARIANTS
// Slide + fade for modals and drawers with spring animation
// ============================================================================
export const modalBackdropVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: getDuration("normal"), 
      ease: easings.smooth 
    }
  },
  exit: { 
    opacity: 0,
    transition: { 
      duration: getDuration("fast"), 
      ease: easings.smooth 
    }
  }
};

export const modalContentVariants = {
  hidden: { 
    opacity: 0, 
    scale: motionSafe(0.96, 1),
    y: motionSafe(16, 0)
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: getReducedMotion() 
      ? { duration: getDuration("normal"), ease: easings.smooth }
      : springs.gentle
  },
  exit: { 
    opacity: 0, 
    scale: motionSafe(0.98, 1),
    y: motionSafe(8, 0),
    transition: { 
      duration: getDuration("fast"), 
      ease: easings.smooth 
    }
  }
};

export const drawerVariants = {
  hidden: { x: "100%" },
  visible: { 
    x: 0,
    transition: getReducedMotion()
      ? { duration: getDuration("normal"), ease: easings.smooth }
      : springs.gentle
  },
  exit: { 
    x: "100%",
    transition: { 
      duration: getDuration("fast"), 
      ease: easings.smooth 
    }
  }
};

// ============================================================================
// SKELETON SHIMMER
// Loading state animation
// ============================================================================
export const skeletonShimmer = {
  initial: { backgroundPosition: "-200% 0" },
  animate: { 
    backgroundPosition: "200% 0",
    transition: {
      duration: getReducedMotion() ? 2 : 1.5,
      ease: "linear",
      repeat: Infinity
    }
  }
};

// ============================================================================
// HEADER VARIANTS
// Smooth background/shadow transition on scroll
// ============================================================================
export const headerVariants = {
  transparent: { 
    backgroundColor: "rgba(250, 247, 242, 0)",
    boxShadow: "0 0 0 rgba(0,0,0,0)",
    backdropFilter: "blur(0px)"
  },
  scrolled: { 
    backgroundColor: "rgba(250, 247, 242, 0.95)",
    boxShadow: "0 1px 3px rgba(111, 78, 55, 0.08)",
    backdropFilter: "blur(8px)",
    transition: { 
      duration: getDuration("normal"), 
      ease: easings.soft 
    }
  }
};

// ============================================================================
// VIEWPORT CONFIG
// Consistent viewport settings for whileInView
// ============================================================================
export const viewportConfig = {
  once: true,
  amount: 0.15,
  margin: "-40px"
};

// ============================================================================
// TRANSITION PRESETS
// Pre-configured transition objects
// ============================================================================
export const transitions = {
  reveal: { duration: getDuration("reveal"), ease: easings.premium },
  hover: { duration: getDuration("normal"), ease: easings.soft },
  tap: { duration: getDuration("instant"), ease: easings.snappy },
  fade: { duration: getDuration("normal"), ease: easings.smooth },
  spring: springs.gentle,
  springSnappy: springs.snappy
};

// ============================================================================
// ACCESSIBILITY HELPER
// Check if reduced motion is preferred
// ============================================================================
export const prefersReducedMotion = getReducedMotion;

// ============================================================================
// ANIMATION WRAPPER HELPER
// Returns reduced motion safe animation props
// ============================================================================
export const getAnimationProps = (full, reduced = {}) => {
  return getReducedMotion() ? reduced : full;
};
