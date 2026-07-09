import { Platform, ToastAndroid } from 'react-native';
import {showMessage} from 'react-native-flash-message';

export const showSuccess = message => {
  showMessage({type: 'success', icon: 'success', message});
};

export const showError = message => {
  showMessage({type: 'danger', icon: 'danger', message});
};

export const showWarning = message => {
  showMessage({type: 'warning', icon: 'warning', message});
};
export const ToastMsg = msg => {
  const message = typeof msg === 'string' ? msg : String(msg || '');
  if (!message) return;

  if (Platform.OS === 'android') {
    ToastAndroid.showWithGravity(
      message,
      ToastAndroid.LONG,
      ToastAndroid.CENTER,
    );
    return;
  }

  showMessage({
    type: 'default',
    icon: 'auto',
    message,
  });
};