import { useEffect, useState } from "react";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from "@tanstack/react-query";
import { handleUpdateProfile } from "@/api/Profile/ProfileApi";
import LabelInput from "@/components/input/LabelInput";
import TextInput from "@/components/input/TextInput";
import Card from "@/components/ui/Card";

const PersonalData = ({ userProfile }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isUsernameEditable, setIsUsernameEditable] = useState(true);

  const validationSchema = yup.object().shape({
    name: yup.string().min(3, "Full name must be at least 3 characters").required("Full name is required"),
    email: yup.string().min(3, "Email must be at least 3 characters").required("Email is required"),
    username: yup.string().min(3, "Username must be at least 3 characters").required("Username is required"),
    phone: yup.string().min(1, "Phone must be at least 1 characters").required("Phone is required"),
    about: yup.string().optional().nullable(),
    address: yup.string().optional().nullable(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (userProfile) {
      setValue("name", userProfile.name);
      setValue("email", userProfile.email);
      setValue("username", userProfile.username);
      setValue("phone", userProfile.phone);
      setValue("address", userProfile.address);
      setValue("about", userProfile.about);
      if (userProfile.username) {
        setIsUsernameEditable(false);
      }
    }
  }, [userProfile, setValue]);

  const onSubmit = async (values) => {
    console.log("values", values);
    const requestPromise = new Promise(async (resolve, reject) => {
      try {
        let payload = {
          username: values.username,
          name: values.name,
          email: values.email,
          phone: values.phone,
          address: values.address,
          about: values.about,
        };
        // Update profile data
        const profile = handleUpdateProfile(userProfile.id, payload);
        console.log("profile", profile);
        // when all process finish
        resolve(profile);
      } catch (error) {
        reject(error);
      }
    });
    toast.promise(
      requestPromise,
      {
        loading: "Updating profile...",
        success: () => {
          queryClient.invalidateQueries({
            queryKey: ["getProfile"],
          });
          navigate("/profile");
          return "Profile updated successfully";
        },
        error: (error) => {
          try {
            const errorMessage = JSON.parse(error.message);
            if (errorMessage.code === "23505") {
              if (errorMessage.message.includes("users_phone_key")) {
                return "Phone number is already in use.";
              } else if (errorMessage.message.includes("users_username_key")) {
                return "Username is already in use.";
              }
            }
            return `Error: ${errorMessage.message} (Code: ${errorMessage.code})`;
          } catch (e) {
            return "An unexpected error occurred.";
          }
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
          <div className="mb-2">
            <LabelInput label="Fullname" type="text" id="name" name="name" placeholder="John Doe" error={errors.name} register={register} required />
          </div>
          <div className="mb-2">
            <LabelInput label="Email" type="email" id="email" name="email" placeholder="nFJpG@example.com" error={errors.email} register={register} required />
          </div>
          <div className="mb-2">
            <LabelInput label="Username" type="username" id="username" name="username" placeholder="john" error={errors.username} register={register} disabled={!isUsernameEditable} required />
          </div>
          <div className="mb-2">
            <LabelInput label="Phone" type="phone" id="phone" name="phone" placeholder="081234567890" error={errors.phone} register={register} required />
          </div>
          <div className="mb-2">
            <TextInput label="Address" type="address" id="address" name="address" placeholder="Jl Kumbang No 1" error={errors.address} register={register} />
          </div>
          <div className="mb-2">
            <TextInput label="About Me" type="about" id="about" name="about" placeholder="Frontend Developer" error={errors.about} register={register} />
          </div>
        </div>
        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary">
            Update Profile
          </button>
        </div>
      </form>
    </Card>
  );
};

export default PersonalData;
