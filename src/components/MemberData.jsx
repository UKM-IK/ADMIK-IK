import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import DataTable from "react-data-table-component";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Input,
  Typography,
} from "@material-tailwind/react";
import { BiEditAlt, BiSearch} from "react-icons/bi";
import { Link } from "react-router-dom";

export default function MemberData() {
  const [page] = useState(1);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [modalData, setModalData] = useState({});

  const downloadCSV = async () => {
    try {
      const response = await axiosInstance.get("download", {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${atob(Cookies.get("userToken"))}`,
        },
      });
      console.log(response);
      const blob = new Blob([response.data], {
        type: "text/csv;charset=utf-8;",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "data-ca.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading CSV:", error);
    }
  };

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleFee = async (id, val) => {
    try {
      console.log(val);
      let formData = new FormData();
      formData.append("status_fee", val === 2 ? 1 : 2);
      const response = await axiosInstance.put(`ca/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${atob(Cookies.get("userToken"))}`,
        },
      });

      if (response.data.status_code === 200) {
        getData();
        handleOpen(false);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSearch = (searchTerm) => {
    // Filter data based on the search term
    const filteredData = data.filter((item) =>
      item.nama.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    // Update the state with filtered data
    setFilteredData(filteredData);
  };

  const getData = async () => {
    const response = await axiosInstance.get(`ca/${page}/100`, {
      headers: {
        Authorization: `Bearer ${atob(Cookies.get("userToken"))}`,
      },
    });
    setFilteredData(response.data.Data);
    setData(response.data.Data);
  };

  useEffect(() => {
    try {
      getData();
    } catch (error) {
      console.error(error);
    }
  }, []);

  const DetailMember = ({ data }) => {
    const {
      id,
      nama,
      email,
      angkatan,
      fakultas,
      jurusan,
      image,
      jenis_kelamin,
      no_telpon,
      status_fee,
    } = data;

    return (
      <div className="p-8 flex gap-4">
        <div className="relative h-fit w-1/4">
          <img
            className="h-48 w-full rounded-xl object-cover object-center"
            src={`https://ukmik.utdi.ac.id/api/ca-image/${image}`}
            alt={image}
          />
        </div>
        <div className="flex border border-2 rounded-xl p-4 w-full justify-between">
          <div>
            <h1 className="font-bold">
              {nama} ({angkatan})
            </h1>
            <h2 className="text-gray-400">{email}</h2>
            <h1 className="italic">
              Fakultas {fakultas} - {jurusan}
            </h1>
            <h1
              className={`${
                jenis_kelamin === "Perempuan" ? "text-red-600" : "text-blue-600"
              }`}
            >
              {jenis_kelamin}
            </h1>
            <h1 className="font-bold mt-6 text-red-600">
              <Button
                color={`${status_fee === 2 ? "green" : "red"}`}
                size="sm"
                onClick={() => {
                  handleOpen();
                  setModalData({ id, nama, status_fee });
                }}
                className="text-[9px] flex gap-1 items-center"
                fullWidth={false}
              >
                <BiEditAlt size="13px" />{" "}
                {status_fee === 1 ? "Belum Lunas" : "Lunas"}
              </Button>
            </h1>
          </div>
          <div>
            <Button color="green">
              <Link to={`https://wa.me/62${no_telpon.substring(1)}`}>
                WhatsApp
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const subHeader = () => {
    return <h1>test</h1>;
  };

  const columns = [
    {
      name: "No",
      selector: (row) => row.no,
      width: "50px",
    },

    {
      name: "NIM",
      selector: (row) => row.nim,
      sortable: true,
    },
    {
      name: "Nama",
      selector: (row) => row.nama,
      sortable: true,
    },
    {
      name: "Jurusan",
      selector: (row) => row.jurusan,
      sortable: true,
    },
    {
      name: "Jenis Kelamin",
      selector: (row) => row.jenis_kelamin,
      sortable: true,
    },
    {
      name: "Status HTM",
      selector: (row) => row.status_fee,
      cell: ({ status_fee, id, nama }) => (
        <div className="p-1">
          <Button
            color={`${status_fee === 2 ? "green" : "red"}`}
            size="sm"
            onClick={() => {
              handleOpen();
              setModalData({ id, nama, status_fee });
            }}
            className="text-[9px] flex gap-1 items-center"
            fullWidth={false}
          >
            <BiEditAlt size="13px" />{" "}
            {status_fee === 1 ? "Belum Lunas" : "Lunas"}
          </Button>
        </div>
      ),
      sortable: true,
      width: "155px",
    },
    {
      name: "No Telpon",
      cell: (row) => (
        <div className="flex w-fit">
          <Link
            className="text-blue-600"
            target="_blank"
            to={`https://wa.me/62${row.no_telpon.substring(1)}`}
          >
            {row.no_telpon}
          </Link>
        </div>
      ),
      sortable: true,
    },
  ];

  return (
    <div>
      <DataTable
        columns={columns}
        data={filteredData}
        direction="auto"
        expandOnRowClicked
        expandableRows
        expandableRowsComponent={DetailMember}
        defaultSortFieldId={3}
        fixedHeader
        title={
          <Typography variant="h4">
            Data Calon Anggota UKM Informatika & Komputer
          </Typography>
        }
        fixedHeaderScrollHeight="80vh"
        highlightOnHover
        pagination
        pointerOnHover
        responsive
        striped
        subHeader
        subHeaderAlign="right"
        subHeaderWrap
        subHeaderComponent={
          <div className="relative flex w-full gap-2 md:w-max">
            <Input
              type="search"
              label="Cari Berdasarkan Nama"
              className="pr-20"
              containerProps={{
                className: "min-w-[288px]",
              }}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <IconButton size="sm" className="!absolute right-1 top-1 rounded" color="green">
              <BiSearch />
            </IconButton>
          </div>
        }
        actions={
          <>
            <Button color="green" onClick={downloadCSV}>
              Export to CSV
            </Button>
          </>
        }
      />
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Konfirmasi Pembayaran HTM Latihan Kader.</DialogHeader>
        <DialogBody divider>
          <h1>
            Apakah{" "}
            <b className="font-bold text-green-600 underline">
              {modalData.nama}
            </b>{" "}
            <span className="text-red-800 font-bold">
              {modalData.status_fee === 1 ? "sudah" : "belum"}
            </span>{" "}
            membayar HTM?
          </h1>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => handleOpen(false)}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={() => handleFee(modalData.id, modalData.status_fee)}
          >
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
