import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import io from "socket.io-client";

// const socket = io("http://localhost:5005");
const socket = io("http://192.168.0.20:5005");


function AudioCall() {
  const { appointmentId } = useParams();
  const user = useSelector((state) => state.user);
  const isDoctor = user.role === "doctor";

  const localAudioRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const peerConnection = useRef(null);

  const [muted, setMuted] = useState(false);
  const [callActive, setCallActive] = useState(true);
  const [status, setStatus] = useState("Connecting...");

  useEffect(() => {
    initCall();

    socket.emit("join-call", { appointmentId });

    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleIceCandidate);
    socket.on("end-call", handleRemoteEnd);

    return () => {
      peerConnection.current?.close();
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("end-call");
    };
    // eslint-disable-next-line
  }, []);

  // 🎧 INIT CALL
  const initCall = async () => {
    peerConnection.current = new RTCPeerConnection();
    setStatus("Waiting for peer...");

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    localAudioRef.current.srcObject = stream;

    stream.getTracks().forEach((track) =>
      peerConnection.current.addTrack(track, stream)
    );

    peerConnection.current.ontrack = (event) => {
      remoteAudioRef.current.srcObject = event.streams[0];
      setStatus("Connected");
    };

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          appointmentId,
          candidate: event.candidate,
        });
      }
    };
  };

  // 📞 DOCTOR STARTS CALL
  const callUser = async () => {
    if (!isDoctor) return;

    setStatus("Calling...");

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);

    socket.emit("offer", { appointmentId, offer });
  };

  // 📩 PATIENT RECEIVES OFFER
  const handleOffer = async (offer) => {
    if (isDoctor) return;

    await peerConnection.current.setRemoteDescription(
      new RTCSessionDescription(offer)
    );

    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);

    socket.emit("answer", { appointmentId, answer });
    setStatus("Connected");
  };

  // 📩 DOCTOR RECEIVES ANSWER
  const handleAnswer = async (answer) => {
    if (!isDoctor) return;

    if (peerConnection.current.signalingState !== "have-local-offer") return;

    await peerConnection.current.setRemoteDescription(
      new RTCSessionDescription(answer)
    );

    setStatus("Connected");
  };

  // ❄ ICE
  const handleIceCandidate = async (candidate) => {
    try {
      await peerConnection.current.addIceCandidate(candidate);
    } catch {}
  };

  // 🔇 MUTE
  const toggleMute = () => {
    const track = localAudioRef.current.srcObject.getAudioTracks()[0];
    track.enabled = !track.enabled;
    setMuted(!track.enabled);
  };

  // ❌ END CALL
  const endCall = () => {
    peerConnection.current?.close();
    socket.emit("end-call", { appointmentId });
    setCallActive(false);
    setStatus("Call Ended");
  };

  const handleRemoteEnd = () => {
    peerConnection.current?.close();
    setCallActive(false);
    setStatus("Call Ended");
  };

  if (!callActive) {
    return <h3 style={{ padding: 20 }}>📞 Call Ended</h3>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>🔊 Audio Call</h2>

      <p style={{ fontWeight: 600, color: "#0d6efd" }}>
        Status: {status}
      </p>

      <audio ref={localAudioRef} autoPlay muted />
      <audio ref={remoteAudioRef} autoPlay />

      {isDoctor && (
        <button onClick={callUser} style={{ marginTop: 10 }}>
          📞 Start Call
        </button>
      )}

      <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
        <button onClick={toggleMute}>
          {muted ? "🎙️ Unmute" : "🔇 Mute"}
        </button>

        <button
          style={{ background: "#dc3545", color: "#fff" }}
          onClick={endCall}
        >
          ❌ End Call
        </button>
      </div>
    </div>
  );
}

export default AudioCall;
