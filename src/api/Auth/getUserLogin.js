import supabase from "@/configs/supabaseConfig";

export const handleGetUserLogin = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    throw new Error(error);
  }
};

export const handleGetUserLoginById = async (id) => {
  try {
    const { data: userLogin } = await supabase
      .schema("user")
      .from("users")
      .select(
        `
        id,
        roles (
          id,
          role_name
        ),
        username,
        name,
        email,
        phone,
        address,
        profile_image_url,
        verify,
        created_at
        `
      )
      .eq("id", id)
      .single();
    return userLogin;
  } catch (error) {
    throw new Error(error);
  }
};
