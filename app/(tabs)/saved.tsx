import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { useAuth } from "@/contexts/AuthContext";
import { deleteSavedMovie, getSavedMovies } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { Link, useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const saved = () => {
  const { user } = useAuth();

  const fetchSaved = useCallback(() => {
    if (!user) return Promise.resolve([] as SavedMovie[]);
    return getSavedMovies(user.$id);
  }, [user]);

  const {
    data: savedMovies,
    loading,
    refetch,
  } = useFetch(fetchSaved);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, []),
  );

  const handleDelete = (movieId: number) => {
    Alert.alert("Remove Movie", "Remove this movie from your saved list?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          if (!user) return;
          await deleteSavedMovie(movieId, user.$id);
          refetch();
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="flex-1 absolute w-full z-0"
        resizeMode="cover"
      />

      <FlatList
        data={savedMovies}
        renderItem={({ item }) => (
          <View className="relative mb-4">
            <Link href={`/movies/${item.movie_id}`} asChild>
              <TouchableOpacity className="flex-row bg-dark-100 rounded-xl overflow-hidden">
                <Image
                  source={{
                    uri: item.poster_path
                      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                      : "https://placehold.co/600x400/1a1a1a/ffffff.png",
                  }}
                  className="w-24 h-36"
                  resizeMode="cover"
                />
                <View className="flex-1 px-3 py-3 justify-between">
                  <Text
                    className="text-white font-bold text-base"
                    numberOfLines={2}
                  >
                    {item.title}
                  </Text>
                  <View>
                    <View className="flex-row items-center gap-1">
                      <Image source={icons.star} className="size-3.5" />
                      <Text className="text-white text-xs font-bold">
                        {Math.round((item.vote_average ?? 0) / 2)}/5
                      </Text>
                    </View>
                    <Text className="text-light-300 text-xs mt-1">
                      {item.release_date?.split("-")[0]}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  className="justify-center px-4"
                  onPress={() => handleDelete(item.movie_id)}
                >
                  <Image
                    source={icons.save}
                    className="size-5"
                    tintColor="#ff4444"
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            </Link>
          </View>
        )}
        keyExtractor={(item) => item.movie_id.toString()}
        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16 }}
        ListHeaderComponent={
          <View className="w-full flex-row justify-center mt-20 mb-5 items-center">
            <Image source={icons.logo} className="w-12 h-10" />
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color="#AB8BFF" className="mt-20" />
          ) : (
            <View className="mt-20 items-center">
              <Image source={icons.save} className="size-16" tintColor="#A8B5DB" />
              <Text className="text-gray-500 text-lg mt-4">
                No saved movies yet
              </Text>
              <Text className="text-gray-500 text-sm mt-1">
                Save movies to watch them later
              </Text>
            </View>
          )
        }
      />
    </View>
  );
};

export default saved;
