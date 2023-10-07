import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  CardFooter,
  Button,
} from "@material-tailwind/react";
import {
  AiOutlineUsergroupAdd,
  AiOutlineMan,
  AiOutlineWoman,
} from "react-icons/ai";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { Link } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import Cookies from "js-cookie";

export default function Home() {
  const [data, setData] = useState([]);
  const [dataCard, setDataCard] = useState([
    {
      id: 1,
      icon: <AiOutlineUsergroupAdd />,
      title: "Total Calon Anggota",
      color: "blue",
      total: 0,
    },
    {
      id: 2,
      icon: <FaMoneyBillTransfer />,
      title: "Sudah Bayar HTM",
      color: "red",
      total: 0,
    },
    {
      id: 3,
      icon: <AiOutlineMan />,
      title: "CA Laki-Laki",
      color: "green",
      total: 0,
    },
    {
      id: 4,
      icon: <AiOutlineWoman />,
      title: "CA Perempuan",
      color: "orange",
      total: 0,
    },
  ]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axiosInstance.get(`ca/1/100`, {
          headers: {
            Authorization: `Bearer ${atob(Cookies.get("userToken"))}`,
          },
        });
  
        setData(response.data.Data);
      } catch (error) {
        console.error(error);
      }
    };
  
    getData();
  }, []);
  
  useEffect(() => {
    const processData = () => {
      const dataStatusFee = data.filter(
        (member) => member.status_fee === 2
      ).length;
      const dataLaki = data.filter(
        (member) => member.jenis_kelamin.toLowerCase() === "laki-laki"
      ).length;
      const dataPerempuan = data.filter(
        (member) => member.jenis_kelamin.toLowerCase() === "perempuan"
      ).length;
  
      setDataCard((prevDataCard) =>
        prevDataCard.map((card) => {
          switch (card.id) {
            case 1:
              return { ...card, total: data.length };
            case 2:
              return { ...card, total: dataStatusFee };
            case 3:
              return { ...card, total: dataLaki };
            case 4:
              return { ...card, total: dataPerempuan };
            default:
              return card;
          }
        })
      );
    };
  
    // Pastikan data sudah diatur sebelum memproses
    if (data.length > 0) {
      processData();
    }
  }, [data]);
  
  return (
    <div className="p-4 min-h-[95vh] min-w-full shadow-xl rounded-lg">
      <h1 className="text-xl font-bold">Statistik Data Recruitment UKM IK</h1>
      <div className="flex justify-between gap-4">
        {dataCard.map(({ id, icon, title, color, total }) => {
          return (
            <Card className="mt-12 border w-1/4" key={id}>
              <CardHeader
                variant="gradient"
                color={color}
                className="mb-4 grid w-fit place-items-center"
              >
                <Typography variant="h3" className="p-4" color="white">
                  {icon}
                </Typography>
              </CardHeader>
              <CardBody className="flex flex-col items-end -mt-16">
                <Typography variant="small">
                  <small>{title}</small>
                </Typography>
                <Typography variant="h2" color="black">
                  {total}
                </Typography>
              </CardBody>
              <CardFooter className="pt-0 flex justify-end">
                <Link to="/dashboard/recruitment">
                  <Button variant="gradient" color={color} type="submit">
                    Lihat Semua
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
