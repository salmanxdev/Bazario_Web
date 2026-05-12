import { useState, useRef, useEffect } from "react";
import { Video, Users, MessageSquare, ArrowLeft, Radio, RefreshCw, Loader2, Mic, MicOff, Video as VideoIcon, VideoOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { db } from "../firebase";
import { collection, doc, setDoc, deleteDoc, onSnapshot, query, where, serverTimestamp } from "firebase/firestore";
import AgoraRTC from "agora-rtc-sdk-ng";

const AGORA_APP_ID = "5492309418244c9a873bb0a2f417dbfd";

const LivePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isLive, setIsLive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [viewers, setViewers] = useState(0);
  const [liveComment, setLiveComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);

  const [activeStreams, setActiveStreams] = useState([]);
  const [watchingStream, setWatchingStream] = useState(null);

  // Agora Refs
  const clientRef = useRef(null);
  const localTracksRef = useRef({ videoTrack: null, audioTrack: null });
  const videoContainerRef = useRef(null);

  const isSeller = user?.role === "seller";
  const currentUserId = user?.uid;

  // 1. Initialize Agora Client on mount
  useEffect(() => {
    clientRef.current = AgoraRTC.createClient({ mode: "live", codec: "vp8" });

    console.log("LivePage: Agora Client Initialized");

    return () => {
      if (clientRef.current) {
        clientRef.current.leave().catch(console.error);
      }
      cleanupTracks();
    };
  }, []);

  const cleanupTracks = () => {
    if (localTracksRef.current.videoTrack) {
      localTracksRef.current.videoTrack.stop();
      localTracksRef.current.videoTrack.close();
    }
    if (localTracksRef.current.audioTrack) {
      localTracksRef.current.audioTrack.stop();
      localTracksRef.current.audioTrack.close();
    }
    localTracksRef.current = { videoTrack: null, audioTrack: null };
  };

  // 2. Listen for active live streams (Firestore)
  useEffect(() => {
    console.log("LivePage: Starting stream listener...");
    const streamsRef = collection(db, "live_streams");
    const q = query(streamsRef, where("status", "==", "live"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const streams = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("LivePage: Active streams detected:", streams);
      setActiveStreams(streams);
    }, (error) => {
      console.error("LivePage: Firestore error:", error);
      toast.error("Error loading live streams");
    });

    return () => unsubscribe();
  }, []);

  // 3. Play Local/Remote Video when isLive changes
  useEffect(() => {
    if (isLive && videoContainerRef.current) {
      if (isSeller && localTracksRef.current.videoTrack) {
        console.log("LivePage: Playing local video track");
        localTracksRef.current.videoTrack.play(videoContainerRef.current);
      } else if (watchingStream) {
        // Agora event handles playing remote tracks, but we ensure the container exists
        console.log("LivePage: Video container ready for remote stream");
      }
    }
  }, [isLive, isSeller, watchingStream]);

  const startLive = async () => {
    if (!user?.uid) {
      toast.error("Please login to go live");
      return;
    }

    setIsConnecting(true);
    try {
      const client = clientRef.current;
      await client.setClientRole("host");

      // Create tracks
      console.log("LivePage: Requesting Camera/Mic...");
      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
      localTracksRef.current = { videoTrack, audioTrack };

      // Join Channel
      console.log("LivePage: Joining Agora channel:", user.uid);
      await client.join(AGORA_APP_ID, user.uid, null, user.uid);

      // Publish
      console.log("LivePage: Publishing tracks...");
      await client.publish([audioTrack, videoTrack]);

      // Update Firestore
      console.log("LivePage: Updating Firestore live status...");
      await setDoc(doc(db, "live_streams", user.uid), {
        sellerId: user.uid,
        sellerName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Seller",
        status: "live",
        channelName: user.uid,
        startTime: serverTimestamp(),
        viewers: 1
      });

      setIsLive(true);
      toast.success("You are now LIVE!");
    } catch (error) {
      console.error("Agora Start Live Error:", error);
      toast.error("Failed to start live. Ensure you've allowed camera permissions.");
      cleanupTracks();
    } finally {
      setIsConnecting(false);
    }
  };

  const joinStream = async (stream) => {
    if (isConnecting) return;
    setIsConnecting(true);
    setWatchingStream(stream);

    try {
      const client = clientRef.current;
      await client.setClientRole("audience");

      // Setup listeners BEFORE joining
      client.on("user-published", async (remoteUser, mediaType) => {
        console.log("LivePage: Remote user published:", remoteUser.uid, mediaType);
        await client.subscribe(remoteUser, mediaType);

        if (mediaType === "video") {
          // Use a small timeout to ensure the container is rendered by React
          setTimeout(() => {
            if (videoContainerRef.current) {
              remoteUser.videoTrack.play(videoContainerRef.current);
              console.log("LivePage: Playing remote video");
            }
          }, 500);
        }
        if (mediaType === "audio") {
          remoteUser.audioTrack.play();
        }
      });

      client.on("user-unpublished", (remoteUser) => {
        console.log("LivePage: Remote user unpublished:", remoteUser.uid);
      });

      await client.join(AGORA_APP_ID, stream.channelName, null, user?.uid || null);

      setIsLive(true);
      toast.success(`Joined ${stream.sellerName}'s stream`);
    } catch (error) {
      console.error("Agora Join Error:", error);
      toast.error("Failed to join stream");
      setWatchingStream(null);
    } finally {
      setIsConnecting(false);
    }
  };

  const stopLive = async () => {
    setIsConnecting(true);
    try {
      // Leave Agora
      if (clientRef.current) {
        await clientRef.current.leave();
      }

      cleanupTracks();

      // Update Firestore if seller
      if (isSeller && currentUserId) {
        await deleteDoc(doc(db, "live_streams", currentUserId)).catch(console.error);
      }

      setIsLive(false);
      setWatchingStream(null);
      toast.info("Live session ended");
    } catch (error) {
      console.error("Stop Live Error:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const toggleMute = () => {
    if (localTracksRef.current.audioTrack) {
      const newState = !isMuted;
      localTracksRef.current.audioTrack.setEnabled(!newState);
      setIsMuted(newState);
    }
  };

  const toggleCamera = () => {
    if (localTracksRef.current.videoTrack) {
      const newState = !cameraOn;
      localTracksRef.current.videoTrack.setEnabled(newState);
      setCameraOn(newState);
    }
  };

  const handleCommentSubmit = () => {
    if (!liveComment.trim()) return;
    setComments([...comments, {
      id: Date.now(),
      user: user?.firstName || "Guest",
      comment: liveComment,
    }]);
    setLiveComment("");
  };

  return (
    <div className="live-page" style={{ background: '#f5f5f7', minHeight: '100vh' }}>
      <div className="live-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <div className="live-header" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px', background: 'white', padding: '15px 20px', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <button className="back-btn" onClick={() => { if(isLive) stopLive(); navigate(-1); }} style={{ background: '#f0f0f0', border: 'none', padding: '10px', borderRadius: '50%', cursor: 'pointer' }}>
            <ArrowLeft size={20} />
          </button>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>Live Shopping</h1>
        </div>

        <div className="live-content" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '25px' }}>
          {/* VIDEO SECTION */}
          <div className="live-video-section">
            <div className={`video-placeholder ${isLive ? "live" : ""}`} style={{ position: 'relative', width: '100%', height: '550px', background: '#000', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>

              {isLive && (
                <div className="live-indicator" style={{ position: 'absolute', top: '20px', left: '20px', background: '#ff2e63', color: 'white', padding: '6px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 10 }}>
                  <span className="live-dot" style={{ width: '8px', height: '8px', background: 'white', borderRadius: '50%', animation: 'pulse 1.5s infinite' }} />
                  <span>LIVE</span>
                </div>
              )}

              {/* VIDEO CONTAINER */}
              <div
                ref={videoContainerRef}
                className="live-stream-box"
                style={{ width: '100%', height: '100%', display: isLive ? 'block' : 'none' }}
              />

              {!isLive && (
                <div className="live-placeholder-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '40px', textAlign: 'center', background: '#1a1a2e', color: 'white' }}>
                  {isConnecting ? (
                     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                        <Loader2 size={48} className="animate-spin" />
                        <p>Connecting Live...</p>
                     </div>
                  ) : isSeller ? (
                    <>
                      <Radio size={80} style={{ color: '#ff2e63', marginBottom: '20px', opacity: 0.8 }} />
                      <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '10px' }}>Go Live & Sell</h2>
                      <p style={{ color: '#aaa', marginBottom: '35px', maxWidth: '400px' }}>Start your live show and interact with customers in real-time to boost your sales!</p>
                      <button className="go-live-btn" onClick={startLive} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#ff2e63', color: 'white', padding: '16px 45px', borderRadius: '40px', border: 'none', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer', boxShadow: '0 10px 25px rgba(255, 46, 99, 0.4)' }}>
                        <Video size={24} /> START BROADCAST
                      </button>
                    </>
                  ) : (
                    <>
                      <Radio size={80} style={{ color: '#5c6cff', marginBottom: '20px', opacity: 0.8 }} />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', justifyContent: 'center', marginBottom: '25px' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', margin: 0 }}>Active Shows</h2>
                        <button onClick={() => window.location.reload()} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}><RefreshCw size={18} /></button>
                      </div>

                      {activeStreams.length > 0 ? (
                        <div className="active-streams-list" style={{ width: '100%', maxWidth: '450px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                          {activeStreams.map(stream => (
                            <div key={stream.id} className="stream-card" onClick={() => joinStream(stream)} style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', transition: '0.3s' }}>
                              <div style={{ textAlign: 'left' }}>
                                <strong style={{ fontSize: '18px', color: 'white', display: 'block' }}>{stream.sellerName}</strong>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff2e63', fontSize: '12px', marginTop: '6px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                  <div style={{ width: '6px', height: '6px', background: '#ff2e63', borderRadius: '50%' }}></div>
                                  Live Now
                                </div>
                              </div>
                              <button style={{ background: '#ff2e63', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' }}>JOIN</button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '20px', width: '100%', maxWidth: '400px' }}>
                          <p style={{ color: '#888', margin: 0 }}>No active live streams at the moment.</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* CONTROLS */}
              {isSeller && isLive && (
                <div className="live-controls" style={{ position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '15px', zIndex: 10 }}>
                  <button className="live-control-btn" onClick={toggleMute} style={{ width: '50px', height: '50px', borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(10px)' }}>
                    {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
                  </button>
                  <button className="live-control-btn danger" onClick={stopLive} style={{ background: '#ff2e63', color: 'white', border: 'none', padding: '0 35px', borderRadius: '35px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', boxShadow: '0 10px 20px rgba(255,46,99,0.3)' }}>
                    END LIVE
                  </button>
                  <button className="live-control-btn" onClick={toggleCamera} style={{ width: '50px', height: '50px', borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(10px)' }}>
                    {cameraOn ? <VideoIcon size={22} /> : <VideoOff size={22} />}
                  </button>
                </div>
              )}

              {!isSeller && isLive && (
                <button
                  onClick={stopLive}
                  style={{ position: 'absolute', bottom: '30px', right: '30px', padding: '10px 24px', background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer', backdropFilter: 'blur(10px)', zIndex: 10 }}
                >
                  Exit Show
                </button>
              )}
            </div>
          </div>

          {/* CHAT SECTION */}
          <div className="live-chat-section" style={{ background: 'white', borderRadius: '24px', padding: '25px', display: 'flex', flexDirection: 'column', height: '620px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #f0f0f0' }}>
               <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#1a1a1a' }}>Live Chat</h3>
               <div style={{ padding: '2px 8px', background: '#f0f0ff', borderRadius: '6px', color: '#5c6cff', fontSize: '11px', fontWeight: 'bold' }}>REAL-TIME</div>
            </div>

            <div className="live-comments" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {comments.length === 0 && (
                <div style={{ textAlign: 'center', marginTop: '40px', color: '#ccc' }}>
                   <MessageSquare size={40} style={{ margin: '0 auto 10px' }} />
                   <p style={{ fontSize: '14px' }}>Welcome to the show!</p>
                </div>
              )}
              {comments.map((c) => (
                <div key={c.id} style={{ background: '#f8f9fd', padding: '12px 16px', borderRadius: '15px', borderLeft: '4px solid #5c6cff' }}>
                  <strong style={{ fontSize: '12px', color: '#5c6cff', display: 'block', marginBottom: '4px' }}>{c.user}</strong>
                  <p style={{ margin: 0, fontSize: '14px', color: '#444', lineHeight: '1.4' }}>{c.comment}</p>
                </div>
              ))}
            </div>

            <div className="live-comment-input" style={{ display: 'flex', gap: '10px', background: '#f8f9fd', padding: '5px', borderRadius: '30px', border: '1px solid #eee' }}>
              <input
                type="text"
                value={liveComment}
                onChange={(e) => setLiveComment(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit()}
                placeholder="Say something..."
                style={{ flex: 1, padding: '12px 20px', borderRadius: '25px', border: 'none', outline: 'none', fontSize: '14px', background: 'transparent' }}
              />
              <button onClick={handleCommentSubmit} style={{ background: '#5c6cff', color: 'white', border: 'none', padding: '0 25px', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer' }}>SEND</button>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }
        .live-stream-box div { width: 100% !important; height: 100% !important; }
        .live-stream-box video { width: 100% !important; height: 100% !important; object-fit: cover !important; }
      `}</style>
    </div>
  );
};

export default LivePage;
