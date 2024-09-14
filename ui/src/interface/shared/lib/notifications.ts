import { notifications as _notifications } from '@mantine/notifications';

export const notifications = {
  accountCreated() {
    _notifications.show({
      title: 'Account Created',
      message: 'Welcome to Doctype!',
      autoClose: 5000,
    });
  },
  notVerifiedAccount() {
    _notifications.show({
      title: 'Account is not verified',
      message: 'Please, provide your verification code.',
      autoClose: 10000,
    });
  },

  showCloudSyncReminder() {
    setTimeout(() => {
      _notifications.show({
        title: 'Could Storage',
        message: 'Sign In to sync your progress with Cloud!',
        autoClose: 10000,
      });
    }, 7500);
  },

  oauthFailed() {
    _notifications.show({
      title: 'OAuth Sign-In Failed',
      message: 'Unfortunately, we cannot proceed with the sign-in now',
      color: 'red',
      autoClose: 6000,
    });
  },
};
