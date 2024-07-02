import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import Checkbox from "@/components/ui/Checkbox";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { handleLogin } from "./store";
import { toast } from "react-toastify";
import supabase from "@/configs/supabaseConfig"; // Pastikan untuk mengimpor supabase

const schema = yup
  .object({
    email: yup.string().email("Invalid email").required("Email is Required"),
    password: yup.string().required("Password is Required"),
  })
  .required();

const LoginForm = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.auth);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  const onSubmit = async (data) => {
    const { email, password } = data;
    const { user, session, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error fetching data:", error.message);
    } else {
      console.log("Data fetched:", data);
    }
    navigate("/project");

    console.log("user", user);
    console.log("session", session);
    console.log("error", error);
    if (error) {
      toast.error(error.message);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    console.log("error", error);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Textinput name="email" label="Email" type="email" register={register} error={errors.email} className="h-[48px]" />
      <Textinput name="password" label="Password" type="password" register={register} error={errors.password} className="h-[48px]" />
      <div className="flex justify-between">
        <Checkbox value={checked} onChange={() => setChecked(!checked)} label="Keep me signed in" />
        <Link to="/forgot-password" className="text-sm text-slate-800 dark:text-slate-400 leading-6 font-medium">
          Forgot Password?{" "}
        </Link>
      </div>

      <button type="submit" className="btn btn-dark block w-full text-center">
        Sign in
      </button>
      <button type="button" className="btn btn-dark block w-full text-center" onClick={handleLogout}>
        Sign Out
      </button>
    </form>
  );
};

export default LoginForm;
