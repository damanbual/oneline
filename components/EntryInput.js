import React, { useState, useContext } from 'react';
import { View, TextInput, Button } from 'react-native';
import { supabase } from '../utils/supabaseClient';
import { AuthContext } from '../context/AuthContext';

export default function EntryInput({ onEntryAdded }) {
  const [content, setContent] = useState('');
  const { user } = useContext(AuthContext); // ✅ Pull `user` directly

  const handleAddEntry = async () => {
    const userId = user?.id;
    console.log('User ID being sent:', userId);
    console.log('Content being sent:', content);

    if (!content.trim() || !userId) return;

    const { data, error } = await supabase.from('entries').insert([
      {
        user_id: userId,
        content,
        entry_date: new Date().toISOString().split('T')[0], // yyyy-mm-dd
      },
    ]);

    console.log('Supabase insert result:', data, error);

    if (!error) {
      setContent('');
      onEntryAdded(); // refresh entries
    } else {
      console.error('Insert error:', error.message);
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <TextInput
        placeholder="Write a one-liner..."
        value={content}
        onChangeText={setContent}
        style={{
          borderColor: '#ccc',
          borderWidth: 1,
          padding: 12,
          marginBottom: 8,
          borderRadius: 6,
        }}
      />
      <Button title="Add Entry" onPress={handleAddEntry} />
    </View>
  );
}