import { useRef } from "react";
import { Animated, InteractionManager } from "react-native";

export type ScreenType = 'login' | 'roleSelection' | 'form' | 'connect';

export function useLoginAnimations() {
  const fadeBackButton = useRef(new Animated.Value(-100)).current;
  const fadeButton = useRef(new Animated.Value(0)).current;
  const fadeTextArea = useRef(new Animated.Value(0)).current;
  const fadeText = useRef(new Animated.Value(0)).current;
  const fadeButtonText = useRef(new Animated.Value(0)).current;

  // Content section animated values
  const fadeLoginContent = useRef(new Animated.Value(1)).current;
  const fadeRoleContent = useRef(new Animated.Value(0)).current;
  const fadeInputContent = useRef(new Animated.Value(0)).current;
  const fadeConnectContent = useRef(new Animated.Value(0)).current;

  /**
   * Generic navigation function that handles transitions between any two screens
   * @param from - Current screen
   * @param to - Target screen
   * @param beforeAnimation - Callback before animation starts
   * @param afterAnimation - Callback after animation completes
   */
  const navigateToScreen = (
    from: ScreenType,
    to: ScreenType,
    beforeAnimation: () => void,
    afterAnimation: () => void
  ) => {
    beforeAnimation();

    // Get the animated values for from and to screens
    const fromAnimations = getScreenAnimations(from);
    const toAnimations = getScreenAnimations(to);

    // Fade out current screen
    Animated.parallel(
      fromAnimations.map(anim => 
        Animated.timing(anim.value, {
          toValue: anim.hideValue,
          duration: 300,
          useNativeDriver: true,
        })
      )
    ).start(() => {
      InteractionManager.runAfterInteractions(() => {
        afterAnimation();

        // Fade in target screen
        Animated.parallel(
          toAnimations.map(anim =>
            Animated.timing(anim.value, {
              toValue: anim.showValue,
              duration: 500,
              useNativeDriver: true,
            })
          )
        ).start();
      });
    });
  };

  /**
   * Helper function to get animations for each screen
   */
  const getScreenAnimations = (screen: ScreenType) => {
    switch (screen) {
      case 'login':
        return [
          { value: fadeLoginContent, showValue: 1, hideValue: 0 },
          { value: fadeBackButton, showValue: -100, hideValue: -100 },
        ];
      case 'roleSelection':
        return [
          { value: fadeButton, showValue: 1, hideValue: 0 },
          { value: fadeButtonText, showValue: 1, hideValue: 0 },
          { value: fadeBackButton, showValue: 0, hideValue: -100 },
        ];
      case 'form':
        return [
          { value: fadeInputContent, showValue: 1, hideValue: 0 },
          { value: fadeTextArea, showValue: 1, hideValue: 0 },
          { value: fadeText, showValue: 1, hideValue: 0 },
          { value: fadeBackButton, showValue: 0, hideValue: -100 },
        ];
      case 'connect':
        return [
          { value: fadeConnectContent, showValue: 1, hideValue: 0 },
          { value: fadeTextArea, showValue: 1, hideValue: 0 },
          { value: fadeText, showValue: 1, hideValue: 0 },
          { value: fadeBackButton, showValue: 0, hideValue: -100 },
        ];
      default:
        return [];
    }
  };

  // Convenience methods for common transitions
  const animateToLogin = (beforeAnimation: () => void, afterAnimation: () => void) => {
    navigateToScreen('roleSelection', 'login', beforeAnimation, afterAnimation);
  };

  const animateToRoleSelection = (beforeAnimation: () => void, afterAnimation: () => void) => {
    navigateToScreen('login', 'roleSelection', beforeAnimation, afterAnimation);
  };

  const animateToForm = (beforeAnimation: () => void, afterAnimation: () => void) => {
    navigateToScreen('roleSelection', 'form', beforeAnimation, afterAnimation);
  };

  const animateToConnect = (beforeAnimation: () => void, afterAnimation: () => void) => {
    navigateToScreen('form', 'connect', beforeAnimation, afterAnimation);
  };

  const animateBackToForm = (beforeAnimation: () => void, afterAnimation: () => void) => {
    navigateToScreen('connect', 'form', beforeAnimation, afterAnimation);
  };

  const animateBackToRoleSelection = (beforeAnimation: () => void, afterAnimation: () => void) => {
    navigateToScreen('form', 'roleSelection', beforeAnimation, afterAnimation);
  };

  const animateBackToLogin = (beforeAnimation: () => void, afterAnimation: () => void) => {
    navigateToScreen('roleSelection', 'login', beforeAnimation, afterAnimation);
  };

  // Legacy method names for compatibility
  const animateToSelection = animateToRoleSelection;
  const animateBack = animateBackToLogin;
  const animateBackToInput = animateBackToForm;

  return {
    // New flexible navigation
    navigateToScreen,
    
    // Forward navigation
    animateToLogin,
    animateToRoleSelection,
    animateToForm,
    animateToConnect,
    
    // Backward navigation
    animateBackToForm,
    animateBackToRoleSelection,
    animateBackToLogin,
    
    // Legacy names
    animateToSelection,
    animateBack,
    animateBackToInput,
    
    // Animated values
    fadeBackButton,
    fadeTextArea,
    fadeText,
    fadeButtonText,
    fadeButton,
    fadeLoginContent,
    fadeRoleContent,
    fadeInputContent,
    fadeConnectContent,
  };
}