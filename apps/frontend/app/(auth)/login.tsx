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
import { s } from '@/utils/scale';
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

  if (Platform.OS === 'web') {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#f0f2f5',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            width: 400,
            padding: 40,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 24,
          }}
        >
          <Text
            style={{
              fontSize: 22,
              fontWeight: '700',
              color: '#FF8700',
              textAlign: 'center',
              marginBottom: 4,
            }}
          >
            Portal
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: '#bbb',
              textAlign: 'center',
              marginBottom: 32,
            }}
          >
            サインインしてください
          </Text>

          <Text style={{ color: '#999', fontSize: 12, marginBottom: 6 }}>Username</Text>
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={{
                  height: 44,
                  borderWidth: 1,
                  borderColor: errors.username ? '#ff4444' : '#e0e0e0',
                  borderRadius: 8,
                  paddingHorizontal: 14,
                  fontSize: 14,
                  color: '#555',
                  marginBottom: errors.username ? 4 : 20,
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
            <Text style={{ color: '#ff4444', fontSize: 11, marginBottom: 16 }}>
              {errors.username.message}
            </Text>
          )}

          <Text style={{ color: '#999', fontSize: 12, marginBottom: 6 }}>Password</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={{
                  height: 44,
                  borderWidth: 1,
                  borderColor: errors.password ? '#ff4444' : '#e0e0e0',
                  borderRadius: 8,
                  paddingHorizontal: 14,
                  fontSize: 14,
                  color: '#555',
                  marginBottom: errors.password ? 4 : 28,
                }}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry
              />
            )}
          />
          {errors.password && (
            <Text style={{ color: '#ff4444', fontSize: 11, marginBottom: 24 }}>
              {errors.password.message}
            </Text>
          )}

          <TouchableOpacity
            style={{
              backgroundColor: '#FF8700',
              borderRadius: 8,
              height: 44,
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
              <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>SIGN IN</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View
        style={{
          backgroundColor: '#fafafa',
          borderRadius: s(8),
          width: '80%',
          paddingHorizontal: s(24),
          paddingTop: s(20),
          paddingBottom: s(28),
        }}
      >
        <Text
          style={{
            fontSize: s(24),
            color: '#000000',
            textAlign: 'center',
            marginBottom: s(24),
            fontWeight: '400',
          }}
        >
          Sign In
        </Text>

        <Text style={{ color: '#c8c8c8', fontSize: s(10), marginBottom: s(4) }}>Username</Text>
        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={{
                height: s(35),
                borderBottomWidth: 1,
                borderBottomColor: '#e0e0e0',
                fontSize: s(13),
                color: '#555',
                marginBottom: errors.username ? s(4) : s(16),
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
          <Text style={{ color: '#ff4444', fontSize: s(10), marginBottom: s(12) }}>
            {errors.username.message}
          </Text>
        )}

        <Text style={{ color: '#c8c8c8', fontSize: s(10), marginBottom: s(4) }}>Password</Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={{
                height: s(35),
                borderBottomWidth: 1,
                borderBottomColor: '#e0e0e0',
                fontSize: s(13),
                color: '#555',
                marginBottom: errors.password ? s(4) : s(20),
              }}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
            />
          )}
        />
        {errors.password && (
          <Text style={{ color: '#ff4444', fontSize: s(10), marginBottom: s(16) }}>
            {errors.password.message}
          </Text>
        )}

        <TouchableOpacity
          style={{
            backgroundColor: '#ff8700',
            borderRadius: s(24),
            height: s(26),
            width: s(160),
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
            <Text style={{ color: '#ffffff', fontSize: s(12) }}>SIGN IN</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
