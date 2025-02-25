"use client";

import React, { useEffect, useState } from "react";
import styles from "./TableUsers.module.scss";
import classNames from "classnames/bind";
import Image from "next/image";
import Panel from "@/components/Panel/Panel";
import { UsersRound } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { fetchUsers } from "@/redux/features/accounts";

const cx = classNames.bind(styles);

function TableUsers() {
  const dispatch = useAppDispatch();
  const { users, totalPages, totalElements, loading } = useAppSelector(
    (state) => state.accounts
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(
      fetchUsers({
        page: currentPage,
        size: itemsPerPage,
        sort: ["id,asc"],
        gender: filterGender.toLowerCase(),
        searchTerm: searchTerm,
      })
    );
  }, [dispatch, currentPage, itemsPerPage, filterGender, searchTerm]);

  return (
    <>
      <div className={cx("content")}>
        <Panel
          type="user"
          title="Users"
          icon={<UsersRound size={30} />}
          total={totalPages}
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
            {loading ? (
              <tr>
                <td colSpan={5}>Loading...</td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={user.id}>
                  <td>{currentPage * itemsPerPage + index + 1}</td>
                  <td>
                    <Image
                      src={user.image || "/images/img/default-user.png"}
                      alt={user.fullName}
                      width={50}
                      height={50}
                      className={cx("avatar")}
                    />
                  </td>
                  <td>{user.fullName}</td>
                  <td>{user.birthdate}</td>
                  <td>{user.gender}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Phân trang */}
        <div className={cx("pagination")}>
          <button
            disabled={currentPage === 0}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Prev
          </button>
          <span>
            Page {currentPage + 1} of {totalElements}
          </span>
          <button
            disabled={currentPage + 1 === totalElements}
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
