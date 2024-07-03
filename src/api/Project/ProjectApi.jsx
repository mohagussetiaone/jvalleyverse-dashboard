import supabase from "@/configs/supabaseConfig";

export const handleGetProject = async () => {
  try {
    const { data } = await supabase.schema("belajar").from("project").select(`
        id,
        project_name,
        project_github,
        project_youtube_playlist,
        project_img_url,
        category_project (
          id,
          category_name
        )
        created_at
        `);
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const handleGetChapter = async () => {
  try {
    const { data } = await supabase.schema("belajar").from("chapter_project").select(`
        id,
        chapter_path,
        chapter_name,
        project (
          id,
          project_name
        ),
        created_at
        `);
    return data;
  } catch (error) {
    throw new Error(error);
  }
};
