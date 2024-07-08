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
import AddChapterProject from "./AddChapterProject";
import EditChapterProject from "./EditChapterProject";
import ModalDelete from "@/components/modal/ModalDelete";

const ChapterProject = () => {
  const queryClient = useQueryClient();
  const [globalFilter, setGlobalFilter] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [dataChapterProject, setDataChapterProject] = useState({});

  const handleEdit = (data) => {
    setDataChapterProject(data);
    setShowEdit(!showEdit);
  };

  const handleDelete = (data) => {
    setDataChapterProject(data);
    setModalDelete(!modalDelete);
  };

  const columns = useMemo(
    () => [
      {
        id: "projectname",
        header: () => <p className="text-sm font-bold text-gray-800 dark:text-neutral-300">Project Name</p>,
        accessorKey: "project.project_name",
      },
      {
        id: "chapter_name",
        header: () => <p className="text-sm font-bold text-gray-800 dark:text-neutral-300">Chapter Name</p>,
        accessorKey: "chapter_name",
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
                <MenuItems className="absolute right-[14%] mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg focus:outline-none dark:bg-boxDark z-20">
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
    error: errorChapterProject,
    isPending: isPendingChapterProject,
    data: dataChapterProjects,
  } = useQuery({
    queryKey: ["getChapterProject"],
    queryFn: async () => {
      const { data } = await supabase.schema("belajar").from("chapter_project").select(`
        id,
        chapter_name,
        project!chapter_project_project_id_fkey (
          id,
          project_name
        ),
        created_at
        `);
      return data;
    },
  });

  // Delete Chapter Project
  const handleDeleteChapterProject = () => {
    // Menampilkan toast ketika request sedang diproses
    const requestPromise = supabase.schema("belajar").from("chapter_project").delete().eq("id", dataChapterProject.id);
    toast.promise(
      requestPromise,
      {
        loading: "Delete data process...",
        success: (response) => {
          console.log("response", response);
          if (response.status === 204) {
            setModalDelete(false);
            queryClient.invalidateQueries({
              queryKey: ["getChapterProject"],
            });
          }
          return "Delete Chapter Project Successfully";
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

  if (isPendingChapterProject) {
    return <Loading />;
  }

  if (errorChapterProject) {
    console.log("errorChapterProject", errorChapterProject);
  }

  console.log("products", dataChapterProjects);

  return (
    <>
      <div className="overflow-x-auto">
        <div className="flex flex-col md:flex-row justify-between">
          <Search globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} tableName="Chapter Project" />
          <CreateAndExport setShowAdd={setShowAdd} datas={dataChapterProjects || []} TableName="Chapter Project" />
        </div>
        <TableContainer datas={dataChapterProjects || []} columns={columns} tableName="Chapter Project" globalFilter={globalFilter} title="Chapter Project" setGlobalFilter={setGlobalFilter} setModalAdd={() => setModalAdd(!modalAdd)} />
      </div>

      {/* Modal Add */}
      {showAdd && <AddChapterProject showAdd={showAdd} setShowAdd={() => setShowAdd(!showAdd)} />}

      {/* Modal Edit */}
      {showEdit && <EditChapterProject dataChapterProject={dataChapterProject} showEdit={showEdit} setShowEdit={() => setShowEdit(!showEdit)} />}

      {/* Modal Delete */}
      {modalDelete && <ModalDelete data="Chapter Project" idData={dataChapterProject?.id} modalDelete={modalDelete} setModalDelete={() => setModalDelete(!modalDelete)} deleteFunction={handleDeleteChapterProject} />}
    </>
  );
};

export default ChapterProject;
