import Modal from "@/components/modal/Modal";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import supabase from "@/configs/supabaseConfig";
import LabelInput from "@/components/input/LabelInput";
import Select from "@/components/input/Select";

const AddProject = ({ setShowAdd, showAdd }) => {
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
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (values) => {
    let payload = {
      category_project_id: values.category_project_id,
      project_name: values.project_name,
      project_github: values.project_github,
      project_youtube_playlist: values.project_youtube_playlist,
    };
    // Menampilkan toast ketika request sedang diproses
    const requestPromise = supabase.schema("belajar").from("project").insert(payload);

    toast.promise(
      requestPromise,
      {
        loading: "Adding project...",
        success: (response) => {
          console.log("response", response);
          if (response.error) {
            throw response.error;
          }
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

  const handleChange = (name, selectedOption) => {
    setValue(name, selectedOption.value);
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

export default AddProject;
