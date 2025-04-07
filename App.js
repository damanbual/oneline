import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { supabase } from './utils/supabaseClient';

export default function App() {
  const [entry, setEntry] = useState(null);

  useEffect(() => {
    const fetchEntry = async () => {
      const { data, error } = await supabase.from('entries').select('*').limit(1);
      console.log('Supabase Data:', data, error);
      if (data) setEntry(data[0]);
    };

    fetchEntry();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>First entry:</Text>
      <Text>{entry ? entry.content : 'Loading...'}</Text>
    </View>
  );
}