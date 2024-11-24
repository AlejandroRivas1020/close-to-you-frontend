import { useCallback, useState } from 'react';
import { Alert, Platform } from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
  Permission,
} from 'react-native-permissions';

const usePermissions = () => {
  const [cameraGranted, setCameraGranted] = useState(false);
  const [locationGranted, setLocationGranted] = useState(false);

  const checkAndRequestPermission = async (permission: Permission) => {
    try {
      const result = await check(permission);
      if (result === RESULTS.GRANTED) {return true;}

      if (result === RESULTS.DENIED || result === RESULTS.LIMITED) {
        const requestResult = await request(permission);
        return requestResult === RESULTS.GRANTED;
      }

      if (result === RESULTS.BLOCKED) {
        Alert.alert(
          'Permission required',
          'Please enable this permission in settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => openSettings() },
          ]
        );
      }

      return false;
    } catch (error) {
      console.error('Permission error:', error);
      return false;
    }
  };

  const requestCameraPermission = async () => {
    const permission =
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.CAMERA
        : PERMISSIONS.IOS.CAMERA;
    const granted = await checkAndRequestPermission(permission);
    setCameraGranted(granted);
    return granted;
  };

  const requestLocationPermission = useCallback(async () => {
    const permission =
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
    const granted = await checkAndRequestPermission(permission);
    setLocationGranted(granted);
    return granted;
  }, []);

  return {
    cameraGranted,
    locationGranted,
    requestCameraPermission,
    requestLocationPermission,
  };
};

export default usePermissions;
