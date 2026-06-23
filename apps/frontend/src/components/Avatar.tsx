import { Image, type StyleProp, type ViewStyle } from 'react-native';

import { resolveMediaUrl } from '@/utils/resolveUrl';

const DEFAULT_AVATAR = require('../../assets/images/default-avatar.png');

type Props = {
  uri?: string | null;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export default function Avatar({ uri, size = 48 }: Props) {
  const resolved = resolveMediaUrl(uri);
  return (
    <Image
      source={resolved ? { uri: resolved } : DEFAULT_AVATAR}
      style={{ width: size, height: size, borderRadius: size / 2 }}
    />
  );
}
