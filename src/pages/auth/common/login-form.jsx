import { useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import supabase from "@/configs/supabaseConfig";
import { set } from "@/store/local/Forage";
import Checkbox from "@/components/ui/Checkbox";
import Textinput from "@/components/ui/Textinput";

const schema = yup
  .object({
    email: yup.string().email("Invalid email").required("Email is Required"),
    password: yup.string().required("Password is Required"),
  })
  .required();

const LoginForm = () => {
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  const onSubmit = async (data) => {
    console.log("data", data);
    const { email, password } = data;
    if (!email || !password) {
      toast.error("Email dan Password harus diisi");
      return;
    }

    const loginPromise = new Promise(async (resolve, reject) => {
      try {
        // Membuat pengguna baru admin dengan Supabase
        const { data: userLogin, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (userLogin) {
          resolve(userLogin);
        } else {
          reject(error);
        }
      } catch (error) {
        console.log("catch error", error);
        if (error.message === "Network Error") {
          reject("Internal Server Error");
        } else {
          reject(error.message || "Email atau Password tidak valid");
        }
      }
    });

    toast.promise(
      loginPromise,
      {
        loading: "Memproses login...",
        success: (response) => {
          set(response.session.access_token);
          if (response.session === null) {
            toast.error("User tidak ditemukan");
            return;
          } else if (response.session !== null) {
            if (rememberMe) {
              localStorage.setItem("email", email);
              localStorage.setItem("password", password);
            } else {
              localStorage.removeItem("email");
              localStorage.removeItem("password");
            }
            navigate("/project");
            return "Login Berhasil";
          }
        },
        error: (error) => {
          console.log("error", error);
          return "Terjadi kesalahan saat login";
        },
      },
      {
        success: {
          duration: 1500,
        },
        error: {
          duration: 4000,
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Textinput name="email" label="Emails" type="email" register={register} error={errors.email} className="h-[48px]" />
      <Textinput name="password" label="Password" type="password" register={register} error={errors.password} className="h-[48px]" />
      <div className="flex justify-between">
        <Checkbox value={rememberMe} onChange={() => setRememberMe(!rememberMe)} label="Keep me signed in" />
        <Link to="/forgot-password" className="text-sm text-slate-800 dark:text-slate-400 leading-6 font-medium">
          Forgot Password?{" "}
        </Link>
      </div>

      <button type="submit" className="btn btn-dark block w-full text-center">
        Sign in
      </button>
      <div className="flex justify-end">
        Belum punya akun ?{" "}
        <Link to="/signup" className="text-sm text-slate-800 dark:text-slate-400 leading-6 font-medium">
          {" "}
          Sign up
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
