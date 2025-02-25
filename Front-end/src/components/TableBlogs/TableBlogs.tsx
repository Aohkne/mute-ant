"use client";

import React, { useState, useEffect } from "react";

import Panel from "@/components/Panel/Panel";
import Image from "next/image";
import { LibraryBig } from "lucide-react";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";

import styles from "./TableBlogs.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

interface Blog {
  id: number;
  title: string;
  author: string;
  description?: string;
  content?: string;
  thumbnail?: string;
  images?: string[];
  status?: string;
}

const initialData: Blog[] = [
  {
    id: 1,
    title: "Blog 1",
    author: "Author 1",
    status: "published",
    description: "Mô tả ngắn cho Blog 1",
    content: "<p>Nội dung blog 1</p>",
    thumbnail: "",
    images: [],
  },
  {
    id: 2,
    title: "Blog 2",
    author: "Author 2",
    status: "draft",
    description: "Mô tả ngắn cho Blog 2",
    content: "<p>Nội dung blog 2</p>",
    thumbnail: "",
    images: [],
  },
  {
    id: 3,
    title: "Blog 2",
    author: "Author 2",
    status: "draft",
    description: "Mô tả ngắn cho Blog 2",
    content: "<p>Nội dung blog 2</p>",
    thumbnail: "",
    images: [],
  },
  {
    id: 4,
    title: "Blog 2",
    author: "Author 2",
    status: "draft",
    description: "Mô tả ngắn cho Blog 2",
    content: "<p>Nội dung blog 2</p>",
    thumbnail: "",
    images: [],
  },
  {
    id: 5,
    title: "Blog 2",
    author: "Author 2",
    status: "draft",
    description: "Mô tả ngắn cho Blog 2",
    content: "<p>Nội dung blog 2</p>",
    thumbnail: "",
    images: [],
  },
  {
    id: 6,
    title: "Blog 2",
    author: "Author 2",
    status: "draft",
    description: "Mô tả ngắn cho Blog 2",
    content: "<p>Nội dung blog 2</p>",
    thumbnail: "",
    images: [],
  },
  {
    id: 7,
    title: "Blog 2",
    author: "Author 2",
    status: "draft",
    description: "Mô tả ngắn cho Blog 2",
    content: "<p>Nội dung blog 2</p>",
    thumbnail: "",
    images: [],
  },
  {
    id: 8,
    title: "Blog 2",
    author: "Author 2",
    status: "draft",
    description: "Mô tả ngắn cho Blog 2",
    content: "<p>Nội dung blog 2</p>",
    thumbnail: "",
    images: [],
  },
  {
    id: 9,
    title: "Blog 2",
    author: "Author 2",
    status: "draft",
    description: "Mô tả ngắn cho Blog 2",
    content: "<p>Nội dung blog 2</p>",
    thumbnail: "",
    images: [],
  },
  {
    id: 10,
    title: "Blog 2",
    author: "Author 2",
    status: "draft",
    description: "Mô tả ngắn cho Blog 2",
    content: "<p>Nội dung blog 2</p>",
    thumbnail: "",
    images: [],
  },
  {
    id: 11,
    title: "Blog 2",
    author: "Author 2",
    status: "draft",
    description: "Mô tả ngắn cho Blog 2",
    content: "<p>Nội dung blog 2</p>",
    thumbnail: "",
    images: [],
  },
];

function TableBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>(initialData);
  const [filterStatus, setFilterStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

  // Khởi tạo editor cho trường content sử dụng tiptap
  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph", "bulletList", "orderedList"],
        alignments: ["left", "center", "right", "justify"],
      }),
    ],
    content: editingBlog?.content || "",
  });

  // Khi blog được chọn để chỉnh sửa, cập nhật lại nội dung cho editor
  useEffect(() => {
    if (editor && editingBlog) {
      editor.commands.setContent(editingBlog.content || "");
    }
  }, [editingBlog, editor]);

  // Lọc blog theo trạng thái và search theo title, author
  const filteredBlogs = blogs.filter((blog) => {
    const matchesStatus = filterStatus ? blog.status === filterStatus : true;
    const matchesSearch = searchTerm
      ? blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesStatus && matchesSearch;
  });

  const totalBlogs = filteredBlogs.length;
  const totalPages = Math.ceil(totalBlogs / itemsPerPage);
  const displayedBlogs = filteredBlogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Mở modal để chỉnh sửa blog hiện có
  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setModalOpen(true);
  };

  // Mở modal để thêm mới blog
  const handleAddNew = () => {
    setEditingBlog({
      id: Date.now(),
      title: "",
      author: "",
      description: "",
      content: "",
      thumbnail: "",
      images: [],
      status: "draft",
    });
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingBlog(null);
    if (editor) editor.commands.setContent("");
  };

  // Khi lưu, cập nhật hoặc thêm blog mới vào mảng blogs
  const handleModalSave = () => {
    if (editingBlog) {
      const updatedContent = editor?.getHTML() || "";
      console.log("Content sau khi edit:", updatedContent);
      const updatedBlog = { ...editingBlog, content: updatedContent };

      setBlogs((prevBlogs) => {
        const index = prevBlogs.findIndex((blog) => blog.id === updatedBlog.id);
        if (index !== -1) {
          // Cập nhật blog hiện có
          const newBlogs = [...prevBlogs];
          newBlogs[index] = updatedBlog;
          return newBlogs;
        } else {
          // Thêm mới blog vào đầu danh sách
          return [updatedBlog, ...prevBlogs];
        }
      });
      handleModalClose();
    }
  };

  // Xử lý thay đổi file cho thumbnail (1 file) với preview
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setEditingBlog((prev) => (prev ? { ...prev, thumbnail: url } : prev));
    }
  };

  // Xử lý thay đổi file cho images (nhiều file) với preview
  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file)
      );
      setEditingBlog((prev) => (prev ? { ...prev, images: filesArray } : prev));
    }
  };

  return (
    <>
      <div className={cx("content")}>
        <Panel
          type="blog"
          title="Blogs"
          icon={<LibraryBig size={30} />}
          total={totalBlogs}
        />
      </div>
      <div className={cx("wrapper")}>
        <div className={cx("header")}>
          <button className={cx("new-btn")} onClick={handleAddNew}>
            New Blog
          </button>

          <div className={cx("search")}>
            <input
              type="text"
              placeholder="Search by title or author"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        <table className={cx("blogsTable")}>
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Author</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedBlogs.map((blog, index) => (
              <tr key={blog.id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{blog.title}</td>
                <td>{blog.author}</td>
                <td>{blog.status}</td>
                <td>
                  <button onClick={() => handleEdit(blog)}>View</button>
                </td>
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

        {/* Pop up */}
        {modalOpen && editingBlog && (
          <div className={cx("modalOverlay")}>
            <div className={cx("modalContent")}>
              <h2>{editingBlog.id ? "EDIT BLOG" : "NEW BLOG"}</h2>

              <div className={cx("formGroup")}>
                <label>Title</label>
                <input
                  type="text"
                  value={editingBlog.title}
                  onChange={(e) =>
                    setEditingBlog({ ...editingBlog, title: e.target.value })
                  }
                />
              </div>

              <div className={cx("formGroup")}>
                <label>Author</label>
                <input
                  type="text"
                  value={editingBlog.author}
                  onChange={(e) =>
                    setEditingBlog({ ...editingBlog, author: e.target.value })
                  }
                />
              </div>

              <div className={cx("formGroup")}>
                <label>Description</label>
                <textarea
                  value={editingBlog.description}
                  onChange={(e) =>
                    setEditingBlog({
                      ...editingBlog,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className={cx("formGroup")}>
                <label>Content</label>

                <div className={cx("toolbar")}>
                  <button
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={editor?.isActive("bold") ? cx("active") : ""}
                  >
                    B
                  </button>
                  <button
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={editor?.isActive("italic") ? cx("active") : ""}
                  >
                    I
                  </button>
                  <button
                    onClick={() =>
                      editor?.chain().focus().toggleUnderline().run()
                    }
                    className={
                      editor?.isActive("underline") ? cx("active") : ""
                    }
                  >
                    U
                  </button>

                  <button
                    onClick={() =>
                      editor?.chain().focus().setTextAlign("left").run()
                    }
                    className={
                      editor?.isActive({ textAlign: "left" })
                        ? cx("active")
                        : ""
                    }
                  >
                    Left
                  </button>

                  <button
                    onClick={() =>
                      editor?.chain().focus().setTextAlign("center").run()
                    }
                    className={
                      editor?.isActive({ textAlign: "center" })
                        ? cx("active")
                        : ""
                    }
                  >
                    Center
                  </button>

                  <button
                    onClick={() =>
                      editor?.chain().focus().setTextAlign("right").run()
                    }
                    className={
                      editor?.isActive({ textAlign: "right" })
                        ? cx("active")
                        : ""
                    }
                  >
                    Right
                  </button>

                  <button
                    onClick={() =>
                      editor?.chain().focus().setTextAlign("justify").run()
                    }
                    className={
                      editor?.isActive({ textAlign: "justify" })
                        ? cx("active")
                        : ""
                    }
                  >
                    Justify
                  </button>

                  <div className={cx("editor-container")}>
                    <EditorContent
                      editor={editor}
                      className={cx("editor-content")}
                    />
                  </div>
                </div>
              </div>

              <div className={cx("image-container")}>
                <div className={cx("imageGroup")}>
                  <label>Thumbnail (1 file)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                  />
                  {editingBlog.thumbnail && (
                    <Image
                      src={editingBlog.thumbnail}
                      alt="Thumbnail Preview"
                      className={cx("previewImage")}
                      width={500}
                      height={200}
                    />
                  )}
                </div>

                <div className={cx("imageGroup")}>
                  <label>Images (nhiều file)</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImagesChange}
                  />
                  <div className={cx("imagesPreview")}>
                    {editingBlog.images &&
                      editingBlog.images.map((img, idx) => (
                        <Image
                          key={idx}
                          src={img}
                          alt={`Preview ${idx}`}
                          className={cx("previewImage")}
                          width={500}
                          height={200}
                        />
                      ))}
                  </div>
                </div>
              </div>

              <div className={cx("formGroup")}>
                <label>Status</label>
                <select
                  value={editingBlog.status}
                  onChange={(e) =>
                    setEditingBlog({ ...editingBlog, status: e.target.value })
                  }
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div className={cx("modalActions")}>
                <button onClick={handleModalSave}>Save</button>
                <button onClick={handleModalClose}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default TableBlogs;
