import React, { useState, useEffect } from "react";
import "./Card.css";
import more from "./more.png";
import { Link } from "react-router-dom";
import { supabase } from "../config/client"; // Import supabase

const Card = (props) => {
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);

  // Fetch post data and comments count based on ID from Supabase
  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        // Fetch post data
        const { data: postData, error: postError } = await supabase
          .from("posts")
          .select("upvotes")
          .eq("id", props.id)
          .single();
        if (postError) {
          throw postError;
        }
        setUpvoteCount(postData.upvotes || 0);

        // Fetch comments associated with the post
        const { data: commentsData, error: commentsError } = await supabase
          .from("comments")
          .select()
          .eq("post_id", props.id);
        if (commentsError) {
          throw commentsError;
        }
        setCommentCount(commentsData.length || 0); // Set comment count
      } catch (error) {
        console.error("Error fetching post and comments:", error);
      }
    };

    fetchPostAndComments();
  }, [props.id]); // Run effect whenever the ID parameter changes

  // Function to format the timestamp into a human-readable date and time
  const formattedDate = (timestamp) => {
    if (timestamp && timestamp.seconds) {
      const postDate = new Date(timestamp.seconds * 1000);
      const hours = postDate.getHours().toString().padStart(2, '0');
      const minutes = postDate.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }
    return "";
  };

  return (
    <div className="Card">
      <Link to={"more/" + props.id}>
        <img className="moreButton" alt="edit button" src={more} />
      </Link>
      <Link to={`viewPost/${props.id}`} style={{ textDecoration: 'none' }}>
        <h2 className="title">{props.title}</h2>
      </Link>
      <p className="datePosted">{props.timestamp ? formattedDate(props.timestamp) : ""}</p>
      <p className="comments">{commentCount} Comments</p>
      <p className="upVotes">{upvoteCount} Upvotes</p>
    </div>
  );
};

export default Card;
