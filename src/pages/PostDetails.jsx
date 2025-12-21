import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import CommentList from "../components/CommentList";
import CommentForm from "../components/CommentForm";
import Rating from "../components/Rating";

export default function PostDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [myRating, setMyRating] = useState(0);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    try {
      const res = await api.get(`/posts/${id}`);
      setPost(res.data);

      const cr = await api.get(`/posts/${id}/comments`);
      setComments(cr.data);

      const rr = await api.get(`/posts/${id}/my-rating`);
      setMyRating(rr.data.value ?? 0);
    } catch (e) {
      setError("Не удалось загрузить пост");
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const sendComment = async (text) => {
    try {
      await api.post(`/posts/${id}/comments`, { text });
      load();
    } catch (e) {
      alert("Не удалось отправить комментарий");
    }
  };

  const rate = async (value) => {
    try {
      await api.post(`/posts/${id}/rating`, { value });
      setMyRating(value);
      load();
    } catch (e) {
      alert("Не удалось поставить оценку");
    }
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!post) return <p>Loading...</p>;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h2>{post.title}</h2>
      <p style={{ opacity: 0.7 }}>author: {post.authorLogin}</p>
      <p>{post.text}</p>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <b>Your rating:</b>
        <Rating value={myRating} onRate={rate} />
        <span style={{ marginLeft: "auto", opacity: 0.7 }}>
          avg: {post.ratingAvg ?? 0}
        </span>
      </div>

      <h3>Comments</h3>
      <CommentForm onSend={sendComment} />
      <CommentList comments={comments} />
    </div>
  );
}
