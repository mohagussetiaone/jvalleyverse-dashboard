import Modal from "@/components/modal/Modal";
import { useQueryClient } from "@tanstack/react-query";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import supabase from "@/configs/supabaseConfig";
import LabelInput from "@/components/input/LabelInput";

const AddCategory = ({ setShowAdd, showAdd }) => {
  const queryClient = useQueryClient();
  const validationSchema = yup.object().shape({
    category_name: yup.string().min(1, "Category Name must be at least 1 characters").required("Category Name is required"),
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
    console.log("values", values);
    let payload = {
      category_name: values.category_name,
    };

    console.log("payload", payload);

    // Menampilkan toast ketika request sedang diproses
    const requestPromise = supabase.schema("belajar").from("category_project").insert(payload);

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
          setShowAdd(true);
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
      header="Add Category Project"
      buttonName="Add"
      show={showAdd}
      setShow={setShowAdd}
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

export default AddCategory;
