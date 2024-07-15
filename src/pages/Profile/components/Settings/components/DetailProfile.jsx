import { useState } from "react";
import ImageDefault from "@/assets/images/users/profileDefault.jpg";
import toast from "react-hot-toast";
import { FaDice } from "react-icons/fa";
import supabase from "@/configs/supabaseConfig";
import { handleUpdateImageProfile } from "@/api/Profile/ProfileApi";
import { useNavigate } from "react-router-dom";
import Card from "@/components/ui/Card";

const DetailProfile = ({ userProfile }) => {
  const navigate = useNavigate();
  const urlImageProfile = `${import.meta.env.VITE_CDN_GET_IMAGE}/jvalleyverseImg/${userProfile?.profile_image_url}`;
  const [profileImg, setProfileImg] = useState(userProfile?.profile_image_url !== null ? urlImageProfile : ImageDefault);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    if (file) {
      // Validasi ukuran file maksimum (2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size exceeds 2MB limit. Please choose a smaller file.");
        return;
      }
      // Validasi ekstensi file
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only JPEG, PNG, and JPG files are allowed.");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePreview = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setProfileImg(ImageDefault);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const downloadImage = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const extension = blob.type.split("/")[1];
    const fileName = `${Date.now()}.${extension}`;
    const file = new File([blob], fileName, { type: blob.type });
    handleFile(file);
  };

  const handleDiceClick = () => {
    const newAvatarUrl = `https://api.multiavatar.com/${new Date().getTime()}.png`;
    setProfileImg(newAvatarUrl);
    setPreviewUrl(null);
    downloadImage(newAvatarUrl);
  };

  const onSubmit = async () => {
    const requestPromise = new Promise(async (resolve, reject) => {
      try {
        if (selectedFile) {
          const { data, error } = await supabase.storage.from("jvalleyverseImg").upload(`profileImage/${userProfile.id}/${selectedFile.name}`, selectedFile);
          if (error) {
            console.error("Error uploading file:", error);
            reject(error);
          } else {
            let payload = {
              id: userProfile.id,
              profile_image_url_new: data?.path,
              profile_image_url_old: userProfile.profile_image_url,
            };
            await handleUpdateImageProfile(payload);
            setSelectedFile(null);
            setPreviewUrl(null);

            resolve(data);
          }
        } else {
          resolve();
        }
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(
      requestPromise,
      {
        loading: "Uploading file...",
        success: () => {
          setTimeout(() => {
            navigate("/profile");
            window.location.reload();
          }, 2000);
          return "Berhasil mengubah profile";
        },
        error: (error) => {
          return error.message || "An error occurred while uploading file";
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
    <Card>
      <div className="w-full gap-6">
        <div className="flex gap-4">
          <div className="w-[150px] relative">
            <img src={profileImg} alt="profile" className="w-full h-auto rounded-full" />
            {previewUrl && (
              <span className="absolute top-[130px] right-7 cursor-pointer" onClick={handleRemovePreview}>
                <span className="text-red-500 bg-red-50 p-1 text-sm">Remove</span>
              </span>
            )}
            <span className="absolute top-16 md:top-[70px] xl:top-20 right-0 cursor-pointer" onClick={handleDiceClick}>
              <FaDice className="text-blue-500 w-9 h-9" />
            </span>
          </div>
          <div className="w-full flex flex-col gap-4">
            <input type="file" className="file-input w-full" onChange={handleFileChange} />
            <div className={`drop-area ${dragOver ? "drag-over" : ""}`} onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
              <label className="flex justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                <span className="flex items-center space-x-2" onChange={handleFileChange}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="font-medium text-gray-600">
                    Drop files to Attach, or
                    <span className="text-blue-600 underline">browse</span>
                  </span>
                </span>
                <input type="file" name="file_upload" className="hidden" onChange={handleFileChange} />
              </label>
            </div>
            <span>
              <p className="text-xs">Gambar Profile Anda sebaiknya memiliki rasio 1:1 dan berukuran tidak lebih dari 2MB.</p>
            </span>
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <button className="btn btn-sm btn-primary" onClick={onSubmit}>
            Change Profile
          </button>
        </div>
      </div>
    </Card>
  );
};

export default DetailProfile;
