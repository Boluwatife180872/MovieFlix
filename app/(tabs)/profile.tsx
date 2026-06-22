import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { useAuth } from "@/contexts/AuthContext";
import {
  clearAllSavedMovies,
  getSavedMoviesCount,
  getTrendingMovies,
} from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Profile = () => {
  const { user, logout } = useAuth();

  const fetchSavedCount = useCallback(() => {
    if (!user) return Promise.resolve(0);
    return getSavedMoviesCount(user.$id);
  }, [user]);

  const {
    data: savedCount,
    loading: savedCountLoading,
    refetch: refetchSavedCount,
  } = useFetch(fetchSavedCount);

  const { data: trendingMovies } = useFetch(getTrendingMovies);

  useFocusEffect(
    useCallback(() => {
      refetchSavedCount();
    }, []),
  );

  const totalSearches =
    trendingMovies?.reduce((sum, m) => sum + m.count, 0) ?? 0;

  const handleClearAll = () => {
    Alert.alert(
      "Clear All Saved Movies",
      "This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            if (!user) return;
            await clearAllSavedMovies(user.$id);
            refetchSavedCount();
          },
        },
      ],
    );
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/auth/login");
        },
      },
    ]);
  };

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute w-full z-0"
        resizeMode="cover"
      />

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="items-center mt-20">
          <View className="w-20 h-20 bg-accent rounded-full items-center justify-center">
            <Text className="text-white text-3xl font-bold">{initials}</Text>
          </View>
          <Text className="text-white text-xl font-bold mt-4">
            {user?.name}
          </Text>
          <Text className="text-light-300 text-sm mt-1">{user?.email}</Text>
        </View>

        {savedCountLoading ? (
          <ActivityIndicator size="large" color="#AB8BFF" className="mt-10" />
        ) : (
          <View className="flex-row justify-around mt-10">
            <View className="items-center bg-dark-100 rounded-xl px-8 py-5">
              <Text className="text-white text-3xl font-bold">
                {savedCount}
              </Text>
              <Text className="text-light-300 text-sm mt-1">Saved</Text>
            </View>
            <View className="items-center bg-dark-100 rounded-xl px-8 py-5">
              <Text className="text-white text-3xl font-bold">
                {totalSearches}
              </Text>
              <Text className="text-light-300 text-sm mt-1">Searches</Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          className="bg-dark-100 rounded-xl py-4 mt-10 flex-row items-center justify-center gap-2"
          onPress={handleClearAll}
        >
          <Image source={icons.save} className="size-5" tintColor="#ff4444" />
          <Text className="text-red-400 font-semibold text-base">
            Clear All Saved
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-dark-100 rounded-xl py-4 mt-4 flex-row items-center justify-center gap-2"
          onPress={handleLogout}
        >
          <Image source={icons.person} className="size-5" tintColor="#ff4444" />
          <Text className="text-red-400 font-semibold text-base">Logout</Text>
        </TouchableOpacity>

        <View className="mt-10 bg-dark-100 rounded-xl p-5">
          <Text className="text-white text-lg font-bold mb-2">About</Text>
          <Text className="text-light-300 text-sm leading-5">
            Browse and discover trending movies, search for your favorites, and
            save them to watch later. Powered by TMDB.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;
