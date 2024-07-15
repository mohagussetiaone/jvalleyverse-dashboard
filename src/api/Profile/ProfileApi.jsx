import supabase from "@/configs/supabaseConfig";
import { getSessionData } from "@/store/local/Forage";

export const handleGetProfile = async () => {
  try {
    const user = await getSessionData();
    // const {
    //   data: { user },
    // } = await supabase.auth.getUser();
    console.log("user", user);
    if (user) {
      const { data: profile, error } = await supabase
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
      if (error) {
        throw error;
      } else {
        return profile;
      }
    }
    return user;
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
    throw new Error(JSON.stringify(error, null, 2));
  }
};

export const handleUpdateImageProfile = async (payload) => {
  console.log("payload", payload);
  try {
    const { data: profileImage, error } = await supabase
      .schema("user")
      .from("users")
      .update({
        profile_image_url: payload.profile_image_url_new,
      })
      .eq("id", payload.id)
      .single();
    if (error) {
      throw error;
    } else {
      const { data, error } = await supabase.storage.from("jvalleyverseImg").remove([payload.profile_image_url_old]);
      console.log("hapus data", data);
      if (error) {
        throw error;
      }
    }
    return profileImage;
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
