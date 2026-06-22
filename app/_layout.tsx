import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Redirect, Stack, router } from "expo-router";
import { useEffect, useRef } from "react";
import { ActivityIndicator, StatusBar, View } from "react-native";
import "./globals.css";

function RootNavigator() {
  const { user, isLoading } = useAuth();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (isLoading || hasRedirected.current) return;
    hasRedirected.current = true;

    if (user) {
      router.replace("/(tabs)");
    } else {
      router.replace("/auth/login");
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-primary items-center justify-center">
        <ActivityIndicator size="large" color="#AB8BFF" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="auth/register" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="movies/[id]" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar hidden={true} />
      <RootNavigator />
    </AuthProvider>
  );
}
