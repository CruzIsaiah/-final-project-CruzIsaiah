import React, { useState, useEffect } from "react";
import "./Card.css";
import { Link } from "react-router-dom";
import { supabase } from "../config/client";
import more from "./more.png";

const Card = (props) => {
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [timestamp, setTimestamp] = useState("");

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("upvotes, datePosted")
          .eq("id", props.id)
          .order("datePosted", { ascending: false })
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
  }, [props.id]);

  const formattedDate = (timestamp) => {
    if (timestamp) {
      const postDate = new Date(timestamp);
      const formatted = postDate.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
      return formatted;
    }
    return "";
  };

  return (
    <div className="Card">
      {/* Link to the edit post page */}
      <Link to={`/edit/${props.id}`}>
        {/* Image for editing */}
        <img className="moreButton" alt="edit button" src={more} />
      </Link>
      {/* Link to view post */}
      <Link to={`viewPost/${props.id}`} style={{ textDecoration: "none" }}>
        <h2 className="title">{props.title}</h2>
      </Link>
      {/* Date posted */}
      <p className="datePosted">{formattedDate(timestamp)}</p>
      {/* Comment count */}
      <p className="comments">{commentCount} Comments</p>
      {/* Upvote count */}
      <p className="upVotes">{upvoteCount} Upvotes</p>
    </div>
  );
};

export default Card;
