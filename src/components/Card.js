import React, { useState, useEffect } from "react";
import "./Card.css";
import more from "./more.png";
import { Link } from "react-router-dom";
import { supabase } from "../config/client"; // Import supabase

const Card = (props) => {
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [timestamp, setTimestamp] = useState("");

  // Fetch post data and comments count based on ID from Supabase
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        // Fetch post data
        const { data, error } = await supabase
          .from("posts")
          .select("upvotes, datePosted")
          .eq("id", props.id)
          .single();
        if (error) {
          console.error("Error fetching post data:", error);
        } else {
          setUpvoteCount(data.upvotes || 0);
          setTimestamp(data.datePosted || "");
        }
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
    };

    fetchPostData();
  }, [props.id]); // Run effect whenever the ID parameter changes

  // Function to format the timestamp into a human-readable date and time
  const formattedDate = (timestamp) => {
    if (timestamp) {
      const postDate = new Date(timestamp);
      const formatted = postDate.toLocaleString('en-US', { 
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });
      return formatted;
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
      <p className="datePosted">{formattedDate(timestamp)}</p>
      <p className="comments">{commentCount} Comments</p>
      <p className="upVotes">{upvoteCount} Upvotes</p>
    </div>
  );
};

export default Card;
