import React, { useState, useEffect } from "react";
import { supabase } from "../config/client";
import Card from "../components/Card";

const ReadPosts = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let { data, error } = await supabase
          .from("posts")
          .select("*")
          .order("datePosted", { ascending: false }); // Sort by datePosted in descending order

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
  }, [searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
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
          marginBottom: '50px' // Add margin bottom to create space
        }}
      />

      {posts.map((post) => (
        <Card
          key={post.id}
          id={post.id}
          title={post.title}
          author={post.author} // Assuming 'author' field exists in your Supabase table
          description={post.body} // Assuming 'body' field contains description in your Supabase table
          date={post.datePosted}
          upvoteCount={post.upvotes}
          commentCount={post.comments ? post.comments.length : 0} // Check if comments array exists before accessing length property
        />
      ))}
    </div>
  );
};

export default ReadPosts;
