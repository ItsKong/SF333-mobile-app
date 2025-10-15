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
   * Screen configuration - defines which animations belong to each screen
   * and their show/hide values
   */
  const screenConfig: Record<ScreenType, Array<{
    value: Animated.Value;
    showValue: number;
    hideValue: number;
  }>> = {
    login: [
      { value: fadeLoginContent, showValue: 1, hideValue: 0 },
      { value: fadeBackButton, showValue: -100, hideValue: -100 },
      { value: fadeButton, showValue: 0, hideValue: 0 },
      { value: fadeButtonText, showValue: 0, hideValue: 0 },
      { value: fadeTextArea, showValue: 0, hideValue: 0 },
      { value: fadeText, showValue: 0, hideValue: 0 },
      { value: fadeInputContent, showValue: 0, hideValue: 0 },
      { value: fadeConnectContent, showValue: 0, hideValue: 0 },
    ],
    roleSelection: [
      { value: fadeButton, showValue: 1, hideValue: 0 },
      { value: fadeButtonText, showValue: 1, hideValue: 0 },
      { value: fadeBackButton, showValue: 0, hideValue: -100 },
      { value: fadeLoginContent, showValue: 0, hideValue: 0 },
      { value: fadeTextArea, showValue: 0, hideValue: 0 },
      { value: fadeText, showValue: 0, hideValue: 0 },
      { value: fadeInputContent, showValue: 0, hideValue: 0 },
      { value: fadeConnectContent, showValue: 0, hideValue: 0 },
    ],
    form: [
      { value: fadeInputContent, showValue: 1, hideValue: 0 },
      { value: fadeTextArea, showValue: 1, hideValue: 0 },
      { value: fadeText, showValue: 1, hideValue: 0 },
      { value: fadeBackButton, showValue: 0, hideValue: -100 },
      { value: fadeLoginContent, showValue: 0, hideValue: 0 },
      { value: fadeButton, showValue: 0, hideValue: 0 },
      { value: fadeButtonText, showValue: 0, hideValue: 0 },
      { value: fadeConnectContent, showValue: 0, hideValue: 0 },
    ],
    connect: [
      { value: fadeConnectContent, showValue: 1, hideValue: 0 },
      { value: fadeTextArea, showValue: 1, hideValue: 0 },
      { value: fadeText, showValue: 1, hideValue: 0 },
      { value: fadeBackButton, showValue: 0, hideValue: -100 },
      { value: fadeLoginContent, showValue: 0, hideValue: 0 },
      { value: fadeButton, showValue: 0, hideValue: 0 },
      { value: fadeButtonText, showValue: 0, hideValue: 0 },
      { value: fadeInputContent, showValue: 0, hideValue: 0 },
    ],
  };

  /**
   * Universal navigation function
   * Transitions from any screen to any other screen dynamically
   */
  const navigateToScreen = (
    from: ScreenType,
    to: ScreenType,
    beforeAnimation: () => void,
    afterAnimation: () => void
  ) => {
    beforeAnimation();

    const fromConfig = screenConfig[from];
    const toConfig = screenConfig[to];

    // Fade out elements that need to hide
    const fadeOutAnimations = fromConfig
      .filter(anim => {
        const toAnim = toConfig.find(t => t.value === anim.value);
        return !toAnim || toAnim.showValue !== anim.showValue;
      })
      .map(anim =>
        Animated.timing(anim.value, {
          toValue: anim.hideValue,
          duration: 300,
          useNativeDriver: true,
        })
      );

    // Execute fade out
    Animated.parallel(fadeOutAnimations).start(() => {
      InteractionManager.runAfterInteractions(() => {
        afterAnimation();

        // Fade in elements that need to show
        const fadeInAnimations = toConfig
          .filter(anim => {
            const fromAnim = fromConfig.find(f => f.value === anim.value);
            return !fromAnim || fromAnim.showValue !== anim.showValue;
          })
          .map(anim =>
            Animated.timing(anim.value, {
              toValue: anim.showValue,
              duration: 500,
              useNativeDriver: true,
            })
          );

        // Execute fade in
        Animated.parallel(fadeInAnimations).start();
      });
    });
  };

  /**
   * Initialize a screen's animation values
   * Useful for setting initial state or resetting
   */
  const setScreenState = (screen: ScreenType, animated: boolean = false) => {
    const config = screenConfig[screen];
    
    if (animated) {
      Animated.parallel(
        config.map(anim =>
          Animated.timing(anim.value, {
            toValue: anim.showValue,
            duration: 0,
            useNativeDriver: true,
          })
        )
      ).start();
    } else {
      config.forEach(anim => {
        anim.value.setValue(anim.showValue);
      });
    }
  };

  return {
    // Main navigation function
    navigateToScreen,
    
    // Helper to set screen state
    setScreenState,
    
    // Animated values (for direct use in components)
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