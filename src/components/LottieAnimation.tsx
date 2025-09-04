import { motion } from 'framer-motion';
import Lottie from 'lottie-react';

interface LottieAnimationProps {
  animationData: any;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  ariaLabel?: string;
}

/**
 * LottieAnimation Component
 * 
 * A reusable component for displaying Lottie animations with Framer Motion integration.
 * 
 * @example
 * ```tsx
 * import { LottieAnimation } from './components/LottieAnimation';
 * import dashboardAnimation from './assets/dashboard-animation.json';
 * 
 * // Basic usage
 * <LottieAnimation 
 *   animationData={dashboardAnimation}
 *   className="w-64 h-64"
 * />
 * 
 * // With custom props
 * <LottieAnimation 
 *   animationData={dashboardAnimation}
 *   loop={false}
 *   autoplay={true}
 *   className="w-full h-96"
 * />
 * ```
 * 
 * @suggested_animation
 * Premium Lottie animation for dashboard: 
 * https://lottiefiles.com/animations/data-analytics-dashboard-finance-abstract-motion-9f9fhqsk
 * 
 * This animation shows data analytics dashboard with finance abstract motion,
 * perfect for tax calculation and financial dashboard interfaces.
 */
export function LottieAnimation({ 
  animationData, 
  loop = true, 
  autoplay = true, 
  className = "w-full h-full",
  ariaLabel = "Animation"
}: LottieAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        ease: "easeOut",
        delay: 0.2
      }}
      className={className}
    >
      <Lottie
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        style={{ width: '100%', height: '100%' }}
        aria-label={ariaLabel}
      />
    </motion.div>
  );
}
