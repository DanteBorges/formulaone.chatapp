import { Container, Col, Row } from "react-bootstrap";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import WaitingRoom from "./components/waitinggroom";
import { useState } from "react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import ChatRoom from "./components/ChatRoom";

function App() {
  const [conn, setConnection] = useState();
  const [messages, setMessages] = useState([]);

  const joinChatRoom = async (username, chatroom) => {
    try {
      const conn = new HubConnectionBuilder()
        .withUrl("http://localhost:5143/Chat")
        .configureLogging(LogLevel.Information)
        .build();

      conn.on("ReceiveMessage", (username, msg) => {
        setMessages((messages) => [...messages, { username, msg }]);
      });

      conn.on("ReceiveSpecificMessage", (username, msg) => {
        setMessages((messages) => [...messages, { username, msg }]);
      });

      await conn.start();

      const userConnection = {
        Username: username,
        ChatRoom: chatroom,
      };
      await conn.invoke("JoinSpecificChatRoom", userConnection);
      setConnection(conn);
    } catch (e) {
      console.error("Error joining chat room:", e);
    }
  };

  const sendMessage = async (message) => {
    try {
      await conn.invoke("SendMessage", message);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <main>
        <Container>
          <Row className="px-5 my-5">
            <Col>
              <h1 className="font-weight-light">Welcome to the F1 ChatApp</h1>
            </Col>
          </Row>
          {!conn ? (
            <WaitingRoom joinChatRoom={joinChatRoom}></WaitingRoom>
          ) : (
            <ChatRoom messages={messages} sendMessage={sendMessage}></ChatRoom>
          )}
        </Container>
      </main>
    </div>
  );
}

export default App;
