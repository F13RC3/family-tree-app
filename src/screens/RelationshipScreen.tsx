import React, { useState } from 'react';
import { View, Text, Button, FlatList, Alert, StyleSheet } from 'react-native';
import { useFamilyStore } from '../store/useFamilyStore';
import { RelationshipAPI } from '../services/supabase';
import { supabase } from '../services/supabase';

type RelType = 'parent' | 'spouse';

export function RelationshipScreen() {
  const members = useFamilyStore((s) => s.members);
  const addRelationship = useFamilyStore((s) => s.addRelationship);
  const relationships = useFamilyStore((s) => s.relationships);
  const loadFromSupabase = useFamilyStore((s) => s.loadFromSupabase);

  const [fromId, setFromId] = useState<string | null>(null);
  const [toId, setToId] = useState<string | null>(null);
  const [type, setType] = useState<RelType>('parent');

  const handleCreate = async () => {
    if (!fromId || !toId) {
      Alert.alert('Error', 'Select both members');
      return;
    }
    if (fromId === toId) {
      Alert.alert('Error', 'Cannot relate member to self');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const rel = await RelationshipAPI.create({
        user_id: user.id,
        from_id: fromId,
        to_id: toId,
        type,
      });

      addRelationship(rel);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) await loadFromSupabase(user.id);
      setFromId(null);
      setToId(null);
      Alert.alert('Success', 'Relationship added');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed';
      Alert.alert('Error', msg);
    }
  };

  const getRelationCount = (id: string) => {
    return relationships.filter(r => r.fromId === id || r.toId === id).length;
  };

  const MemberCard = ({ id, selected, onPress }: { id: string; selected: boolean; onPress: () => void }) => {
    const member = members.find(m => m.id === id);
    if (!member) return null;
    return (
      <View style={[styles.card, selected && styles.selected]} onTouchEnd={onPress}>
        <Text className="font-semibold">{member.name}</Text>
        <Text className="text-xs text-gray-500">{getRelationCount(id)} relationships</Text>
      </View>
    );
  };

  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-lg font-bold mb-4">Link Relationships</Text>

      <Text className="mb-2">Step 1: Select first member</Text>
      <FlatList
        horizontal
        data={members}
        keyExtractor={(m) => m.id}
        renderItem={({ item }) => (
          <MemberCard
            id={item.id}
            selected={fromId === item.id}
            onPress={() => setFromId(item.id)}
          />
        )}
        className="mb-4"
      />

      <Text className="mb-2">Step 2: Select second member</Text>
      <FlatList
        horizontal
        data={members}
        keyExtractor={(m) => m.id}
        renderItem={({ item }) => (
          <MemberCard
            id={item.id}
            selected={toId === item.id}
            onPress={() => setToId(item.id)}
          />
        )}
        className="mb-4"
      />

      <Text className="mb-2">Step 3: Select relationship type</Text>
      <View className="flex-row mb-4">
        <Button title="Parent" onPress={() => setType('parent')} color={type === 'parent' ? '#007AFF' : '#ccc'} />
        <Button title="Spouse" onPress={() => setType('spouse')} color={type === 'spouse' ? '#007AFF' : '#ccc'} />
      </View>

      <Button
        title="Create Relationship"
        onPress={handleCreate}
        disabled={!fromId || !toId}
      />

      <Text className="text-sm text-gray-500 mt-4">
        Tip: "Parent" means first member is parent of second member.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    marginHorizontal: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    minWidth: 120,
  },
  selected: {
    backgroundColor: '#007AFF',
  },
});
