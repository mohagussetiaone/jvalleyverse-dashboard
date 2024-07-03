import { useState } from "react";
import Modal from "@/components/modal/Modal";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import supabase from "@/configs/supabaseConfig";
import LabelInput from "@/components/input/LabelInput";
import Select from "@/components/input/Select";
import { IoMdClose } from "react-icons/io";

const AddProject = ({ setShowAdd, showAdd }) => {
  const queryClient = useQueryClient();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const validationSchema = yup.object().shape({
    category_project_id: yup.string().min(1, "Category Project ID must be at least 1 characters").required("Category Project ID is required"),
    project_name: yup.string().min(1, "Project Name must be at least 1 characters").required("Project Name is required"),
    project_github: yup.string().min(1, "Project Github must be at least 1 characters").required("Project Github is required"),
    project_youtube_playlist: yup.string().optional(),
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (values) => {
    // Check if image file is selected
    if (!imageFile) {
      toast.error("Please select an image to upload");
      return;
    }
    const requestPromise = new Promise(async (resolve, reject) => {
      try {
        const { data: projectNameData, error: projectNameError } = await supabase.schema("belajar").from("project").select("id").eq("project_name", values.project_name);

        console.log("projectNameData", projectNameData);
        if (projectNameError) throw projectNameError;
        if (projectNameData.length > 0) {
          // If project name exists, throw an error
          throw new Error("Project name already exists. Please choose a different name.");
        }
        // Get project id
        const { data: projectIdData, error: projectIdError } = await supabase.schema("belajar").from("project").select("id", { count: "exact" }).order("id", { ascending: false }).limit(1);
        // if get project error
        if (projectIdError) throw projectIdError;
        // set sequence project
        const projectId = projectIdData[0]?.id + 1 || 1;
        console.log("projectId", projectId);
        // upload file into storage
        const { data: storageData, error: storageError } = await supabase.storage.from("jvalleyverseImg").upload(`project/${projectId}/${imageFile.name}`, imageFile);
        console.log("storageData", storageData);
        // if upload error
        if (!storageData || !storageData.path || storageError) {
          throw new Error("Failed to upload image");
        }
        // Payload for insert
        let payload = {
          project_img_url: storageData.path,
          category_project_id: values.category_project_id,
          project_name: values.project_name,
          project_github: values.project_github,
          project_youtube_playlist: values.project_youtube_playlist,
        };
        // Insert project data
        const { data: dataProject, error: errorProject } = await supabase.schema("belajar").from("project").insert(payload);
        // error insert
        if (errorProject) throw errorProject;
        // when all process finish
        resolve(dataProject);
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(
      requestPromise,
      {
        loading: "Adding project...",
        success: () => {
          queryClient.invalidateQueries({
            queryKey: ["getProject"],
          });
          setShowAdd(true);
          return "Adding Project Successfully";
        },
        error: (error) => {
          console.log("error", error);
          return error.message || "Terjadi kesalahan saat memproses data";
        },
      },
      {
        success: {
          duration: 1500,
        },
        error: {
          duration: 2000,
        },
      }
    );
  };

  const {
    error: errorCategoryProject,
    isPending: isPendingCategoryProject,
    data: dataCategoryProjects,
  } = useQuery({
    queryKey: ["getCategoryProject"],
    queryFn: async () => {
      const { data } = await supabase.schema("belajar").from("category_project").select(`
          id,
          category_name
        `);
      return data;
    },
  });

  if (isPendingCategoryProject) {
    toast.loading("Loading category project...");
  } else if (errorCategoryProject) {
    toast.error("Failed to get category project");
  } else {
    toast.remove();
  }

  const handleChange = (name, selectedOption) => {
    setValue(name, selectedOption.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageReset = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const optionCategoryProject = dataCategoryProjects?.map((project) => ({
    value: project.id,
    label: project.category_name,
  }));

  return (
    <Modal
      header="Add Project"
      buttonName="Add"
      show={showAdd}
      setShow={setShowAdd}
      content={
        <form>
          <div className="flex flex-col gap-2 mb-2">
            <label htmlFor="project_img_url" className="text-black-500 font-normal">
              Project Image <span className="text-red-700">*</span>
            </label>
            <input id="project_img_url" name="project_img_url" type="file" accept="image/*" onChange={handleImageChange} className="file-input file-input-sm file-input-ghost w-full max-w-xs" />
            {imagePreview && (
              <div className="relative bg-black-200 rounded-e-lg">
                <img src={imagePreview} alt="Image Preview" className="rounded w-[200px] h-auto" />
                <button type="button" onClick={handleImageReset} className="absolute top-0 right-0 m-2 p-1 bg-red-500 text-white rounded-full">
                  <IoMdClose />
                </button>
              </div>
            )}
          </div>
          <div className="mb-2">
            <Select
              label="Category Project"
              name="category_project_id"
              options={optionCategoryProject || []}
              value={register("category_project_id").value}
              onChange={handleChange}
              register={register}
              error={errors.category_project_id}
              required
              isDisabled={isPendingCategoryProject}
            />
          </div>
          <div className="mb-2">
            <LabelInput label="Project Name" type="text" id="project_name" name="project_name" placeholder="Fill Project Name" error={errors.project_name} register={register} required />
          </div>
          <div className="mb-2">
            <LabelInput label="Url Github" type="text" id="project_github" name="project_github" placeholder="Fill Url Github" error={errors.project_github} register={register} required />
          </div>
          <div>
            <LabelInput label="Youtube Playlist" type="text" id="project_youtube_playlist" name="project_youtube_playlist" placeholder="Fill Youtube Playlist" error={errors.project_youtube_playlist} register={register} optional />
          </div>
        </form>
      }
      action={handleSubmit(onSubmit)}
    />
  );
};

export default AddProject;
