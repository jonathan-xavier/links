import AsyncStorage from "@react-native-async-storage/async-storage";

const LINKS_STORAGE_KEY = "links-storage";

export type LinkStorage = {
  id: string;
  name: string;
  url: string;
  category: string;
};

const get = async (): Promise<LinkStorage[]> => {
  const storage = await AsyncStorage.getItem(LINKS_STORAGE_KEY);
  const response = storage ? JSON.parse(storage) : [];

  return response;
};

const save = async (newLink: LinkStorage) => {
  try {
    const storage = await get()
    const updated = [...storage, newLink]
    await AsyncStorage.setItem(LINKS_STORAGE_KEY, JSON.stringify(updated))
  } catch (error) {
    throw error;
  }
};

const remove = async (id: string) => {
  try {
      const storage = await get()
      const updated = storage.filter((link) => link.id !== id)
      await AsyncStorage.setItem(LINKS_STORAGE_KEY, JSON.stringify(updated))
  } catch (error) {
    throw error
  }
}

export const linkStorage = {get, save, remove}
