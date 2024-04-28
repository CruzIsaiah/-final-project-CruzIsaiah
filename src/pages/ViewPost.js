import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../config/client";

const ViewPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [upvotes, setUpvotes] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  // Fetch post data and upvotes count based on ID from Supabase
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("id", id)
          .single();
        if (error) {
          console.error("Error fetching post data:", error);
        } else {
          setPost(data);
          setUpvotes(data.upvotes); // Set upvotes count from database
        }
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
    };

    fetchPostData();
  }, [id]); // Run effect whenever the ID parameter changes

  // Fetch comments associated with the post from Supabase
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data, error } = await supabase
          .from("comments")
          .select("*")
          .eq("post_id", id)
          .order("timestamp", { ascending: false }); // Sort comments by timestamp in descending order
        if (error) {
          console.error("Error fetching comments:", error);
        } else {
          setComments(data);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
  
    fetchComments();
  }, [id]);
  

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    if (!comment.trim()) return;
  
    try {
      // Add comment to Supabase under the specific post
      const { error } = await supabase.from("comments").insert([
        { post_id: id, comment: comment, timestamp: new Date() },
      ]);
      if (error) {
        console.error("Error adding comment:", error);
      } else {
        // Clear comment input after successful submission
        setComment("");
  
        // Fetch the newly added comment and update the comments state
        const { data: newCommentData, error: newCommentError } = await supabase
          .from("comments")
          .select("*")
          .eq("post_id", id)
          .order("timestamp", { ascending: false }); // Sort comments by timestamp in descending order
        if (newCommentError) {
          console.error("Error fetching new comment:", newCommentError);
        } else {
          if (newCommentData && newCommentData.length > 0) {
            const newComment = newCommentData[0]; // Get the first comment (newest one)
            setComments((prevComments) => [newComment, ...prevComments]); // Update comments state with the new comment
          }
        }
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };
  
  
  const updateUpvotes = async () => {
    try {
      // Update upvotes count in Supabase
      const { error } = await supabase
        .from("posts")
        .update({ upvotes: upvotes + 1 })
        .eq("id", id);
      if (error) {
        console.error("Error updating upvotes count:", error);
      } else {
        // Update the upvotes count in the UI
        setUpvotes((count) => count + 1);
      }
    } catch (error) {
      console.error("Error updating upvotes count:", error);
      // Handle error, e.g., display error message to the user
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="CommentCard">
      <h2 className="title">{post.title}</h2>
      <p className="description">{post.body}</p>
      <div className="buttonContainer" style={{ textAlign: "left" }}>
        {/* Align buttons to the left */}
        <button className="upvoteButton" onClick={updateUpvotes}>
          Like: {upvotes}
        </button>
      </div>

      {/* Comment section */}
      <div className="commentSection">
        <h3>Comments</h3>
        <form onSubmit={handleCommentSubmit}>
          <textarea
            rows="3"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            required
          ></textarea>
          <button type="submit">Submit</button>
        </form>
        <div className="commentsList">
          {comments.map((comment) => (
            <div key={comment.id} className="comment" style={{ borderTop: "1px solid white", borderBottom: "1px solid white" }}>
              <p>{comment.comment}</p>
              <p>{new Date(comment.timestamp).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewPost;
