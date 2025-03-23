import { Client, Databases, ID, Query } from 'appwrite';
import { MovieType } from './App';

const appWriteProjectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const dataBaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const collectionId = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
console.log(appWriteProjectId, collectionId, dataBaseId);

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(appWriteProjectId);

const dataBase = new Databases(client);

export const updateSearchCount = async (
  searchTerm: string,
  movie: MovieType
) => {
  try {
    const result = await dataBase.listDocuments(dataBaseId, collectionId, [
      Query.equal('searchTerm', searchTerm),
    ]);

    if (result.documents.length > 0) {
      const documentId = result.documents[0];
      await dataBase.updateDocument(dataBaseId, collectionId, documentId.$id, {
        searchCount: documentId.count + 1,
      });
    } else {
      await dataBase.createDocument(dataBaseId, collectionId, ID.unique(), {
        searchTerm,
        count: 1,
        movie_id: movie.id,
        poster_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
      });
    }
    console.log('Search count updated successfully');
  } catch (error) {
    console.error('Error updating search count:', error);
  }
};

export const getTrendingMovies = async () => {
  try {
    const result = await dataBase.listDocuments(dataBaseId, collectionId, [
      Query.limit(5),
      Query.orderDesc('count'),
    ]);
    return result.documents;
  } catch (error) {
    console.error('Error fetching trending movies:', error);
  }
};
