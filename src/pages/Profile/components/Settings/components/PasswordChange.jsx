import * as yup from "yup";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from "@tanstack/react-query";
import { handleChangePassword } from "@/api/Profile/ProfileApi";
import LabelInput from "@/components/input/LabelInput";
import Card from "@/components/ui/Card";

const PasswordChange = ({ userProfile }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const validationSchema = yup.object().shape({
    password: yup.string().min(1, "Password must be at least 1 characters").required("Password is required"),
    confirm_password: yup.string().min(1, "Password must be at least 1 characters").required("Password is required"),
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
    console.log("values", values);
    if (values.password !== values.confirm_password) {
      toast.error("Password does not match");
      return;
    }
    const requestPromise = new Promise(async (resolve, reject) => {
      try {
        let payload = {
          password: values.password,
        };
        // Update profile data
        const changePassword = handleChangePassword(payload.password);
        console.log("changePassword", changePassword);
        // when all process finish
        resolve(changePassword);
      } catch (error) {
        reject(error);
      }
    });
    toast.promise(
      requestPromise,
      {
        loading: "Updating password...",
        success: () => {
          queryClient.invalidateQueries({
            queryKey: ["getProfile"],
          });
          navigate("/profile");
          return "Change password successfully";
        },
        error: (error) => {
          console.log("error", error);
          return error.message || "An error occurred while processing data";
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
    <Card className="w-full">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div>
            <LabelInput label="Email" value={userProfile.email} type="email" id="email" name="email" placeholder="nFJpG@example.com" error={errors.email} register={register} disabled />
          </div>
          <div className="w-full flex gap-4 mb-2">
            <div className="w-1/2">
              <LabelInput label="Password" type="password" id="password" name="password" placeholder="••••••••" error={errors.password} register={register} required />
            </div>
            <div className="w-1/2">
              <LabelInput label="Konfirmasi Password" type="password" id="confirm_password" name="confirm_password" placeholder="••••••••" error={errors.confirm_password} register={register} required />
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button type="submit" className="btn btn-primary">
            Ganti password
          </button>
        </div>
      </form>
    </Card>
  );
};

export default PasswordChange;
