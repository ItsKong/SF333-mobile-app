import { useRef } from "react";
import { Animated, InteractionManager } from "react-native";

// hooks/useLoginAnimations.ts
export function useLoginAnimations() {
  const fadeBackButton = useRef(new Animated.Value(-100)).current;
  const fadeButton = useRef(new Animated.Value(1)).current;
  const fadeTextArea = useRef(new Animated.Value(0)).current;
  const fadeText = useRef(new Animated.Value(0)).current;
  const fadeButtonText = useRef(new Animated.Value(1)).current;
  
  // New animated values for content sections
  const fadeInputContent = useRef(new Animated.Value(0)).current;
  const fadeConnectContent = useRef(new Animated.Value(0)).current;

  const animateToSelection = (
    beforeAnimation: () => void, // Your setSelectedRole goes here
    afterAnimation: () => void // Your setHasSelected goes here
  ) => {
    beforeAnimation(); // Execute your logic BEFORE

    Animated.parallel([
      Animated.timing(fadeButton, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeButtonText, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      InteractionManager.runAfterInteractions(() => {
        afterAnimation(); // Execute your logic AFTER

        // Continue with more animations and show input content
        Animated.parallel([
          Animated.timing(fadeTextArea, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(fadeBackButton, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(fadeText, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(fadeInputContent, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start();
      });
    });
  };

  const animateToConnect = (
    beforeAnimation: () => void,
    afterAnimation: () => void
  ) => {
    beforeAnimation(); // Execute your logic BEFORE

    // Fade out input content
    Animated.timing(fadeInputContent, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      InteractionManager.runAfterInteractions(() => {
        afterAnimation(); // Execute your logic AFTER (setHasConfirm)

        // Fade in connect content
        Animated.timing(fadeConnectContent, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    });
  };

  const animateBack = (
    beforeAnimation: () => void,
    afterAnimation: () => void
  ) => {
    beforeAnimation(); // Any logic before back animation

    Animated.parallel([
      Animated.timing(fadeTextArea, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeBackButton, {
        toValue: -100,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeText, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeInputContent, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeConnectContent, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      InteractionManager.runAfterInteractions(() => {
        afterAnimation(); // Your reset logic here

        Animated.parallel([
          Animated.timing(fadeButton, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(fadeButtonText, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start();
      });
    });
  };

  const animateBackToInput = (
    beforeAnimation: () => void,
    afterAnimation: () => void
  ) => {
    beforeAnimation(); // Any logic before animation

    // Fade out connect content
    Animated.timing(fadeConnectContent, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      InteractionManager.runAfterInteractions(() => {
        afterAnimation(); // Your reset logic here (setHasConfirm to false)

        // Fade in input content
        Animated.timing(fadeInputContent, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    });
  };

  return {
    animateToSelection,
    animateToConnect,
    animateBack,
    animateBackToInput,
    fadeBackButton,
    fadeTextArea,
    fadeText,
    fadeButtonText,
    fadeButton,
    fadeInputContent,
    fadeConnectContent,
  };
}