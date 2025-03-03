"use client";

import React, { useState, useEffect } from "react";

import Panel from "@/components/Panel/Panel";
import Image from "next/image";
import { LibraryBig } from "lucide-react";
import { toast } from "react-toastify";
import { Eye, Trash2 } from "lucide-react";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";

import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchBlogs } from "@/redux/features/blogs/blogSlice";

import { postNewBlog, resetPostState } from "@/redux/features/blogs";
import { editBlog, resetEditState } from "@/redux/features/blogs/editSlice";

import {
  deleteBlog,
  resetDeleteState,
} from "@/redux/features/blogs/deleteSlice";

import styles from "./TableBlogs.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

interface Blog {
  id?: number;
  author: string;
  title: string;
  content?: string;
  description: string;
  status: string;
  thumbnail: string;
  images: string[];
  created_date: string;
}

function TableBlogs() {
  const [filterStatus, setFilterStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [modalOpen, setModalOpen] = useState(false);

  const [editingBlog, setEditingBlog] = useState<Blog>({
    id: undefined,
    author: "",
    title: "",
    content: "",
    description: "",
    status: "draft",
    thumbnail: "",
    images: [],
    created_date: new Date().toISOString(),
  });

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

  useEffect(() => {
    if (editor && editingBlog.content) {
      editor.commands.setContent(editingBlog.content);
    }
  }, [editingBlog.content, editor]);

  // GET Blogs
  const dispatch = useDispatch<AppDispatch>();
  const { blogs, loading, error, pagination } = useSelector(
    (state: RootState) => state.blogs
  );

  useEffect(() => {
    dispatch(fetchBlogs(currentPage - 1));
  }, [dispatch, currentPage]);

  // POST Blog
  const { success } = useSelector((state: RootState) => state.postBlogs);

  // Edit Blog
  const { success: editSuccess } = useSelector(
    (state: RootState) => state.editBlog
  );

  // Delete Blog
  const { success: deleteSuccess } = useSelector(
    (state: RootState) => state.deleteBlog
  );

  // Dispatch Edit & Create Blog
  useEffect(() => {
    if (success || editSuccess) {
      toast.success(
        success ? "New blog posted successfully!" : "Blog edited successfully!"
      );
      dispatch(resetPostState());
      dispatch(resetEditState());
      setModalOpen(false);
      setEditingBlog({
        author: "",
        title: "",
        content: "",
        description: "",
        status: "draft",
        thumbnail: "",
        images: [],
        created_date: new Date().toISOString(),
      });
      dispatch(fetchBlogs(pagination?.page));
    }
  }, [success, editSuccess, dispatch, pagination?.page]);

  // Dispatch Delete Blog
  useEffect(() => {
    if (deleteSuccess) {
      toast.success("Blog deleted successfully!");
      dispatch(fetchBlogs(pagination?.page));
      dispatch(resetDeleteState());
    }
  }, [deleteSuccess, dispatch, pagination?.page]);

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      dispatch(deleteBlog(id));
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // Filter: status và search: title, author
  const filteredBlogs = blogs.filter((blog) => {
    const matchesStatus =
      filterStatus !== ""
        ? blog.status?.toLowerCase() === filterStatus.toLowerCase()
        : true;

    const matchesSearch = searchTerm
      ? blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    return matchesStatus && matchesSearch;
  });

  const displayedBlogs = filteredBlogs;

  //Open Model
  const handleEdit = (blog: any) => {
    const blogWithDefaults: Blog = {
      ...blog,
      description: blog.description || "", // Ensure description is a string
      content: blog.content || "",
      images: blog.images || [],
    };

    setEditingBlog(blogWithDefaults);
    setModalOpen(true);
  };

  // Open Modal for add new
  const handleAddNew = () => {
    setEditingBlog({
      title: "",
      author: "",
      description: "",
      content: "",
      thumbnail: "",
      images: [],
      status: "draft",
      created_date: new Date().toISOString(),
    });
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingBlog({
      id: NaN,
      title: "",
      author: "",
      description: "",
      content: "",
      thumbnail: "",
      images: [],
      status: "draft",
      created_date: new Date().toISOString(),
    });
    if (editor) editor.commands.setContent("");
  };

  const handleModalSave = () => {
    if (editingBlog) {
      const updatedContent = editor?.getHTML() || "";
      const updatedBlog = { ...editingBlog, content: updatedContent || "" };

      if (updatedBlog.id) {
        // Update
        dispatch(editBlog(updatedBlog));
      } else {
        // Create
        dispatch(postNewBlog(updatedBlog));
      }

      handleModalClose();
    }
  };

  // Xử lý thay đổi file cho thumbnail (1 file) với preview
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      URL.createObjectURL(file);
      const url = `/images/blog/${file.name}`;

      setEditingBlog((prev) => {
        if (prev.thumbnail) {
          URL.revokeObjectURL(prev.thumbnail);
        }
        return { ...prev, thumbnail: url };
      });

      console.log(editingBlog);
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map(
        (file) =>
          // URL.createObjectURL(file)
          `/images/blog/${file.name}`
      );
      setEditingBlog((prev) => {
        prev.images.forEach((url) => URL.revokeObjectURL(url));
        return { ...prev, images: filesArray };
      });
    }
  };

  return (
    <>
      <div className={cx("content")}>
        <Panel
          type="blog"
          title="Blogs"
          icon={<LibraryBig size={30} />}
          total={pagination.totalPages}
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
                <td>{blog.status?.toUpperCase()}</td>
                <td>
                  <button onClick={() => handleEdit(blog)}>
                    <Eye size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(blog.id)}
                    style={{ marginLeft: "10px", color: "red" }}
                  >
                    <Trash2 size={20} />
                  </button>
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
            Page {pagination.page + 1} of {pagination.totalElements}
          </span>
          <button
            disabled={pagination.page + 1 === pagination.totalElements}
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
