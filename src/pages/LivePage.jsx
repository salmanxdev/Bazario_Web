import { useState, useRef, useEffect } from "react";
import { Video, Users, MessageSquare, ArrowLeft, Radio, VideoOff, MicOff, Mic } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const AGORA_APP_ID = "5492309418244c9a873bb0a2f417dbfd";

const LivePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLive, setIsLive] = useState(false);
  const [viewers, setViewers] = useState(0);
  const [liveComment, setLiveComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const isSeller = user?.role === "seller";

  const startLive = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true, audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsLive(true);
      setViewers(1);
      toast.success("You are now LIVE!");
      // Simulate viewers joining
      const interval = setInterval(() => {
        setViewers((v) => v + Math.floor(Math.random() * 3));
      }, 5000);
      return () => clearInterval(interval);
    } catch (error) {
      console.error("Camera error:", error);
      toast.error("Could not access camera/microphone");
    }
  };

  const stopLive = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setIsLive(false);
    setViewers(0);
    toast.info("Live stream ended");
  };

  const toggleMute = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleCamera = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setCameraOn(videoTrack.enabled);
      }
    }
  };

  const handleCommentSubmit = () => {
    if (!liveComment.trim()) return;
    setComments([...comments, {
      id: Date.now(),
      user: user?.firstName || "You",
      comment: liveComment,
    }]);
    setLiveComment("");
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  return (
    <div className="live-page">
      <div className="live-container">
        <div className="live-header">
          <button className="back-btn" onClick={() => { stopLive(); navigate(-1); }}>
            <ArrowLeft size={20} />
          </button>
          <h1><Video size={28} /> Live Shopping</h1>
        </div>

        <div className="live-content">
          <div className="live-video-section">
            <div className={`video-placeholder ${isLive ? "live" : ""}`}>
              {isLive && (
                <div className="live-indicator">
                  <span className="live-dot" />
                  <span>LIVE</span>
                  <span className="viewer-count"><Users size={14} /> {viewers}</span>
                </div>
              )}

              {isLive ? (
                <video ref={videoRef} autoPlay muted playsInline className="live-video-feed" />
              ) : (
                <div className="live-placeholder-content">
                  <Radio size={60} className="video-icon" />
                  <p>{isSeller ? "Ready to go live?" : "No live streams right now"}</p>
                </div>
              )}

              {/* CONTROLS */}
              {isSeller && (
                <div className="live-controls">
                  {isLive ? (
                    <>
                      <button className="live-control-btn" onClick={toggleMute} title={isMuted ? "Unmute" : "Mute"}>
                        {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                      </button>
                      <button className="live-control-btn danger" onClick={stopLive}>
                        End Live
                      </button>
                      <button className="live-control-btn" onClick={toggleCamera} title={cameraOn ? "Camera Off" : "Camera On"}>
                        {cameraOn ? <Video size={20} /> : <VideoOff size={20} />}
                      </button>
                    </>
                  ) : (
                    <button className="go-live-btn" onClick={startLive}>
                      <Radio size={20} /> Go Live
                    </button>
                  )}
                </div>
              )}

              {!isSeller && !isLive && (
                <button className="join-btn" onClick={() => toast.info("No live streams available right now")}>
                  <Users size={18} /> Check for Live Streams
                </button>
              )}
            </div>

            <div className="live-info">
              <div className="info-item"><Users size={20} /><span>{viewers} Watching</span></div>
              <div className="info-item"><MessageSquare size={20} /><span>{comments.length} Comments</span></div>
            </div>
          </div>

          <div className="live-chat-section">
            <h3>Live Chat</h3>
            <div className="live-comments">
              {comments.length === 0 && <p className="no-comments">No comments yet</p>}
              {comments.map((c) => (
                <div key={c.id} className="live-comment">
                  <strong>{c.user}:</strong>
                  <p>{c.comment}</p>
                </div>
              ))}
            </div>
            <div className="live-comment-input">
              <input
                type="text"
                value={liveComment}
                onChange={(e) => setLiveComment(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit()}
                placeholder="Say something..."
                className="comment-input"
              />
              <button onClick={handleCommentSubmit} className="comment-btn">Post</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivePage;
