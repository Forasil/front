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
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!id) {
      setError("Некорректный id поста");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await api.get(`/posts/${id}`);
      const postData = res.data?.data ?? res.data;
      setPost(postData);

      try {
        const cr = await api.get(`/posts/${id}/comments`);
        const raw = cr.data?.data ?? cr.data;
        const items = raw?.items ?? raw ?? [];
        setComments(Array.isArray(items) ? items : []);
      } catch (e) {
        console.warn("Ошибка загрузки комментариев", e);
      }

      try {
        const rr = await api.get(`/posts/${id}/my-rating`);
        const ratingValue =
          rr.data?.data?.value ?? rr.data?.value ?? rr.data ?? 0;
        setMyRating(Number(ratingValue) || 0);
      } catch (e) {
        console.warn("Ошибка загрузки рейтинга", e);
      }
    } catch (e) {
      console.error(e);
      setError("Не удалось загрузить пост");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const sendComment = async (text) => {
    try {
      await api.post(`/posts/${id}/comments`, { text });
      await load();
    } catch (e) {
      console.error(e);
      alert("Не удалось отправить комментарий");
    }
  };

  const rate = async (value) => {
    try {
      await api.post(`/posts/${id}/rating`, { value });
      setMyRating(value);
      await load();
    } catch (e) {
      console.error(e);
      alert("Не удалось поставить оценку");
    }
  };

  if (loading && !post) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!post) return null;

  return (
    <div style={{ display: "grid", gap: 16 }}>
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
