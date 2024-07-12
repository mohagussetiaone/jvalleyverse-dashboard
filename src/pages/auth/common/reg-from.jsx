import toast from "react-hot-toast";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { createSupabaseAdmin } from "@/lib/createSupabaseAdmin";

const schema = yup
  .object({
    name: yup.string().required("Name is Required"),
    email: yup.string().email("Invalid email").required("Email is Required"),
    password: yup.string().min(6, "Password must be at least 8 characters").max(20, "Password shouldn't be more than 20 characters").required("Please enter password"),
    confirmpassword: yup.string().oneOf([yup.ref("password"), null], "Passwords must match"),
  })
  .required();

const RegForm = () => {
  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  const handleSignUp = async (data) => {
    const { name, email, password } = data;
    if (!name || !email || !password) {
      toast.error("Name, Email dan Password harus diisi");
      return;
    }

    const promise = new Promise(async (resolve, reject) => {
      try {
        const supabase = await createSupabaseAdmin();
        // Membuat pengguna baru admin dengan Supabase
        const { data: userAdmin, error } = await supabase.auth.admin.createUser({
          email: email,
          password: password,
          email_confirm: true,
          user_metadata: { role: "Admin", name: name },
        });

        console.log("userAdmin", userAdmin);
        if (error) {
          reject(error);
          return;
        }
        if (userAdmin) {
          const { data, error: errorUser } = await supabase.schema("user").from("users").insert({
            id: userAdmin.user.id,
            role_id: 1,
            name: name,
            email: email,
            verify: true,
          });
          console.log("data insert", data);
          if (errorUser) {
            reject(errorUser);
            return;
          }
          resolve();
        }
      } catch (error) {
        console.log("error", error);
        if (error.message === "Network Error") {
          reject("Internal Server Error");
        } else {
          reject(error.message || "Email atau Password tidak valid");
        }
      }
    });

    toast.promise(
      promise,
      {
        loading: "Processing ...",
        success: () => {
          navigate("/signin");
          return "Sign Up Berhasil";
        },
        error: (message) => {
          console.log("error", message);
          return message;
        },
      },
      {
        success: {
          duration: 2000,
        },
        error: {
          duration: 4000,
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(handleSignUp)} className="space-y-2 ">
      <Textinput name="name" label="name" type="text" placeholder=" Enter your name" register={register} error={errors.name} className="h-[48px]" />{" "}
      <Textinput name="email" label="email" type="email" placeholder=" Enter your email" register={register} error={errors.email} className="h-[48px]" />
      <Textinput name="password" label="passwrod" type="password" placeholder=" Enter your password" register={register} error={errors.password} className="h-[48px]" />
      <button type="submit" className="btn btn-dark block w-full text-center mt-4">
        Create an account
      </button>
    </form>
  );
};

export default RegForm;
