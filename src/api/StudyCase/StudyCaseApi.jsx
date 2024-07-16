import supabase from "@/configs/supabaseConfig";

export const handleGetStudyCase = async () => {
  try {
    const { data: users, error } = await supabase.schema("belajar").from("studi_kasus").select();
    if (error) {
      throw error;
    }
    return users;
  } catch (error) {
    throw new Error(error);
  }
};
