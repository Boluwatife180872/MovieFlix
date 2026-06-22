import { Account, Client, Databases, ID, Permission, Query, Role } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
const SAVED_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_SAVED_COLLECTION_ID!;

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const database = new Databases(client);
const account = new Account(client);

export const createUserAccount = async (
  email: string,
  password: string,
  name: string,
) => {
  try {
    const user = await account.create(ID.unique(), email, password, name);
    await login(email, password);
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    await account.createEmailPasswordSession(email, password);
    return await getCurrentUser();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    return await account.get();
  } catch {
    return null;
  }
};

export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", query),
    ]);

    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];

      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        existingMovie.$id,
        {
          count: existingMovie.count + 1,
        },
      );
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: query,
        movie_id: movie.id,
        count: 1,
        title: movie.title,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const saveMovie = async (movie: Movie, userId: string) => {
  try {
    await database.createDocument(
      DATABASE_ID,
      SAVED_COLLECTION_ID,
      ID.unique(),
      {
        movie_id: movie.id,
        user_id: userId,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        vote_average: Math.round(movie.vote_average),
        overview: movie.overview,
      },
      [
        Permission.read(Role.any()),
        Permission.write(Role.any()),
      ],
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteSavedMovie = async (movieId: number, userId: string) => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID,
      SAVED_COLLECTION_ID,
      [
        Query.equal("movie_id", movieId),
        Query.equal("user_id", userId),
      ],
    );
    if (result.documents.length > 0) {
      await database.deleteDocument(
        DATABASE_ID,
        SAVED_COLLECTION_ID,
        result.documents[0].$id,
      );
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getSavedMovies = async (userId: string): Promise<SavedMovie[]> => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID,
      SAVED_COLLECTION_ID,
      [
        Query.equal("user_id", userId),
        Query.orderDesc("$createdAt"),
      ],
    );
    return result.documents as unknown as SavedMovie[];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const isMovieSaved = async (
  movieId: number,
  userId: string,
): Promise<boolean> => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID,
      SAVED_COLLECTION_ID,
      [
        Query.equal("movie_id", movieId),
        Query.equal("user_id", userId),
      ],
    );
    return result.documents.length > 0;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getSavedMoviesCount = async (userId: string): Promise<number> => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID,
      SAVED_COLLECTION_ID,
      [Query.equal("user_id", userId)],
    );
    return result.total;
  } catch (error) {
    console.log(error);
    return 0;
  }
};

export const clearAllSavedMovies = async (userId: string) => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID,
      SAVED_COLLECTION_ID,
      [Query.equal("user_id", userId)],
    );
    for (const doc of result.documents) {
      await database.deleteDocument(DATABASE_ID, SAVED_COLLECTION_ID, doc.$id);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getTrendingMovies = async (): Promise<
  TrendingMovie[] | undefined
> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);

    return result.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.log(error);
    return undefined;
  }
};
