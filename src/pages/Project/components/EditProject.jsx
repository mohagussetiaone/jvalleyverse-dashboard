import Modal from "@/components/modal/Modal";
import { useQueryClient } from "@tanstack/react-query";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import supabase from "@/configs/supabaseConfig";
import LabelInput from "@/components/input/LabelInput";

const EditProject = ({ setShowEdit, showEdit, dataProject }) => {
  const queryClient = useQueryClient();
  const validationSchema = yup.object().shape({
    project_name: yup.string().min(1, "Category Name must be at least 1 characters").required("Category Name is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      project_name: dataProject.project_name,
    },
  });

  const onSubmit = async (values) => {
    console.log("values", values);
    let payload = {
      project_name: values.project_name,
    };
    // Menampilkan toast ketika request sedang diproses
    const requestPromise = supabase.schema("belajar").from("project").update(payload).eq("id", dataProject.id);
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
          setShowEdit(true);
          return "Adding  Project Successfully";
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
      header="Edit Project"
      buttonName="Update"
      show={showEdit}
      setShow={setShowEdit}
      content={
        <form>
          <div>
            <LabelInput label="Project Name" type="text" id="project_name" name="project_name" placeholder="Fill Project Name" error={errors.project_name} register={register} required />
          </div>
        </form>
      }
      action={handleSubmit(onSubmit)}
    />
  );
};

export default EditProject;
