import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, ChevronLeft, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingTourProps {
  onComplete: () => void;
}

const tourSteps = [
  {
    title: 'Welcome to PredictivePulse!',
    description: 'Your AI-powered market intelligence platform for Namibian industries. Let\'s take a quick tour to get you started.',
    highlight: 'dashboard',
    position: 'center'
  },
  {
    title: 'Navigation Sidebar',
    description: 'Access different sections of the platform from the sidebar. Navigate between Dashboard, Analytics, Industries, and more.',
    highlight: 'sidebar',
    position: 'right'
  },
  {
    title: 'Industry Insights',
    description: 'Explore detailed analytics for specific industries like Mining, Housing, Agriculture, and Green Hydrogen.',
    highlight: 'industries',
    position: 'center'
  },
  {
    title: 'Live Data & Predictions',
    description: 'View real-time market data and AI-generated predictions with confidence scores and risk assessments.',
    highlight: 'data',
    position: 'center'
  },
  {
    title: 'Filters & Controls',
    description: 'Use date ranges, region filters, and industry selectors to customize your data views.',
    highlight: 'filters',
    position: 'left'
  },
  {
    title: 'Help & Feedback',
    description: 'Get help anytime with our contextual help system, and share feedback to improve the platform.',
    highlight: 'help',
    position: 'center'
  }
];

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(onComplete, 300);
  };

  const handleSkip = () => {
    handleComplete();
  };

  const currentStepData = tourSteps[currentStep];

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
          />
          
          {/* Tour Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[101]"
          >
            <Card className="w-96 shadow-2xl border-2 border-primary/20">
              <CardHeader className="text-center relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 h-8 w-8"
                  onClick={handleSkip}
                >
                  <X className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    Step {currentStep + 1} of {tourSteps.length}
                  </Badge>
                </div>
                
                <CardTitle className="text-xl">{currentStepData.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {currentStepData.description}
                </p>
                
                {/* Progress indicator */}
                <div className="flex justify-center gap-2">
                  {tourSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentStep 
                          ? 'bg-primary' 
                          : index < currentStep 
                            ? 'bg-primary/50' 
                            : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
                
                {/* Action buttons */}
                <div className="flex justify-between items-center pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSkip}
                  >
                    Skip Tour
                  </Button>
                  
                  <div className="flex gap-2">
                    {currentStep > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrevious}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      onClick={handleNext}
                      className="gap-1"
                    >
                      {currentStep === tourSteps.length - 1 ? (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          Get Started
                        </>
                      ) : (
                        <>
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};