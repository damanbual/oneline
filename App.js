import React, { useEffect, useState, useContext } from 'react';
import { Text, View } from 'react-native';
import { supabase } from './utils/supabaseClient';
import AuthModal from './components/AuthModal';
import EntryInput from './components/EntryInput';
import { AuthContext, AuthProvider } from './context/AuthContext';

function MainApp() {
  const { user } = useContext(AuthContext);
  const [entries, setEntries] = useState([]);

  const fetchEntries = async () => {
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .eq('user_id', user.id)
      .order('entry_date', { ascending: true });

    console.log('🔄 Refetching entries...');
    console.log('📦 Entries:', data);

    if (data) setEntries(data);
  };

  useEffect(() => {
    if (user) fetchEntries();
  }, [user]);

  return (
    <>
      {!user && <AuthModal visible />}
      {user && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
          <Text>Welcome, {user.email}</Text>
          <Text style={{ marginTop: 16, fontWeight: 'bold' }}>Your Entries:</Text>
          {entries.map((entry, index) => (
            <View
              key={entry.id || index}
              style={{
                marginVertical: 8,
                padding: 12,
                borderRadius: 6,
                borderWidth: 1,
                borderColor: '#ddd',
                width: '100%',
              }}
            >
              <Text>{entry.content}</Text>
            </View>
          ))}
          <EntryInput onEntryAdded={fetchEntries} />
        </View>
      )}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}