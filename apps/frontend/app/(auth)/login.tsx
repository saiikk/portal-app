import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useAuthStore } from '@/stores/authStore';
import { loginSchema, type LoginSchema } from '@/validations/loginSchema';

export default function LoginScreen() {
  const { login } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });

  const onSubmit = async (data: LoginSchema) => {
    setIsSubmitting(true);
    try {
      await login({ email: `${data.username}@example.com`, password: data.password });
    } catch {
      Alert.alert('ログインエラー', 'メールアドレスまたはパスワードが正しくありません。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* フォームカード — Figma: bg #fafafa, rounded 8px, w=205px相当 */}
      <View
        style={{
          backgroundColor: '#fafafa',
          borderRadius: 8,
          width: '80%',
          paddingHorizontal: 24,
          paddingTop: 20,
          paddingBottom: 28,
        }}
      >
        {/* タイトル */}
        <Text
          style={{
            fontSize: 24,
            color: '#000000',
            textAlign: 'center',
            marginBottom: 24,
            fontWeight: '400',
          }}
        >
          Sign In
        </Text>

        {/* Username */}
        <Text style={{ color: '#c8c8c8', fontSize: 10, marginBottom: 4 }}>Username</Text>
        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={{
                height: 35,
                borderBottomWidth: 1,
                borderBottomColor: '#e0e0e0',
                fontSize: 13,
                color: '#000',
                marginBottom: errors.username ? 4 : 16,
              }}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              autoCorrect={false}
            />
          )}
        />
        {errors.username && (
          <Text style={{ color: '#ff4444', fontSize: 10, marginBottom: 12 }}>
            {errors.username.message}
          </Text>
        )}

        {/* Password */}
        <Text style={{ color: '#c8c8c8', fontSize: 10, marginBottom: 4 }}>Password</Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={{
                height: 35,
                borderBottomWidth: 1,
                borderBottomColor: '#e0e0e0',
                fontSize: 13,
                color: '#000',
                marginBottom: errors.password ? 4 : 20,
              }}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
            />
          )}
        />
        {errors.password && (
          <Text style={{ color: '#ff4444', fontSize: 10, marginBottom: 16 }}>
            {errors.password.message}
          </Text>
        )}

        {/* SIGN IN ボタン — Figma: bg #ff8700, w=160px, h≈26px, rounded 24px */}
        <TouchableOpacity
          style={{
            backgroundColor: '#ff8700',
            borderRadius: 24,
            height: 26,
            width: 160,
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          activeOpacity={0.8}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={{ color: '#ffffff', fontSize: 12 }}>SIGN IN</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
