import { useCallback } from 'react';
import { Keyboard } from 'react-native';

/**
 * Hook that provides keyboard dismissal functionality
 * Returns a function to dismiss the keyboard
 */
export function useKeyboardDismiss() {
  const dismissKeyboard = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  return dismissKeyboard;
}

