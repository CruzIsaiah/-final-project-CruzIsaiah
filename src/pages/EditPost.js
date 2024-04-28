import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../config/client";

const EditPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState({
    id: null,
    title: "",
    body: "",
    datePosted: null,
  });

  // Fetch post data based on ID from Supabase
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select()
          .eq("id", id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setPost(data);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching post:", error.message);
      }
    };

    fetchPost();
  }, [id]); // Run effect whenever the ID parameter changes

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { error } = await supabase
        .from("posts")
        .update({
          title: post.title,
          body: post.body,
          datePosted: post.datePosted,
        })
        .eq("id", id);

      if (error) {
        throw error;
      }

      console.log("Post updated successfully!");
    } catch (error) {
      console.error("Error updating post:", error.message);
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      console.log("Post deleted successfully!");
      // Redirect to a different page after deletion (e.g., home page)
      window.location.replace("/");
    } catch (error) {
      console.error("Error deleting post:", error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label> <br />
        <input
          type="text"
          id="title"
          name="title"
          value={post.title}
          onChange={handleChange}
        />
        <br />
        <br />
        <label htmlFor="body">Body</label> <br />
        <textarea
          rows="15"
          cols="50"
          id="body"
          name="body"
          value={post.body}
          onChange={handleChange}
        ></textarea>
        <input type="submit" value="Submit" />
        <button className="deleteButton" onClick={handleDelete}>
          Delete
        </button>
      </form>
    </div>
  );
};

export default EditPost;
