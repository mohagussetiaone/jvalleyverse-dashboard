import supabase from "@/configs/supabaseConfig";

export const handleCheckAuth = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    return data;
  } catch (error) {
    throw new Error(error);
  }
};
