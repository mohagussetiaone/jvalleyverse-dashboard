import { Fragment, useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import supabase from "@/configs/supabaseConfig";
import toast from "react-hot-toast";
import TableContainer from "@/components/table/TableContainer";
import Search from "@/components/Search";
import CreateAndExport from "@/components/CreateAndExport";
import { IoMdMore } from "react-icons/io";
import { MdOutlineEdit, MdOutlineDeleteOutline } from "react-icons/md";
import { Menu, MenuButton, MenuItems, MenuItem, Transition } from "@headlessui/react";
import Loading from "@/components/Loading";
import AddProject from "./AddProject";
import EditProject from "./EditProject";
import ModalDelete from "@/components/modal/ModalDelete";

const Project = () => {
  const queryClient = useQueryClient();
  const [globalFilter, setGlobalFilter] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [dataProject, setDataProject] = useState({});

  const handleEdit = (data) => {
    setDataProject(data);
    setShowEdit(!showEdit);
  };

  const handleDelete = (data) => {
    setDataProject(data);
    setModalDelete(!modalDelete);
  };

  const columns = useMemo(
    () => [
      {
        id: "project_name",
        header: () => <p className="text-sm font-bold text-gray-800 dark:text-neutral-300">Nama Project</p>,
        accessorKey: "project_name",
      },
      {
        id: "project_github",
        header: () => <p className="text-sm font-bold text-gray-800 dark:text-neutral-300">Github</p>,
        accessorKey: "project_github",
        cell: (info) => {
          return <span className="w-64 truncate block">{info.getValue()}</span>;
        },
      },
      {
        id: "project_youtube_playlist",
        header: () => <p className="text-sm font-bold text-gray-800 dark:text-neutral-300">Youtube Playlist</p>,
        accessorKey: "project_youtube_playlist",
        cell: (info) => {
          return <span className="w-64 truncate block">{info.getValue()}</span>;
        },
      },
      {
        id: "aksi",
        header: () => <p className="text-sm font-bold text-gray-800 dark:text-neutral-300">Action</p>,
        cell: (info) => {
          return (
            <Menu as="div" className=" flex justify-start">
              <div>
                <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white dark:bg-black-500 dark:bg-navy-700 px-3 py-2 text-sm font-semibold text-black">
                  <IoMdMore className="-mr-1 h-5 w-5 dark:text-neutral-300" />
                </MenuButton>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <MenuItems className="absolute right-[6%] mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg focus:outline-none dark:bg-boxDark z-20">
                  <div className="rounded-lg">
                    <MenuItem>
                      <button className="flex w-full items-center px-4 py-2 text-sm text-black dark:text-white" onClick={() => handleEdit(info.row.original)}>
                        <MdOutlineEdit className="mr-2 w-6 h-6 dark:text-white" />
                        Edit
                      </button>
                    </MenuItem>
                    <MenuItem>
                      <button className="flex w-full items-center px-4 py-2 text-sm text-black dark:text-white" onClick={() => handleDelete(info.row.original)}>
                        <MdOutlineDeleteOutline className="mr-2 w-6 h-6 dark:text-white" />
                        Delete
                      </button>
                    </MenuItem>
                  </div>
                </MenuItems>
              </Transition>
            </Menu>
          );
        },
      },
    ],
    []
  );

  const {
    error: errorProject,
    isPending: isPendingProject,
    data: dataProjects,
  } = useQuery({
    queryKey: ["getProject"],
    queryFn: async () => {
      const { data: products } = await supabase.schema("belajar").from("project").select(`
        id,
        category_project (
          id,
          category_name
        ),
        project_published,
        project_img_url,
        project_name,
        project_description,
        project_github,
        project_youtube_embed,
        project_youtube_playlist,
        tags,
        created_at
        `);
      return products;
    },
  });

  console.log("dataProjects", dataProjects);

  // Delete Category Project
  const handleDeleteCategory = () => {
    // Menampilkan toast ketika request sedang diproses
    const requestPromise = supabase.schema("belajar").from("project").delete().eq("id", dataProject.id);
    toast.promise(
      requestPromise,
      {
        loading: "Delete data process...",
        success: (response) => {
          console.log("response", response);
          if (response.status === 204) {
            setModalDelete(false);
            queryClient.invalidateQueries({
              queryKey: ["getProject"],
            });
          }
          return "Delete Project Successfully";
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

  if (isPendingProject) {
    return <Loading />;
  }

  if (errorProject) {
    console.log("errorProject", errorProject);
  }

  console.log("isPendingProject", isPendingProject);

  console.log("errorProject", errorProject);

  return (
    <>
      <div className="overflow-x-auto">
        <div className="flex flex-col md:flex-row justify-between">
          <Search globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} tableName="Project" />
          <CreateAndExport setShowAdd={setShowAdd} datas={dataProjects || []} TableName="Project" />
        </div>
        <TableContainer datas={dataProjects || []} columns={columns} tableName="Configuration Port" globalFilter={globalFilter} title="Configuration Port" setGlobalFilter={setGlobalFilter} setModalAdd={() => setModalAdd(!modalAdd)} />
      </div>
      {/* Modal Add */}
      {showAdd && <AddProject showAdd={showAdd} setShowAdd={() => setShowAdd(!showAdd)} />}
      {/* Modal Edit */}
      {showEdit && <EditProject dataProject={dataProject} showEdit={showEdit} setShowEdit={() => setShowEdit(!showEdit)} />}
      {/* Modal Delete */}
      {modalDelete && <ModalDelete data="Category Project" idData={dataProject?.id} modalDelete={modalDelete} setModalDelete={() => setModalDelete(!modalDelete)} deleteFunction={handleDeleteCategory} />}
    </>
  );
};

export default Project;
