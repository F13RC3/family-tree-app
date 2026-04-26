import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, ScrollView } from 'react-native';
import { useFamilyStore } from '../store/useFamilyStore';
import { MemberAPI } from '../services/supabase';
import { supabase } from '../services/supabase';

type Gender = 'male' | 'female' | 'other';

interface Props {
  onSuccess?: () => void;
}

export function MemberForm({ onSuccess }: Props) {
  const session = useFamilyStore((s) => s.selectedMemberId);
  const addMember = useFamilyStore((s) => s.addMember);

  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name) {
      Alert.alert('Error', 'Name required');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const member = await MemberAPI.create({
        user_id: user.id,
        name,
        dob: dob || undefined,
        gender,
        bio: bio || undefined,
      });

      addMember(member);
      setName('');
      setDob('');
      setBio('');
      Alert.alert('Success', 'Member added');
      onSuccess?.();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to add member';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 p-4 bg-white">
      <Text className="text-lg font-bold mb-4">Add Family Member</Text>

      <TextInput
        className="w-full h-12 px-4 mb-3 border border-gray-300 rounded"
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        className="w-full h-12 px-4 mb-3 border border-gray-300 rounded"
        placeholder="Date of Birth (YYYY-MM-DD)"
        value={dob}
        onChangeText={setDob}
      />

      <View className="flex-row mb-3">
        {(['male', 'female', 'other'] as Gender[]).map((g) => (
          <Button
            key={g}
            title={g}
            onPress={() => setGender(g)}
            color={gender === g ? '#007AFF' : '#ccc'}
          />
        ))}
      </View>

      <TextInput
        className="w-full h-24 px-4 mb-4 border border-gray-300 rounded"
        placeholder="Bio (optional)"
        value={bio}
        onChangeText={setBio}
        multiline
      />

      <Button
        title={loading ? 'Saving...' : 'Add Member'}
        onPress={handleSubmit}
        disabled={loading}
      />
    </ScrollView>
  );
}
