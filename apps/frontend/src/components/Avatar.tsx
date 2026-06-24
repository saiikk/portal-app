import { Image, type StyleProp, type ViewStyle } from 'react-native';

const DEFAULT_AVATAR = require('../../assets/images/default-avatar.png');

type Props = {
  uri?: string | null;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export default function Avatar({ uri, size = 48 }: Props) {
  return (
    <Image
      source={uri ? { uri } : DEFAULT_AVATAR}
      style={{ width: size, height: size, borderRadius: size / 2 }}
    />
  );
}
