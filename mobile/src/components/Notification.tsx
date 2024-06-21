import { Pressable, HStack, Text, IconButton, CloseIcon, VStack } from 'native-base';
import { OSNotification } from 'react-native-onesignal';
import * as Linking from 'expo-linking';

type Props = {
  data: OSNotification;
  onClose: () => void;
}

export function Notification({ data, onClose }: Props) {

  function handleOnPress() {
    console.log('Notification data:', data);

    let launchURL;
    if (typeof data.rawPayload === 'string') {
      try {
        const payload = JSON.parse(data.rawPayload);
        const custom = JSON.parse(payload.custom);
        launchURL = custom.u;
      } catch (error) {
        console.error('Error parsing rawPayload:', error);
      }
    }
    console.log('Launch URL:', launchURL);

    if (launchURL) {
      Linking.openURL(launchURL);
      onClose();
    }
  }

  return (
    <Pressable
      w="100%"
      p={0}
      pt={12}
      bgColor="gray.100"
      position="absolute"
      top={0}
      onPress={handleOnPress}>
      <HStack
        w="100%"
        p={4}
        pt={12}
        justifyContent="space-between"
        alignItems="center"
        bgColor="gray.200"
        position="absolute"
        top={0}
      >
        <VStack>

          <Text fontSize={'md'} fontFamily={'heading'} flex={1}>
            {data.title}
          </Text>
          <Text fontSize={'md'} fontFamily={'body'} flex={1}>
            {data.body}
          </Text>
        </VStack>

        <IconButton
          variant={'unstyled'}
          _focus={{ borderWidth: 0 }}
          icon={<CloseIcon size='3' />}
          _icon={{ color: 'coolGray.600' }}
          color={'black'}
          onPress={onClose}
        />
      </HStack>
    </Pressable>
  );
}
