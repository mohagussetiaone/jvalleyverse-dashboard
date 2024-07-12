import { useState } from "react";
import ProfileImg from "@/assets/images/users/profileDefault.jpg";
import { TiDelete } from "react-icons/ti";
import Card from "@/components/ui/Card";

const DetailProfile = ({ userProfile }) => {
  const [profileImg, setProfileImg] = useState(ProfileImg); // Default profile image
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
        alert("File size exceeds 2MB limit. Please choose a smaller file.");
        return;
      }

      // Validasi ekstensi file
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        alert("Only JPEG, PNG, and JPG files are allowed.");
        return;
      }

      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = () => {
    if (selectedFile) {
      // Lakukan upload ke server atau penyimpanan gambar di sini
      console.log("Uploading:", selectedFile);
      // Reset selected file
      setSelectedFile(null);
      setPreviewUrl(null); // Reset preview URL
    }
  };

  const handleRemovePreview = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  return (
    <Card>
      <div className="w-full gap-6">
        <div className="flex gap-4">
          <div className="w-[150px] relative">
            <img src={previewUrl || profileImg} alt="profile" className="w-full h-auto rounded-full" />
            {previewUrl && (
              <span className="absolute -top-2 -right-2 cursor-pointer" onClick={handleRemovePreview}>
                <TiDelete className="text-red-500 w-9 h-9" />
              </span>
            )}
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
          <button className="btn btn-sm btn-primary" disabled={!selectedFile}>
            Change Profile
          </button>
        </div>
      </div>
    </Card>
  );
};

export default DetailProfile;
