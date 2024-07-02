import Modal from "@/components/modal/Modal";
import { useQueryClient } from "@tanstack/react-query";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import supabase from "@/configs/supabaseConfig";
import LabelInput from "@/components/input/LabelInput";

const EditCategory = ({ setShowEdit, showEdit, dataCategory }) => {
  const queryClient = useQueryClient();
  const validationSchema = yup.object().shape({
    category_name: yup.string().min(1, "Category Name must be at least 1 characters").required("Category Name is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      category_name: dataCategory.category_name,
    },
  });

  const onSubmit = async (values) => {
    console.log("values", values);
    let payload = {
      category_name: values.category_name,
    };
    // Menampilkan toast ketika request sedang diproses
    const requestPromise = supabase.schema("belajar").from("category_project").update(payload).eq("id", dataCategory.id);
    toast.promise(
      requestPromise,
      {
        loading: "Adding category project...",
        success: (response) => {
          console.log("response", response);
          if (response.error) {
            throw response.error;
          }
          queryClient.invalidateQueries({
            queryKey: ["getCategoryProject"],
          });
          setShowEdit(true);
          return "Adding Category Project Successfully";
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
      header="Edit Category Project"
      buttonName="Update"
      show={showEdit}
      setShow={setShowEdit}
      content={
        <form>
          <div>
            <LabelInput label="Category Name" type="text" id="category_name" name="category_name" placeholder="Fill Category Name" error={errors.category_name} register={register} required />
          </div>
        </form>
      }
      action={handleSubmit(onSubmit)}
    />
  );
};

export default EditCategory;
