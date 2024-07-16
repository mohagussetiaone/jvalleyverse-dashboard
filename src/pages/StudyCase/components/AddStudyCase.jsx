import "../../Project/components/tags.scss";
import { useState } from "react";
import * as yup from "yup";
import Modal from "@/components/modal/Modal";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { IoMdClose } from "react-icons/io";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import supabase from "@/configs/supabaseConfig";
import LabelInput from "@/components/input/LabelInput";
import TextInput from "@/components/input/TextInput";
import Select from "@/components/input/Select";
import { WithContext as ReactTags, SEPARATORS } from "react-tag-input";
import SuggestionTags from "../../Project/components/data/suggestionTags";

const suggestions = SuggestionTags.map((tags) => {
  return {
    id: tags,
    text: tags,
  };
});

const AddStudyCase = ({ setShowAdd, showAdd }) => {
  const queryClient = useQueryClient();
  const [tags, setTags] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const validationSchema = yup.object().shape({
    category_id: yup.string().min(1, "Category ID must be at least 1 characters").required("Category ID is required"),
    is_published: yup.string().min(1, "Published must be at least 1 characters").required("Published is required"),
    name: yup.string().min(1, "Project Name must be at least 1 characters").required("Project Name is required"),
    description: yup.string().min(1, "Description must be at least 1 characters").required("Description is required"),
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
    // Check if image file is selected
    if (!imageFile) {
      toast.error("Please select an image to upload");
      return;
    }

    const requestPromise = new Promise(async (resolve, reject) => {
      try {
        const { data: studyCaseData, error: studyCaseError } = await supabase.schema("belajar").from("studi_kasus").select("id").eq("name", values.name);
        console.log("studyCaseData", studyCaseData);
        if (studyCaseError) throw studyCaseError;
        if (studyCaseData.length > 0) {
          // If studi kasus name exists, throw an error
          throw new Error("Study case name already exists. Please choose a different name.");
        }
        // Get studi kasus id
        const { data: studyCaseIds, error: studyCaseIdError } = await supabase.schema("belajar").from("studi_kasus").select("id", { count: "exact" }).order("id", { ascending: false }).limit(1);
        // if get studi kasus error
        if (studyCaseIdError) throw studyCaseIdError;
        // set sequence studi kasus
        const studyCaseId = studyCaseIds[0]?.id + 1 || 1;
        console.log("studyCaseIds", studyCaseId);
        // upload file into storage
        const { data: storageData, error: storageError } = await supabase.storage.from("jvalleyverseImg").upload(`studiKasus/${studyCaseId}/${imageFile.name}`, imageFile);
        console.log("storageData", storageData);
        // if upload error
        if (!storageData || !storageData.path || storageError) {
          throw new Error("Failed to upload image");
        }
        const tagsData = tags.map((tag) => tag.text);
        // Payload for insert
        let payload = {
          img_url: storageData.path,
          category_id: values.category_id,
          name: values.name,
          description: values.description,
          is_published: values.is_published,
          tags: tagsData,
        };
        // Insert studi kasus data
        const { data: dataProject, error: errorProject } = await supabase.schema("belajar").from("studi_kasus").insert(payload);
        // error insert
        console.log("dataProject", dataProject);
        console.log("errorProject", errorProject);
        if (errorProject) throw errorProject;
        // when all process finish
        resolve(dataProject);
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(
      requestPromise,
      {
        loading: "Adding studi kasus...",
        success: () => {
          queryClient.invalidateQueries({
            queryKey: ["getStudyCase"],
          });
          setShowAdd(true);
          return "Adding studi kasus successfully";
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

  const {
    error: errorCategoryProject,
    isPending: isPendingCategoryProject,
    data: dataCategoryProjects,
  } = useQuery({
    queryKey: ["getCategoryProject"],
    queryFn: async () => {
      const { data } = await supabase.schema("belajar").from("category_project").select(`
          id,
          category_name
        `);
      return data;
    },
  });

  if (isPendingCategoryProject) {
    toast.loading("Loading category project...");
  } else if (errorCategoryProject) {
    toast.error("Failed to get category project");
  } else {
    toast.remove();
  }

  const handleChange = (name, selectedOption) => {
    setValue(name, selectedOption.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageReset = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const optionCategoryProject = dataCategoryProjects?.map((studi_kasus) => ({
    value: studi_kasus.id,
    label: studi_kasus.category_name,
  }));

  const optionProjectPublish = [
    {
      label: "Ya",
      value: true,
    },
    {
      label: "Tidak",
      value: false,
    },
  ];

  const handleDelete = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const onTagUpdate = (index, newTag) => {
    const updatedTags = [...tags];
    updatedTags.splice(index, 1, newTag);
    setValue("tags", updatedTags);
    setTags(updatedTags);
  };

  const handleAddition = (tag) => {
    setValue("tags", [...tags, tag]);
    setTags((prevTags) => {
      return [...prevTags, tag];
    });
  };

  const handleDrag = (tag, currPos, newPos) => {
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    setValue("tags", newTags);
    setTags(newTags);
  };

  const handleTagClick = (index) => {
    console.log("The tag at index " + index + " was clicked");
  };

  const onClearAll = () => {
    setTags([]);
  };

  return (
    <Modal
      header="Add Studi Kasus"
      className="max-w-3xl"
      buttonName="Add"
      show={showAdd}
      setShow={setShowAdd}
      content={
        <form>
          <div className="flex flex-col gap-2 mb-2">
            <label htmlFor="img_url" className="text-black-500 font-medium text-sm">
              Upload Image <span className="text-red-700">*</span>
            </label>
            <input id="img_url" name="img_url" type="file" accept="image/*" onChange={handleImageChange} className="file-input file-input-sm file-input-ghost w-full max-w-xs" />
            {imagePreview && (
              <div className="relative bg-black-200 rounded-e-lg">
                <img src={imagePreview} alt="Image Preview" className="rounded w-[200px] h-auto" />
                <button type="button" onClick={handleImageReset} className="absolute top-0 right-0 m-2 p-1 bg-red-500 text-white rounded-full">
                  <IoMdClose />
                </button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="">
              <Select
                label="Category"
                name="category_id"
                options={optionCategoryProject || []}
                value={register("category_id").value}
                onChange={handleChange}
                register={register}
                error={errors.category_id}
                required
                isDisabled={isPendingCategoryProject}
              />
            </div>
            <div className="">
              <LabelInput label="Name" type="text" id="name" name="name" placeholder="Fill Name" error={errors.name} register={register} required />
            </div>
          </div>

          <div className="mb-2">
            <Select label="Publikasi" name="is_published" options={optionProjectPublish || []} value={register("is_published").value} onChange={handleChange} register={register} error={errors.is_published} required />
          </div>

          <div className="mb-2">
            <TextInput label="Description" type="text" id="description" name="description" placeholder="Fill Description" error={errors.description} register={register} required />
          </div>

          <div className="mb-2">
            <div className="text-black-500 font-medium text-sm my-1">
              Tags<span className="text-red-700">*</span>
            </div>
            <ReactTags
              tags={tags}
              suggestions={suggestions}
              separators={[SEPARATORS.COMMA]}
              handleDelete={handleDelete}
              handleAddition={handleAddition}
              handleDrag={handleDrag}
              handleTagClick={handleTagClick}
              onTagUpdate={onTagUpdate}
              inputFieldPosition="top"
              editable
              clearAll
              onClearAll={onClearAll}
              maxTags={7}
              allowAdditionFromPaste
            />
          </div>
        </form>
      }
      action={handleSubmit(onSubmit)}
    />
  );
};

export default AddStudyCase;
