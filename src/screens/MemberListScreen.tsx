import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useFamilyStore } from '../store/useFamilyStore';
import { supabase } from '../services/supabase';

export function MemberListScreen() {
  const members = useFamilyStore((s) => s.members);
  const loadFromSupabase = useFamilyStore((s) => s.loadFromSupabase);
  const deleteMember = useFamilyStore((s) => s.deleteMember);
  const setSelectedMember = useFamilyStore((s) => s.setSelectedMember);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await loadFromSupabase(user.id);
    } catch (err) {
      console.error('Load failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete', 'Remove this member?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await MemberAPI.delete(id);
            deleteMember(id);
          } catch (err) {
            Alert.alert('Error', 'Delete failed');
          }
        },
      },
    ]);
  };

  if (loading) {
    return <ActivityIndicator size="large" className="mt-10" />;
  }

  const handleRefresh = () => {
    setLoading(true);
    loadMembers();
  };

  return (
    <View className="flex-1 p-4 bg-white">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-bold">Family Members</Text>
        <Button title="Refresh" onPress={handleRefresh} />
      </View>

      {members.length === 0 ? (
        <Text className="text-gray-500 text-center mt-10">No members yet. Add one!</Text>
      ) : (
        <FlatList
          data={members}
          keyExtractor={(m) => m.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text className="text-lg font-semibold">{item.name}</Text>
              {item.dob && <Text className="text-gray-600">DOB: {item.dob}</Text>}
              {item.gender && <Text className="text-gray-600">Gender: {item.gender}</Text>}
              <View className="flex-row mt-2">
                <Button title="Select" onPress={() => setSelectedMember(item.id)} />
                <Button title="Delete" color="#ff3b30" onPress={() => handleDelete(item.id)} />
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
});
