import { icons } from "@/constants/icons";
import { useAuth } from "@/contexts/AuthContext";
import { fetchMovieDetails } from "@/services/api";
import { deleteSavedMovie, isMovieSaved, saveMovie } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <Text className="text-light-100 font-bold text-sm mt-2">
      {value || "N/A"}
    </Text>
  </View>
);

const MovieDetails = () => {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();

  const { data: movie, loading } = useFetch(() =>
    fetchMovieDetails(id as string),
  );

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (movie && user) {
      isMovieSaved(movie.id, user.$id).then(setIsSaved);
    }
  }, [movie, user]);

  const toggleSave = async () => {
    if (!movie || !user) return;
    if (isSaved) {
      await deleteSavedMovie(movie.id, user.$id);
      setIsSaved(false);
    } else {
      await saveMovie(
        {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path ?? "",
          release_date: movie.release_date,
          vote_average: movie.vote_average,
          overview: movie.overview ?? "",
          adult: movie.adult,
          backdrop_path: movie.backdrop_path ?? "",
          genre_ids: movie.genres.map((g) => g.id),
          original_language: movie.original_language,
          original_title: movie.original_title,
          popularity: movie.popularity,
          video: movie.video,
          vote_count: movie.vote_count,
        },
        user.$id,
      );
      setIsSaved(true);
    }
  };

  const posterUri = movie?.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://placehold.co/600x900/1a1a1a/ffffff.png";

  return (
    <View className="bg-primary flex-1">
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 80,
        }}
      >
        <View>
          {loading ? (
            <View className="w-full h-[550px] items-center justify-center">
              <ActivityIndicator size="large" color="#AB8BFF" />
            </View>
          ) : (
            <View>
              <Image
                source={{ uri: posterUri }}
                className="w-full h-[550px]"
                style={{ width: "100%", height: 550 }}
                resizeMode="stretch"
              />
              <TouchableOpacity
                className={`absolute top-4 right-4 rounded-full p-2.5 ${isSaved ? "bg-accent" : "bg-black/50"}`}
                onPress={toggleSave}
              >
                <Image
                  source={icons.save}
                  className="size-6"
                  tintColor={isSaved ? "#030014" : "#fff"}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View className="flex-col items-start justify-center mt-5 px-5">
          <Text className="text-white text-xl font-bold">{movie?.title}</Text>

          <View className="flex-row items-center gap-x-1 mt-2">
            <Text className="text-light-200 text-sm">
              {movie?.release_date?.split("-")[0]}
            </Text>
            <Text className="text-light-200 text-sm"> {movie?.runtime}m </Text>
          </View>

          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Image source={icons.star} className="size-4" />
            <Text className="text-white font-bold text-sm">
              {Math.round(movie?.vote_average ?? 0)}/10
            </Text>
            <Text className="text-light-200 text-sm">
              ({movie?.vote_count} votes)
            </Text>
          </View>

          <MovieInfo label="Overview" value={movie?.overview} />
          <MovieInfo
            label="Genres"
            value={movie?.genres.map((genre) => genre.name).join(", ") || "N/A"}
          />

          <View className="flex-row justify-between w-1/2">
            <MovieInfo
              label="Budget"
              value={`$${(movie?.budget ?? 0) / 1_000_000} million`}
            />
            <MovieInfo
              label="Revenue"
              value={`$${Math.round((movie?.revenue ?? 0) / 1_000_000)} million`}
            />
          </View>

          <MovieInfo
            label="Production Companies"
            value={
              movie?.production_companies
                ?.map((company) => company.name)
                .join(", ") || "N/A"
            }
          />
        </View>
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center gap-x-0.5"
        onPress={router.back}
      >
        <Image
          source={icons.arrow}
          className="size-5 mr-1 mt-0.5 rotate-180"
          tintColor="#fff"
        />
        <Text className="text-white font-semibold text-base"> Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MovieDetails;
