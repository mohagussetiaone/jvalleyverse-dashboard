import Modal from "@/components/modal/Modal";
import { useQueryClient } from "@tanstack/react-query";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import supabase from "@/configs/supabaseConfig";
import LabelInput from "@/components/input/LabelInput";

const AddRoles = ({ setShowAdd, showAdd }) => {
  const queryClient = useQueryClient();
  const validationSchema = yup.object().shape({
    role_name: yup.string().min(3, "Role Name must be at least 3 characters").required("Role Name is required"),
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
      role_name: values.role_name,
    };

    console.log("payload", payload);

    // Menampilkan toast ketika request sedang diproses
    const requestPromise = supabase.schema("user").from("roles").insert(payload);

    toast.promise(
      requestPromise,
      {
        loading: "Adding role...",
        success: (response) => {
          console.log("response", response);
          if (response.error) {
            throw response.error;
          }
          queryClient.invalidateQueries({
            queryKey: ["getRoles"],
          });
          setShowAdd(true);
          return "Adding Role Successfully";
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
      header="Add Role"
      buttonName="Add"
      show={showAdd}
      setShow={setShowAdd}
      content={
        <form>
          <div>
            <LabelInput label="Role Name" type="text" id="role_name" name="role_name" placeholder="Fill Role Name" error={errors.role_name} register={register} required />
          </div>
        </form>
      }
      action={handleSubmit(onSubmit)}
    />
  );
};

export default AddRoles;
