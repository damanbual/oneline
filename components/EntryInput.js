import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { supabase } from '../utils/supabaseClient';
import { AuthContext } from '../context/AuthContext';
import * as chrono from 'chrono-node';

const formatDisplayDate = (isoDate) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

export default function EntryList({ onEntryAdded }) {
  const [entries, setEntries] = useState([]);
  const [content, setContent] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchEntries = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('entries')
          .select('*')
          .eq('user_id', user.id)
          .order('entry_date', { ascending: true });
        if (error) {
          console.error('❌ Error fetching entries:', error.message);
        } else {
          setEntries(data);
        }
      }
    };

    fetchEntries();
  }, [user]);

  const handleAddEntry = async () => {
    const userId = user?.id;
    if (!userId || !content.trim()) return;

    const parsedDate = chrono.parseDate(content);
    if (!parsedDate) {
      console.error('❌ Could not parse a date from the entry.');
      return;
    }
    const formattedDate = parsedDate.toISOString().split('T')[0];

    const { error } = await supabase.from('entries').insert([
      {
        user_id: userId,
        content,
        entry_date: formattedDate,
      },
    ]);

    if (!error) {
      setContent('');
      onEntryAdded?.();
      const { data } = await supabase
        .from('entries')
        .select('*')
        .eq('user_id', userId)
        .order('entry_date', { ascending: true });
      setEntries(data);
    } else {
      console.error('Insert error:', error.message);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
      <View style={{ marginTop: 24 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 10 }}>Your Entries:</Text>
        {entries.map((item) => (
          <Text key={item.id} style={{ fontSize: 16, marginBottom: 6 }}>
            {formatDisplayDate(item.entry_date)}: {item.content}
          </Text>
        ))}
      </View>
      <TextInput
        placeholder="Write a one-liner..."
        value={content}
        onChangeText={setContent}
        style={{
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 4,
          padding: 10,
          marginTop: 20,
          marginBottom: 10,
        }}
      />
      <Button title="Add Entry" onPress={handleAddEntry} />
    </View>
  );
}