import localforage from "localforage";

const saveData = async (id, data) => {
  try {
    await localforage.setItem(id, data);
  } catch (error) {
    console.error("Failed to save to localForage:", error);
  }
};

const loadData = async (id) => {
  try {
    const data = await localforage.getItem(id);
    return data;
  } catch (error) {
    console.error("Failed to load from localForage:", error);
    return null;
  }
};

async function clearAllStorage() {
  // Menghapus semua data dari localStorage
  localStorage.clear();

  try {
    // Menunggu operasi asinkron dari localForage.clear() selesai
    await localforage.clear();
    console.log("LocalForage data cleared");
  } catch (error) {
    // Menangani error jika operasi asinkron gagal
    console.error("Error clearing LocalForage data:", error);
  }
}
async function clearLocalforage() {
  try {
    // Menunggu operasi asinkron dari localForage.clear() selesai
    await localforage.clear();
    console.log("LocalForage data cleared");
  } catch (error) {
    // Menangani error jika operasi asinkron gagal
    console.error("Error clearing LocalForage data:", error);
  }
}

export { clearAllStorage, clearLocalforage, loadData, saveData };
