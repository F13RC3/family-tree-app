import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text, Button } from 'react-native';
import { AuthScreen } from './src/screens/AuthScreen';
import { MemberForm } from './src/screens/MemberForm';
import { MemberListScreen } from './src/screens/MemberListScreen';
import { TreeVisualizer } from './src/components/TreeVisualizer';
import { RelationshipScreen } from './src/screens/RelationshipScreen';
import { supabase } from './src/services/supabase';
import { Session } from '@supabase/supabase-js';

type Tab = 'list' | 'add' | 'rel' | 'tree';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('list');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!session) {
    return <AuthScreen />;
  }

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
        <Text className="text-xl font-bold">Family Tree</Text>
        <Button title="Sign Out" onPress={handleSignOut} />
      </View>

      <View className="flex-row flex-wrap border-b border-gray-200">
        <Button title="Members" onPress={() => setTab('list')} />
        <Button title="Add" onPress={() => setTab('add')} />
        <Button title="Link" onPress={() => setTab('rel')} />
        <Button title="Tree" onPress={() => setTab('tree')} />
      </View>

      {tab === 'list' && <MemberListScreen />}
      {tab === 'add' && <MemberForm />}
      {tab === 'rel' && <RelationshipScreen />}
      {tab === 'tree' && <TreeVisualizer />}
    </View>
  );
}
