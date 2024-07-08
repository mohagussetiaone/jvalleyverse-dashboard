import Modal from "@/components/modal/Modal";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import supabase from "@/configs/supabaseConfig";
import LabelInput from "@/components/input/LabelInput";
import Select from "@/components/input/Select";

const AddChapterProject = ({ setShowAdd, showAdd }) => {
  const queryClient = useQueryClient();
  const validationSchema = yup.object().shape({
    project_id: yup.string().min(1, "Project ID must be at least 1 characters").required("Project ID is required"),
    chapter_name: yup.string().min(1, "Chapter Name must be at least 1 characters").required("Chapter Name is required"),
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
      project_id: values.project_id,
      chapter_name: values.chapter_name,
    };
    // Menampilkan toast ketika request sedang diproses
    const requestPromise = supabase.schema("belajar").from("chapter_project").insert(payload);
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
            queryKey: ["getChapterProject"],
          });
          setShowAdd(true);
          return "Adding Chapter Project Successfully";
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
    error: errorProject,
    isPending: isPendingProject,
    data: dataProjects,
  } = useQuery({
    queryKey: ["getProject"],
    queryFn: async () => {
      const { data } = await supabase.schema("belajar").from("project").select(`
          id,
          project_name
        `);
      return data;
    },
  });

  const handleChange = (name, selectedOption) => {
    setValue(name, selectedOption.value);
  };

  const optionProject = dataProjects?.map((project) => ({
    value: project.id,
    label: project.project_name,
  }));

  return (
    <Modal
      header="Add Chapter Project"
      buttonName="Add"
      show={showAdd}
      setShow={setShowAdd}
      content={
        <form>
          <div className="mb-3">
            <Select label="Project" name="project_id" options={optionProject || []} value={register("project_id").value} onChange={handleChange} register={register} error={errors.project_id} required isDisabled={isPendingProject} />
          </div>
          <div>
            <LabelInput label="Chapter Name" type="text" id="chapter_name" name="chapter_name" placeholder="Fill Chapter Name" error={errors.chapter_name} register={register} required />
          </div>
        </form>
      }
      action={handleSubmit(onSubmit)}
    />
  );
};

export default AddChapterProject;
