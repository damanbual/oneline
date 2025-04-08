import React, { useEffect, useState, useContext } from 'react';
import { Text, View } from 'react-native';
import { supabase } from './utils/supabaseClient';
import AuthModal from './components/AuthModal';
import EntryInput from './components/EntryInput';
import { AuthContext, AuthProvider } from './context/AuthContext';

function MainApp() {
  const { user } = useContext(AuthContext);
  const [entry, setEntry] = useState(null);

  const fetchEntry = async () => {
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (data && data.length > 0) setEntry(data[0]);
  };

  useEffect(() => {
    if (user) fetchEntry();
  }, [user]);

  return (
    <>
      {!user && <AuthModal visible />}
      {user && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Welcome, {user.email}</Text>
          <Text>First entry:</Text>
          <Text>{entry ? entry.content : 'Loading...'}</Text>
          <EntryInput userId={user.id} onEntryAdded={fetchEntry} />
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