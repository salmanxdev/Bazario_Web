import { useState } from "react";
import { Video, Users, MessageSquare, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../utils/toast";

const LivePage = () => {
  const navigate = useNavigate();
  const [isLive] = useState(true);
  const [viewers, setViewers] = useState(1234);
  const [liveComment, setLiveComment] = useState("");
  const [comments, setComments] = useState([
    { id: 1, user: "John", comment: "Amazing products!" },
    { id: 2, user: "Sarah", comment: "Great quality" },
    { id: 3, user: "Mike", comment: "Will buy soon!" },
  ]);

  const handleCommentSubmit = () => {
    if (liveComment.trim() === "") return;

    const newComment = {
      id: comments.length + 1,
      user: "You",
      comment: liveComment,
    };

    setComments([...comments, newComment]);
    setLiveComment("");
    showToast.success("Comment posted!");
  };

  const handleJoinLive = () => {
    setViewers(viewers + 1);
    showToast.success("Joined the live session!");
  };

  return (
    <div className="live-page">
      <div className="live-container">
        <div className="live-header">
          <button 
            className="back-btn"
            onClick={() => navigate("/home")}
          >
            <ArrowLeft size={20} />
          </button>
          <h1>
            <Video size={28} />
            Live Shopping
          </h1>
        </div>

        <div className="live-content">
          <div className="live-video-section">
            <div className={`video-placeholder ${isLive ? "live" : ""}`}>
              <div className="live-indicator">
                {isLive && <span className="live-dot"></span>}
                <span>{isLive ? "LIVE" : "OFFLINE"}</span>
              </div>
              <Video size={80} className="video-icon" />
              <p>{isLive ? "Live Shopping in Progress" : "Stream Offline"}</p>
              {isLive && (
                <button className="join-btn" onClick={handleJoinLive}>
                  <Users size={18} />
                  Join Live ({viewers} viewers)
                </button>
              )}
            </div>

            <div className="live-info">
              <div className="info-item">
                <Users size={20} />
                <span>{viewers} People Watching</span>
              </div>
              <div className="info-item">
                <MessageSquare size={20} />
                <span>{comments.length} Comments</span>
              </div>
            </div>
          </div>

          <div className="live-chat-section">
            <h3>Live Comments</h3>
            <div className="live-comments">
              {comments.map((comment) => (
                <div key={comment.id} className="live-comment">
                  <strong>{comment.user}:</strong>
                  <p>{comment.comment}</p>
                </div>
              ))}
            </div>

            <div className="live-comment-input">
              <input
                type="text"
                value={liveComment}
                onChange={(e) => setLiveComment(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleCommentSubmit()}
                placeholder="Add a comment..."
                className="comment-input"
              />
              <button 
                onClick={handleCommentSubmit}
                className="comment-btn"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivePage;
