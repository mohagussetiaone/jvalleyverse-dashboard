import supabase from "@/configs/supabaseConfig";

export const handleGetProfile = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
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
        about,
        profile_image_url,
        verify,
        created_at
        `
        )
        .eq("id", user.id)
        .single();
      return profile;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const handleUpdateProfile = async (id, payload) => {
  try {
    const { data: profile, error } = await supabase
      .schema("user")
      .from("users")
      .update({
        username: payload.username,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        address: payload.address,
        about: payload.about,
      })
      .eq("id", id)
      .single();
    if (error) {
      throw error;
    }
    return profile;
  } catch (error) {
    throw new Error(error);
  }
};

export const handleChangePassword = async (password) => {
  try {
    const { data: changePassword, error } = await supabase.auth.updateUser({
      password: password,
    });
    if (error) {
      throw error;
    }
    return changePassword;
  } catch (error) {
    throw new Error(error);
  }
};
