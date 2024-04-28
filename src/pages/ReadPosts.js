import React, { useState, useEffect } from "react";
import { supabase } from "../config/client";
import Card from "../components/Card";

const ReadPosts = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date"); // Default sorting option

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let { data, error } = await supabase
          .from("posts")
          .select("*")
          .order(sortBy === "date" ? "datePosted" : "upvotes", { ascending: sortBy === "date" }); // Sort by datePosted or upvotes based on sortBy value

        // Log the fetched data to check if timestamp is retrieved
        console.log("Fetched data:", data);

        // Apply search filter if searchTerm exists
        if (searchTerm) {
          data = data.filter((post) =>
            post.title.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        if (error) {
          throw error;
        }

        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error.message);
      }
    };

    fetchPosts();
  }, [searchTerm, sortBy]); // Update useEffect dependencies to include sortBy

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (option) => {
    setSortBy(option);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search by title..."
        value={searchTerm}
        onChange={handleSearchChange}
        style={{
          width: '600px',
          height: '20px',
          padding: '8px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          outline: 'none',
          marginBottom: '20px' // Adjusted margin bottom
        }}
      />

      <div>
        <button onClick={() => handleSortChange('date')}>Sort by Date</button>
        <button onClick={() => handleSortChange('likes')}>Sort by Likes</button>
      </div>

      {posts.map((post) => (
        <Card
          key={post.id}
          id={post.id}
          title={post.title}
          author={post.author}
          description={post.body}
          date={post.datePosted}
          upvoteCount={post.upvotes}
          commentCount={post.comments ? post.comments.length : 0}
        />
      ))}
    </div>
  );
};

export default ReadPosts;
