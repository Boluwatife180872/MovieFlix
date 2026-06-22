import { icons } from "@/constants/icons";
import { useAuth } from "@/contexts/AuthContext";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Register = () => {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await register(email.trim(), password, name.trim());
      router.replace("/(tabs)");
    } catch (e: any) {
      setError(e.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-primary"
    >
      <View className="flex-1 justify-center px-8">
        <View className="items-center mb-10">
          <Image source={icons.logo} className="w-16 h-14" />
          <Text className="text-white text-2xl font-bold mt-4">
            Create Account
          </Text>
        </View>

        {error ? (
          <Text className="text-red-500 text-sm mb-4 text-center">{error}</Text>
        ) : null}

        <TextInput
          className="bg-dark-100 text-white rounded-xl px-4 py-3.5 mb-4"
          placeholder="Name"
          placeholderTextColor="#9CA4AB"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <TextInput
          className="bg-dark-100 text-white rounded-xl px-4 py-3.5 mb-4"
          placeholder="Email"
          placeholderTextColor="#9CA4AB"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          className="bg-dark-100 text-white rounded-xl px-4 py-3.5 mb-6"
          placeholder="Password"
          placeholderTextColor="#9CA4AB"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          className="bg-accent rounded-xl py-3.5 items-center"
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold text-base">
              Register
            </Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center mt-6">
          <Text className="text-light-300">Already have an account? </Text>
          <Link href="/auth/login" className="text-accent font-semibold">
            Login
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Register;
