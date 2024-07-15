import supabase from "@/configs/supabaseConfig";
import { getSessionData } from "@/store/local/Forage";

export const handleGetUsers = async () => {
  try {
    const { data: users, error } = await supabase.schema("user").from("users").select();
    if (error) {
      throw error;
    }
    return users;
  } catch (error) {
    throw new Error(error);
  }
};
