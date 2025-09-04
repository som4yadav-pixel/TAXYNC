import React, { useState, useEffect, useRef } from 'react';
import Joyride, { Step } from 'react-joyride';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';

const MrQuillTour: React.FC = () => {
  const [runTour, setRunTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [owlData, setOwlData] = useState<any | null>(null);
  const hasStartedRef = useRef(false);

  const [steps] = useState<Step[]>([
    {
      target: '#tour-step-1',
      content: '👋 Welcome to Taxync—your smarter way to handle taxes.',
      disableBeacon: true,
    },
    {
      target: '#tour-step-2',
      content: 'Here’s your Dashboard: manage income, deductions, and savings.',
    },
    {
      target: '#tour-step-3',
      content: 'Compare Old vs New Regimes with clear, interactive visuals.',
    },
    {
      target: '#tour-step-4',
      content: 'Export results to PDF/Excel instantly.',
    },
    {
      target: 'body',
      content: 'That’s it 🚀 Meet Mr. Quill again anytime in Settings.',
      placement: 'center',
    },
  ]);

  useEffect(() => {
    try {
      const hasSeenTour = localStorage.getItem('hasSeenTour');
      console.log('[MrQuillTour] mount -> hasSeenTour:', hasSeenTour);
      if (!hasSeenTour) {
        setTourStep(0);
        setRunTour(true);
        console.log('[MrQuillTour] starting tour (first time)');
      } else {
        console.log('[MrQuillTour] tour already seen; not running');
      }
    } catch (e) {
      console.warn('[MrQuillTour] localStorage unavailable:', e);
    }
  }, []);

  // Load owl animation JSON from public folder at runtime
  useEffect(() => {
    let isMounted = true;
    fetch('/animations/owl.json')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          // Basic validation: Lottie JSON typically has version 'v' and 'layers' or 'assets'
          const isValidLottie = data && (data.v || data.layers || data.assets);
          setOwlData(isValidLottie ? data : null);
        }
      })
      .catch(() => {
        if (isMounted) setOwlData(null);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Debug state changes
  useEffect(() => {
    console.log('[MrQuillTour] runTour changed:', runTour);
  }, [runTour]);

  useEffect(() => {
    console.log('[MrQuillTour] tourStep changed:', tourStep);
  }, [tourStep]);

  const handleJoyrideCallback = (data: any) => {
    const { action, index, status, type } = data;
    console.log('[MrQuillTour] callback ->', { action, index, status, type });

    // Mark tour as seen as soon as it actually starts showing the first tooltip
    if (
      !hasStartedRef.current &&
      (
        status === 'running' ||
        type === 'tour:start' ||
        ((type === 'tooltip:show' || type === 'tooltip:open' || type === 'tooltip:after' || type === 'step:after') && index === 0)
      )
    ) {
      hasStartedRef.current = true;
      try {
        localStorage.setItem('hasSeenTour', 'true');
        console.log('[MrQuillTour] marked hasSeenTour at tour start');
      } catch (e) {
        console.warn('[MrQuillTour] unable to set hasSeenTour at start:', e);
      }
    }

    // Keep internal step index in sync
    if (['step:after', 'tour:end'].includes(type)) {
      const nextStep = action === 'next' ? index + 1 : index;
      setTourStep(nextStep);
    }

    // Gracefully log missing targets
    if (type === 'error:target_not_found' || type === 'target:notFound') {
      console.warn('[MrQuillTour] target not found for step', index);
    }

    // When the tour ends, ensure we stop and persist the flag
    if (['finished', 'skipped'].includes(status)) {
      setRunTour(false);
      try {
        localStorage.setItem('hasSeenTour', 'true');
      } catch {/* no-op */}
      console.log(`[MrQuillTour] tour ${status}; marked seen and stopped`);
    }
  };

  const currentStepContent = steps[tourStep]?.content as string;

  return (
    <>
      <Joyride
        run={runTour}
        steps={steps}
        continuous
        showProgress
        showSkipButton
        callback={handleJoyrideCallback}
        styles={{
          options: {
            arrowColor: '#fff',
            backgroundColor: '#fff',
            primaryColor: '#663399',
            textColor: '#333',
            zIndex: 1000,
          },
          tooltip: {
            borderRadius: '8px',
          },
        }}
      />
      {runTour && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          className="fixed bottom-4 right-4 z-[1001] flex items-end space-x-2"
        >
          <div className="bg-white shadow-lg rounded-xl px-4 py-2 text-gray-800 max-w-xs">
            {currentStepContent}
          </div>
          {owlData && (
            <Lottie animationData={owlData} style={{ width: 100, height: 100 }} />
          )}
        </motion.div>
      )}
    </>
  );
};

export default MrQuillTour;
