import Modal from "@/components/modal/Modal";
import { useQueryClient } from "@tanstack/react-query";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import supabase from "@/configs/supabaseConfig";
import LabelInput from "@/components/input/LabelInput";

const EditChapterProject = ({ setShowEdit, showEdit, dataChapterProject }) => {
  const queryClient = useQueryClient();
  const validationSchema = yup.object().shape({
    chapter_name: yup.string().min(1, "Chapter Name must be at least 1 characters").required("Chapter Name is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      chapter_name: dataChapterProject.chapter_name,
    },
  });

  const onSubmit = async (values) => {
    console.log("values", values);
    let payload = {
      chapter_name: values.chapter_name,
    };
    // Menampilkan toast ketika request sedang diproses
    const requestPromise = supabase.schema("belajar").from("chapter_project").update(payload).eq("id", dataChapterProject.id);
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
          setShowEdit(true);
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

  return (
    <Modal
      header="Edit Chapter Project"
      buttonName="Update"
      show={showEdit}
      setShow={setShowEdit}
      content={
        <form>
          <div>
            <LabelInput label="Chapter Name" type="text" id="chapter_name" name="chapter_name" placeholder="Fill Chapter Name" error={errors.chapter_name} register={register} required />
          </div>
        </form>
      }
      action={handleSubmit(onSubmit)}
    />
  );
};

export default EditChapterProject;
