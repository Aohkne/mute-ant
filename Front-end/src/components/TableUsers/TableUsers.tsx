"use client";

import React, { useState } from "react";
import styles from "./TableUsers.module.scss";
import classNames from "classnames/bind";
import Image from "next/image";
import Panel from "@/components/Panel/Panel";
import { UsersRound } from "lucide-react";

const cx = classNames.bind(styles);

interface User {
  id: number;
  image: string;
  fullname: string;
  dob: string;
  gender: string;
}

const data: User[] = [
  {
    id: 1,
    image: "",
    fullname: "Nguyễn Văn A",
    dob: "2004-02-02",
    gender: "Male",
  },
  {
    id: 2,
    image: "",
    fullname: "Trần Thị B",
    dob: "2005-03-03",
    gender: "Female",
  },
  {
    id: 3,
    image: "",
    fullname: "Trần Thị B",
    dob: "2005-03-03",
    gender: "Female",
  },
  {
    id: 4,
    image: "",
    fullname: "Trần Thị B",
    dob: "2005-03-03",
    gender: "Female",
  },
  {
    id: 5,
    image: "",
    fullname: "Trần Thị B",
    dob: "2005-03-03",
    gender: "Female",
  },
  {
    id: 6,
    image: "",
    fullname: "Trần Thị B",
    dob: "2005-03-03",
    gender: "Female",
  },
];

function TableUsers() {
  const [users] = useState<User[]>(data);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Search và Filter
  const filteredUsers = users.filter((user) => {
    const matchesGender = filterGender ? user.gender === filterGender : true;
    const matchesSearch = searchTerm
      ? user.fullname.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesGender && matchesSearch;
  });

  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / itemsPerPage);
  const displayedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <div className={cx("content")}>
        <Panel
          type="user"
          title="Users"
          icon={<UsersRound size={30} />}
          total={totalUsers}
        />
      </div>
      <div className={cx("wrapper")}>
        <div className={cx("header")}>
          <div className={cx("search")}>
            <input
              type="text"
              placeholder="Search by fullname"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
            >
              <option value="">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>

        <table className={cx("table-container")}>
          <thead>
            <tr>
              <th>#</th>
              <th>Avatar</th>
              <th>Fullname</th>
              <th>DOB</th>
              <th>Gender</th>
            </tr>
          </thead>
          <tbody>
            {displayedUsers.map((user, index) => (
              <tr key={user.id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>
                  <Image
                    src={user.image || "/images/img/default-user.png"}
                    alt={user.fullname}
                    width={50}
                    height={50}
                    className={cx("avatar")}
                  />
                </td>
                <td>{user.fullname}</td>
                <td>{user.dob}</td>
                <td>{user.gender}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Phân trang */}
        <div className={cx("pagination")}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export default TableUsers;
