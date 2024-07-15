import supabase from "@/configs/supabaseConfig";

export const handleGetRoles = async () => {
  try {
    const { data: users, error } = await supabase.schema("user").from("roles").select();
    if (error) {
      throw error;
    }
    return users;
  } catch (error) {
    throw new Error(error);
  }
};
