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
import AddChapterDetail from "./AddChapterDetail";
import EditChapterDetail from "./EditChapterDetail";
import ModalDelete from "@/components/modal/ModalDelete";

const ChapterDetail = () => {
  const queryClient = useQueryClient();
  const [globalFilter, setGlobalFilter] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [dataChapterDetail, setDataChapterDetail] = useState({});

  const handleEdit = (data) => {
    setDataChapterDetail(data);
    setShowEdit(!showEdit);
  };

  const handleDelete = (data) => {
    setDataChapterDetail(data);
    setModalDelete(!modalDelete);
  };

  const columns = useMemo(
    () => [
      {
        id: "projectid",
        header: () => <p className="text-sm font-bold text-gray-800 dark:text-neutral-300">Project Name</p>,
        accessorKey: "project.project_name",
      },
      {
        id: "chapter_name",
        header: () => <p className="text-sm font-bold text-gray-800 dark:text-neutral-300">Chapter Name</p>,
        accessorKey: "chapter_project.chapter_name",
      },
      {
        id: "chapter_detail_name",
        header: () => <p className="text-sm font-bold text-gray-800 dark:text-neutral-300">Chapter Detail Name</p>,
        accessorKey: "chapter_detail_name",
      },
      {
        id: "youtube_url",
        header: () => <p className="text-sm font-bold text-gray-800 dark:text-neutral-300">Youtube Url</p>,
        accessorKey: "youtube_url",
      },
      {
        id: "tags",
        header: () => <p className="text-sm font-bold text-gray-800 dark:text-neutral-300">Tags</p>,
        accessorKey: "tags",
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
                <MenuItems className="absolute right-[5%] mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg focus:outline-none dark:bg-boxDark z-20">
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
    error: errorChapterDetail,
    isPending: isPendingChapterDetail,
    data: dataChapterDetails,
  } = useQuery({
    queryKey: ["getChapterDetail"],
    queryFn: async () => {
      const { data } = await supabase.schema("belajar").from("chapter_detail").select(`
        id,
        project (
          id,
          project_name
        ),
        chapter_project (
          id,
          chapter_name
        ),
        chapter_detail_name,
        youtube_url,
        tags,
        progress,
        created_at,
        updated_at
        `);
      return data;
    },
  });

  // Delete Chapter Detail
  const handleDeleteChapterDetail = () => {
    // Menampilkan toast ketika request sedang diproses
    const requestPromise = supabase.schema("belajar").from("chapter_detail").delete().eq("id", dataChapterDetail.id);
    toast.promise(
      requestPromise,
      {
        loading: "Delete data process...",
        success: () => {
          setModalDelete(false);
          queryClient.invalidateQueries({
            queryKey: ["getChapterDetail"],
          });
          return "Delete Chapter detail Successfully";
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

  if (isPendingChapterDetail) {
    return <Loading />;
  }

  if (errorChapterDetail) {
    console.log("errorChapterDetail", errorChapterDetail);
  }

  console.log("dataChapterDetails", dataChapterDetails);

  return (
    <>
      <div className="overflow-x-auto">
        <div className="flex flex-col md:flex-row justify-between">
          <Search globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} tableName="Chapter Detail" />
          <CreateAndExport setShowAdd={setShowAdd} datas={dataChapterDetails || []} TableName="Chapter Detail" />
        </div>
        <TableContainer datas={dataChapterDetails || []} columns={columns} tableName="Chapter Detail" globalFilter={globalFilter} title="Chapter Detail" setGlobalFilter={setGlobalFilter} setModalAdd={() => setModalAdd(!modalAdd)} />
      </div>

      {/* Modal Add */}
      {showAdd && <AddChapterDetail showAdd={showAdd} setShowAdd={() => setShowAdd(!showAdd)} />}

      {/* Modal Edit */}
      {showEdit && <EditChapterDetail dataChapterDetail={dataChapterDetail} showEdit={showEdit} setShowEdit={() => setShowEdit(!showEdit)} />}

      {/* Modal Delete */}
      {modalDelete && <ModalDelete data="Chapter Detail" idData={dataChapterDetail?.id} modalDelete={modalDelete} setModalDelete={() => setModalDelete(!modalDelete)} deleteFunction={handleDeleteChapterDetail} />}
    </>
  );
};

export default ChapterDetail;
