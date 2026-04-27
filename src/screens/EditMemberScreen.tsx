import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, ScrollView } from 'react-native';
import { useFamilyStore } from '../store/useFamilyStore';
import { MemberAPI } from '../services/supabase';
import { supabase } from '../services/supabase';

type Gender = 'male' | 'female' | 'other';

interface Props {
  memberId: string;
  onDone: () => void;
}

export function EditMemberScreen({ memberId, onDone }: Props) {
  const member = useFamilyStore((s) => s.getMember(memberId));
  const updateMember = useFamilyStore((s) => s.updateMember);
  const loadFromSupabase = useFamilyStore((s) => s.loadFromSupabase);

  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (member) {
      setName(member.name);
      setDob(member.dob || '');
      setGender(member.gender as Gender || 'male');
      setBio(member.bio || '');
    }
  }, [member]);

  const handleSave = async () => {
    if (!name) {
      Alert.alert('Error', 'Name required');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      await MemberAPI.update(memberId, {
        name,
        dob: dob || undefined,
        gender,
        bio: bio || undefined,
      });

      updateMember(memberId, { name, dob, gender, bio });
      await loadFromSupabase(user.id);
      Alert.alert('Success', 'Member updated');
      onDone();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  if (!member) {
    return <View />;
  }

  return (
    <ScrollView className="flex-1 p-4 bg-white">
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

      <Button title={loading ? 'Saving...' : 'Save Changes'} onPress={handleSave} disabled={loading} />
      <Button title="Cancel" color="#999" onPress={onDone} />
    </ScrollView>
  );
}
