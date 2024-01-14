import { useState } from "react";
import "./App.css";
import encodeImage from "./base_64";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Welcome from "./Welcome";
import Profiles from "./Profiles";
import "./index.css";

function App() {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [base64encoding, setbase64encoding] = useState("");

  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  // for image useState
  const handleImageChange = (e) => {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    setbase64encoding(encodeImage(file));

    reader.onloadend = () => {
      setImagePreviewUrl(reader.result);
    };

    reader.readAsDataURL(file);
  };

  // what to do in chat
  const chat = async (e, message) => {
    console.log("HERE!");
    e.preventDefault();

    if (!message || !base64encoding) return;
    setIsTyping(true);
    scrollTo(0, 1e10);

    let msgs = chats;
    // if (base64encoding != "") {
    //   // For a image message
    //   console.log("base64: ", base64encoding);
    //   msgs.push({ role: "user", type: "image_url", content: base64encoding });
    //   setbase64encoding("");
    // } else {
    // For an text message
    msgs.push({ role: "user", type: "text", content: message });
    // }
    setChats(msgs);

    setMessage("");

    fetch("http://localhost:8000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chats,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        msgs.push(data.output);
        setChats(msgs);
        setIsTyping(false);
        scrollTo(0, 1e10);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <main>
      <h1>HarnessAI</h1>
      <section>
        {chats && chats.length
          ? chats.map((chat, index) => (
              <p key={index} className={chat.role === "user" ? "user_msg" : ""}>
                <span>
                  <b>{chat.role.toUpperCase()}</b>
                </span>
                <span>:</span>
                <span style={{ whiteSpace: "pre-wrap" }}>{chat.content}</span>
              </p>
            ))
          : ""}
      </section>

      <div className={isTyping ? "" : "hide"}>
        <p>
          <i>{isTyping ? "Typing" : ""}</i>
        </p>
      </div>

      {/* handle message submit */}
      {/* <form onSubmit={(e) => chat(e, message)}>
        <input
          // type="text"
          name="message"
          value={message}
          placeholder="Type a message here and hit Enter..."
          onChange={(e) => setMessage(e.target.value)}
        />
      </form> */}

      <form onSubmit={(e) => chat(e, message)}>
        <input
          type="text"
          name="message"
          value={message}
          placeholder="Type a message here and hit Enter..."
          onChange={(e) => setMessage(e.target.value)}
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {imagePreviewUrl && (
          <img src={imagePreviewUrl} alt="Preview" style={{ width: "100px" }} />
        )}
        <button type="submit">Send</button>
      </form>

      {/* handle file upload */}
      {/* <input type="file" accept="image/*" onChange={handleImageChange} />
        {imagePreviewUrl && (
          <img
            src={imagePreviewUrl}
            alt="Image preview"
            className="Image-preview"
            style={{ width: '200px'}}
      />  )} */}
    </main>
  );
}

export default App;
