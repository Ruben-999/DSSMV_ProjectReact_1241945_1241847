import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const InitialScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
       {/* Titulo e Imagem*/}
      <View style={styles.logoContainer}>
        <Text style={styles.title}>PingMe</Text>
        <Image 
          source={require('../../assets/PingMeIcon.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
      </View>

      {/*Botões*/}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.registerButton]} 
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.registerText}>Registo</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.loginButton]} 
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: 
  { 
    flex: 1, 
    backgroundColor: '#fff', 
    padding: 20, 
    justifyContent: 'space-between' 
  },

  logoContainer: 
  { 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center' 
  },

  title: 
  { 
    fontSize: 40, 
    fontWeight: 'bold', 
    color: '#333', 
    marginBottom: 20 
  },

  logo: 
  { 
    width: 150, 
    height: 150 
  },

  buttonContainer: 
  { 
    marginBottom: 50 
  },

  button: 
  { 
    padding: 15,
    borderRadius: 10,
    alignItems: 'center', 
    marginVertical: 10 
  },

  registerButton: 
  { 
    backgroundColor: '#007AFF' 
  }, 

  loginButton: 
  { 
    backgroundColor: '#fff', 
    borderWidth: 1, 
    borderColor: '#007AFF' 
  },

  registerText: 
  { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },

  loginText: 
  { 
    color: '#007AFF',
    fontSize: 18,
    fontWeight: 'bold' 
},

});

export default InitialScreen;