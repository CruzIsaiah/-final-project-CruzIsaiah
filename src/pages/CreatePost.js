import React, { useState } from "react";
import { supabase } from "../config/client";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./CreatePost.css";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate(); // Initialize the navigate function

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const { data, error } = await supabase
        .from("posts")
        .insert([{ title, body, datePosted: new Date(), upvotes: 0 }]);

      if (error) {
        throw error;
      }

      console.log("Post added:", data);

      // Reset form fields after successful submission
      setTitle("");
      setBody("");

      // Redirect to the homepage after successful submission
      navigate("/"); // Adjust the path to your homepage route
    } catch (error) {
      console.error("Error adding post:", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label> <br />
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="titleInput"
          required
        />
        <br />
        <br />
        <label htmlFor="body">Body</label> <br />
        <textarea
          rows="5"
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        ></textarea>
        <br />
        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
