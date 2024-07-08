import Modal from "@/components/modal/Modal";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import supabase from "@/configs/supabaseConfig";
import LabelInput from "@/components/input/LabelInput";
import Select from "@/components/input/Select";
import ErrorServer from "@/components/error/ErrorPage";
import Loading from "@/components/Loading";
import { handleGetProject, handleGetChapter } from "@/api/Project/ProjectApi";

const AddChapterDetail = ({ setShowAdd, showAdd }) => {
  const queryClient = useQueryClient();
  const validationSchema = yup.object().shape({
    project_id: yup.string().min(1, "Project must be at least 1 characters").required("Project is required"),
    chapter_id: yup.string().min(1, "Chapter must be at least 1 characters").required("Chapter is required"),
    chapter_detail_name: yup.string().min(1, "Chapter Detail Name must be at least 1 characters").required("Chapter Detail Name is required"),
    youtube_url: yup.string().min(1, "Youtube URL must be at least 1 characters").required("Youtube URL is required"),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (values) => {
    let payload = {
      project_id: values.project_id,
      chapter_id: values.chapter_id,
      chapter_detail_name: values.chapter_detail_name,
      youtube_url: values.youtube_url,
    };
    // Menampilkan toast ketika request sedang diproses
    const requestPromise = supabase.schema("belajar").from("chapter_detail").insert(payload);
    toast.promise(
      requestPromise,
      {
        loading: "Adding chapter detail...",
        success: (response) => {
          console.log("response", response);
          if (response.status === 201) {
            queryClient.invalidateQueries({
              queryKey: ["getChapterDetail"],
            });
            setShowAdd(true);
            return "Adding Chapter detail Successfully";
          } else if (response.status === 409) {
            throw response.error;
          }
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
    queryFn: handleGetProject,
  });

  const {
    error: errorChapterProject,
    isPending: isPendingChapterProject,
    data: dataChapterProjects,
  } = useQuery({
    queryKey: ["getChapterProject"],
    queryFn: handleGetChapter,
  });

  if (errorProject || errorChapterProject) {
    return <ErrorServer />;
  }

  if (isPendingProject || isPendingChapterProject) {
    return <Loading />;
  }

  console.log("dataProjects", dataProjects);
  console.log("dataChapterProjects", dataChapterProjects);

  const handleChange = (name, selectedOption) => {
    setValue(name, selectedOption.value);
  };

  const optionProject = dataProjects?.map((project) => ({
    value: project.id,
    label: project.project_name,
  }));

  const optionChapter = dataChapterProjects?.map((chapter) => ({
    value: chapter.id,
    label: chapter.chapter_name,
  }));

  return (
    <Modal
      header="Add Chapter Detail"
      buttonName="Add"
      show={showAdd}
      setShow={setShowAdd}
      content={
        <form>
          <div className="mb-3">
            <Select label="Project" name="project_id" options={optionProject || []} value={register("project_id").value} onChange={handleChange} register={register} error={errors.project_id} required isDisabled={isPendingProject} />
          </div>
          <div className="mb-3">
            <Select label="Chapter" name="chapter_id" options={optionChapter || []} value={register("chapter_id").value} onChange={handleChange} register={register} error={errors.chapter_id} required isDisabled={isPendingChapterProject} />
          </div>
          <div className="mb-3">
            <LabelInput label="Chapter Detail Name" type="text" id="chapter_detail_name" name="chapter_detail_name" placeholder="Fill Chapter Detail Name" error={errors.chapter_detail_name} register={register} required />
          </div>
          <div className="mb-3">
            <LabelInput label="Youtube Url" type="text" id="youtube_url" name="youtube_url" placeholder="Fill Youtube Url" error={errors.youtube_url} register={register} required />
          </div>
        </form>
      }
      action={handleSubmit(onSubmit)}
    />
  );
};

export default AddChapterDetail;
