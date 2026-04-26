import React, { useState } from 'react';
import { View, TextInput, Button, Text, ActivityIndicator, Alert } from 'react-native';
import { AuthAPI } from '../services/supabase';

type Mode = 'signin' | 'signup';

export function AuthScreen() {
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email and password required');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signin') {
        await AuthAPI.signIn(email, password);
      } else {
        await AuthAPI.signUp(email, password);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center p-6 bg-white">
      <Text className="text-2xl font-bold mb-8 text-gray-800">
        {mode === 'signin' ? 'Sign In' : 'Create Account'}
      </Text>

      <TextInput
        className="w-full h-12 px-4 mb-4 border border-gray-300 rounded-lg"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        className="w-full h-12 px-4 mb-6 border border-gray-300 rounded-lg"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title={mode === 'signin' ? 'Sign In' : 'Sign Up'} onPress={handleSubmit} />
      )}

      <Button
        title={mode === 'signin' ? 'Need an account? Sign up' : 'Have an account? Sign in'}
        onPress={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
      />
    </View>
  );
}
