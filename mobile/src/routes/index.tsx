import { useContext, useEffect, useState } from 'react';
import { useTheme, Box } from 'native-base';
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { useAuth } from '@hooks/useAuth';
import { AuthRoutes } from "./auth.routes";
import { AppRoutes } from "./app.routes";
import { Loading } from '@components/Loading';
import { OneSignal, NotificationWillDisplayEvent, OSNotification } from 'react-native-onesignal';
import { Notification } from '@components/Notification';

export function Routes() {
  const [notification, setNotification] = useState<OSNotification>();

  const { colors } = useTheme();
  const { user, isLoadingUserStorageData } = useAuth();

  function getLinking() {
    const prefixes = ['com.datagro.ignitegymchallenge://', 'ignitegymchallenge://', 'exp+ignitegymchallenge://'];

    if (user.id) {
      return {
        prefixes,
        config: {
          screens: {
            home: {
              path: 'home'
            },
            exercise: {
              path: 'exercise/:exerciseId',
              parse: {
                exerciseId: (exerciseId: string) => exerciseId
              }
            },
            history: {
              path: 'history'
            },
          },
        }
      }
    } else {
      return {
        prefixes,
        config: {
          screens: {
            signIn: {
              path: 'signin'
            },
            signUp: {
              path: 'signup'
            },
          }
        }
      }
    }
  }

  const linking = getLinking();

  const theme = DefaultTheme;
  theme.colors.background = colors.gray[700];

  if (isLoadingUserStorageData) {
    return <Loading />
  }

  useEffect(() => {
    const handleNotification = (event: NotificationWillDisplayEvent): void => {
      event.preventDefault();
      const response = event.getNotification();
      setNotification(response);
    }

    OneSignal.Notifications.addEventListener("foregroundWillDisplay", handleNotification);

    return () => OneSignal.Notifications.removeEventListener("foregroundWillDisplay", handleNotification);
  }, []);

  function handleNotificationClose() {
    setNotification(undefined);
  }

  return (
    <Box flex={1} bg="gray.700">
      <NavigationContainer theme={theme} linking={linking}>
        {user.id ?
          <>
            <AppRoutes />
            {notification?.title &&
              (
                <Notification data={notification} onClose={handleNotificationClose} />
              )
            }
          </>
          :
          <AuthRoutes />}
      </NavigationContainer>
    </Box>
  );
}
