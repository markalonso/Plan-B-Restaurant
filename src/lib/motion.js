/**
 * Premium Motion System for Plan B Restaurant
 * 
 * Centralized animation configuration for consistent premium feel.
 * Uses Framer Motion for smooth, hardware-accelerated animations.
 */

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
// PAGE TRANSITION VARIANTS
// Subtle fade + rise for page/section reveals
// ============================================================================
export const pageTransition = {
  initial: { opacity: 0, y: 16 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: durations.reveal, 
      ease: easings.premium 
    }
  },
  exit: { 
    opacity: 0, 
    y: -8,
    transition: { 
      duration: durations.fast, 
      ease: easings.smooth 
    }
  }
};

// ============================================================================
// REVEAL VARIANTS
// Fade + subtle rise for scroll-triggered reveals
// ============================================================================
export const revealVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: durations.reveal, 
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
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

export const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: durations.slow, 
      ease: easings.premium 
    }
  }
};

// ============================================================================
// BUTTON VARIANTS
// Press feedback with scale 0.98
// ============================================================================
export const buttonVariants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.02,
    y: -2,
    transition: { 
      duration: durations.fast, 
      ease: easings.soft 
    }
  },
  tap: { 
    scale: 0.98,
    y: 0,
    transition: { 
      duration: durations.instant, 
      ease: easings.snappy 
    }
  }
};

// ============================================================================
// CARD VARIANTS
// Hover with soft lift + shadow increase + image zoom
// ============================================================================
export const cardVariants = {
  initial: { 
    y: 0,
    boxShadow: "0 1px 3px rgba(111, 78, 55, 0.08)"
  },
  hover: { 
    y: -4,
    boxShadow: "0 12px 24px rgba(111, 78, 55, 0.12)",
    transition: { 
      duration: durations.normal, 
      ease: easings.soft 
    }
  }
};

// Card image zoom on hover
export const cardImageVariants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.03,
    transition: { 
      duration: durations.slow, 
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
      duration: durations.normal, 
      ease: easings.soft 
    }
  }
};

// ============================================================================
// MODAL/DRAWER VARIANTS
// Slide + fade for modals and drawers
// ============================================================================
export const modalBackdropVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: durations.normal, 
      ease: easings.smooth 
    }
  },
  exit: { 
    opacity: 0,
    transition: { 
      duration: durations.fast, 
      ease: easings.smooth 
    }
  }
};

export const modalContentVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95,
    y: 20
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: { 
      duration: durations.normal, 
      ease: easings.premium 
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.98,
    y: 10,
    transition: { 
      duration: durations.fast, 
      ease: easings.smooth 
    }
  }
};

export const drawerVariants = {
  hidden: { x: "100%" },
  visible: { 
    x: 0,
    transition: { 
      duration: durations.normal, 
      ease: easings.premium 
    }
  },
  exit: { 
    x: "100%",
    transition: { 
      duration: durations.fast, 
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
      duration: 1.5,
      ease: "linear",
      repeat: Infinity
    }
  }
};

// ============================================================================
// HEADER VARIANTS
// Subtle opacity change on scroll
// ============================================================================
export const headerVariants = {
  transparent: { 
    backgroundColor: "rgba(250, 247, 242, 0)",
    boxShadow: "0 0 0 rgba(0,0,0,0)"
  },
  scrolled: { 
    backgroundColor: "rgba(250, 247, 242, 0.95)",
    boxShadow: "0 1px 3px rgba(111, 78, 55, 0.08)",
    transition: { 
      duration: durations.normal, 
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
  amount: 0.2,
  margin: "-50px"
};

// ============================================================================
// TRANSITION PRESETS
// Pre-configured transition objects
// ============================================================================
export const transitions = {
  reveal: { duration: durations.reveal, ease: easings.premium },
  hover: { duration: durations.normal, ease: easings.soft },
  tap: { duration: durations.instant, ease: easings.snappy },
  fade: { duration: durations.normal, ease: easings.smooth }
};
