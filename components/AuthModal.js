import React, { useState, useContext } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { supabase } from '../utils/supabaseClient';
import { AuthContext } from '../context/AuthContext';

export default function AuthModal({ visible }) {
  const { setUser } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async () => {
    setError('');
    const { data, error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else {
      setUser(data.user);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        <Text style={styles.header}>{isSignUp ? 'Sign Up' : 'Log In'}</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          onChangeText={setEmail}
          value={email}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title={isSignUp ? 'Sign Up' : 'Log In'} onPress={handleAuth} />
        <Button
          title={isSignUp ? 'Already have an account? Log In' : 'No account? Sign Up'}
          onPress={() => setIsSignUp(prev => !prev)}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', padding: 20,
  },
  header: {
    fontSize: 24, marginBottom: 20, textAlign: 'center',
  },
  input: {
    height: 50, borderColor: '#ccc', borderWidth: 1, marginBottom: 15, padding: 10, borderRadius: 5,
  },
  error: {
    color: 'red', marginBottom: 10, textAlign: 'center',
  },
});