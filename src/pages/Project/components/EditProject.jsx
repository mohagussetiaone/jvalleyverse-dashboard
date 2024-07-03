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

const EditProject = ({ setShowEdit, showEdit, dataProject }) => {
  console.log("dataProject", dataProject);
  const [imageFile, setImageFile] = useState(null);
  const [storage, setStorage] = useState();
  console.log("storage", storage);
  const [imagePreview, setImagePreview] = useState(`${import.meta.env.VITE_CDN_GET_IMAGE}/jvalleyverseImg/${dataProject?.project_img_url}`);
  console.log("imagePreview", imagePreview);
  const queryClient = useQueryClient();
  const validationSchema = yup.object().shape({
    category_project_id: yup.string().min(1, "Category Project ID must be at least 1 characters").required("Category Project ID is required"),
    project_name: yup.string().min(1, "Project Name must be at least 1 characters").required("Project Name is required"),
    project_github: yup.string().min(1, "Project Github must be at least 1 characters").required("Project Github is required"),
    project_youtube_playlist: yup.string().optional(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      category_project_id: dataProject?.category_project?.id,
      project_name: dataProject.project_name,
      project_github: dataProject.project_github,
      project_youtube_playlist: dataProject.project_youtube_playlist,
    },
  });

  const onSubmit = async (values) => {
    const requestPromise = new Promise(async (resolve, reject) => {
      try {
        // const { data: projectNameData, error: projectNameError } = await supabase.schema("belajar").from("project").select("id").eq("project_name", values.project_name);

        // console.log("projectNameData", projectNameData);
        // if (projectNameError) throw projectNameError;
        // if (projectNameData.length > 0) {
        //   // If project name exists, throw an error
        //   throw new Error("Project name already exists. Please choose a different name.");
        // }
        // upload file into storage
        if (imageFile) {
          const { data: storageData, error: storageError } = await supabase.storage.from("jvalleyverseImg").update(dataProject?.project_img_url, imageFile, {
            cacheControl: "3600",
            upsert: true,
          });
          setStorage(storageData);

          // if upload error
          if (storageError) {
            throw new Error("Failed to upload image");
          }
        }

        let payload = {
          category_project_id: values.category_project_id,
          project_name: values.project_name,
          project_github: values.project_github,
          project_youtube_playlist: values.project_youtube_playlist,
        };

        if (imageFile) {
          payload.project_img_url = storage?.path;
        }

        // Update project data
        const { data: dataProjects, error: errorProject } = await supabase.schema("belajar").from("project").update(payload).eq("id", dataProject?.id);

        // error update
        if (errorProject) throw errorProject;
        // when all process finish
        resolve(dataProjects);
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(
      requestPromise,
      {
        loading: "Update project...",
        success: () => {
          queryClient.invalidateQueries({
            queryKey: ["getProject"],
          });
          setShowEdit(true);
          return "Update Project Successfully";
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

  const handleImageReset = async () => {
    setImageFile(null);
    setImagePreview(null);
    const { data: storageData, error: storageError } = await supabase.storage.from("jvalleyverseImg").remove(dataProject?.project_img_url);
    if (storageError) throw storageError;
    else if (storageData) {
      toast.success("Delete image successfully");
    } else {
      toast.remove();
    }
  };

  const optionCategoryProject = dataCategoryProjects?.map((project) => ({
    value: project.id,
    label: project.category_name,
  }));

  if (errorCategoryProject) {
    toast.error(errorCategoryProject.message);
  }

  return (
    <Modal
      header="Edit Project"
      buttonName="Update"
      show={showEdit}
      setShow={setShowEdit}
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
                <div className="flex text-xs flex-wrap">{imagePreview}</div>
              </div>
            )}
          </div>
          <div className="mb-2">
            <Select
              label="Category Project"
              name="category_project_id"
              options={optionCategoryProject || []}
              defaultValue={dataProject?.category_project?.id}
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
          <div>
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

export default EditProject;
