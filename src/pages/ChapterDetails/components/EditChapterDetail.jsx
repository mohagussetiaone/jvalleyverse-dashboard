import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import supabase from "@/configs/supabaseConfig";
import LabelInput from "@/components/input/LabelInput";
import Modal from "@/components/modal/Modal";
import Select from "@/components/input/Select";
import ErrorServer from "@/components/error/ErrorPage";
import Loading from "@/components/Loading";
import { handleGetProject, handleGetChapter } from "@/api/Project/ProjectApi";

const EditChapterDetail = ({ setShowEdit, showEdit, dataChapterDetail }) => {
  console.log("dataChapterDetail", dataChapterDetail);
  const queryClient = useQueryClient();
  const validationSchema = yup.object().shape({
    project_id: yup.string().optional(),
    chapter_id: yup.string().optional(),
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
    defaultValues: {
      project_id: dataChapterDetail.project_id,
      chapter_id: dataChapterDetail.chapter_id,
      chapter_detail_name: dataChapterDetail.chapter_detail_name,
      youtube_url: dataChapterDetail.youtube_url,
    },
  });

  const onSubmit = async (values) => {
    let payload = {
      project_id: values.project_id,
      chapter_id: values.chapter_id,
      chapter_detail_name: values.chapter_detail_name,
      youtube_url: values.youtube_url,
    };
    // Menampilkan toast ketika request sedang diproses
    const requestPromise = supabase.schema("belajar").from("chapter_detail").update(payload).eq("id", dataChapterDetail.id);
    toast.promise(
      requestPromise,
      {
        loading: "Update data process...",
        success: (response) => {
          if (response.status === 204) {
            queryClient.invalidateQueries({
              queryKey: ["getChapterDetail"],
            });
            setShowEdit(true);
            return "Update Chapter Detail Successfully";
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

  if (errorProject || errorChapterProject) return <ErrorServer />;
  if (isPendingProject || isPendingChapterProject) return <Loading />;

  console.log("dataProjects", dataProjects);
  console.log("dataChapterProjects", dataChapterProjects);

  const handleChange = (name, selectedOption) => {
    setValue(name, selectedOption.value);
  };

  const optionProject = dataProjects?.map((project) => ({
    value: project.id,
    label: project.project_name,
  }));

  console.log("optionProject", optionProject);
  console.log("id default", dataChapterDetail.project.id);

  const optionChapter = dataChapterProjects?.map((chapter) => ({
    value: chapter.id,
    label: chapter.chapter_name,
  }));

  console.log("optionChapter", optionChapter);
  console.log("id default", dataChapterDetail.chapter_project.id);

  return (
    <Modal
      header="Edit Chapter Project"
      buttonName="Update"
      show={showEdit}
      setShow={setShowEdit}
      content={
        <form>
          <div className="mb-3">
            <Select
              label="Project"
              name="project_id"
              options={optionProject || []}
              defaultValue={dataChapterDetail.project.id}
              value={register("project_id").value}
              onChange={handleChange}
              register={register}
              error={errors.project_id}
              required
              isDisabled={isPendingProject}
            />
          </div>
          <div className="mb-3">
            <Select
              label="Chapter"
              name="chapter_id"
              options={optionChapter || []}
              defaultValue={dataChapterDetail.chapter_project.id}
              value={register("chapter_id").value}
              onChange={handleChange}
              register={register}
              error={errors.chapter_id}
              required
              isDisabled={isPendingChapterProject}
            />
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

export default EditChapterDetail;
