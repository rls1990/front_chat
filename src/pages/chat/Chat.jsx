/* eslint-disable react-hooks/exhaustive-deps */
import "./Chat.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { PaperAirplaneIcon, UserCircleIcon } from "@heroicons/react/24/solid";

export default function Chat() {
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [socket, setSocket] = useState(null);

  const { logout, isAuthenticated, user } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate("/");
  }, [isAuthenticated]);

  useEffect(() => {
    const divmessages = document.getElementById("chat_messages");
    divmessages.scrollTo(0, divmessages.scrollHeight);
  }, [mensajes]);

  // Conectar al servidor de sockets cuando el componente se monta
  useEffect(() => {
    const socketio = io("http://localhost:3000");
    setSocket(socketio);

    // Escuchar eventos del servidor
    socketio.on("mensaje", (message) => {
      setMensajes((prevMensajes) => [...prevMensajes, message]);
      console.log(message);
    });

    // Manejar desconexión del servidor
    return () => {
      socketio.disconnect();
      setSocket(null);
    };
  }, []);

  // Enviar mensaje al servidor
  const enviarMensaje = () => {
    //const socket = io("http://localhost:3000");
    if (mensaje.length > 0) {
      //socket.emit("mensaje", user.nombre + " : " + mensaje);
      socket.emit("mensaje", { nombre: user.nombre, mensaje });
      setMensaje("");
      const textarea = document.getElementById("message");
      textarea.style.height = 0;
      const label_message = document.getElementById("label_message");
      label_message.classList.remove("active");
    }
  };

  const onInputTextArea = ({ target }) => {
    const textarea = target;
    textarea.style.height = textarea.scrollHeight + "px";
  };

  return (
    <>
      <div className="navbar-fixed">
        <nav className="grey darken-3">
          <div className="nav-wrapper">
            <Link
              to={"/chat"}
              className="brand-logo"
              style={{ marginLeft: 20 }}
            >
              Chat
            </Link>

            <ul id="nav-mobile" className="right hide-on-med-and-down">
              <li>
                <Link to={"/"} onClick={() => logout()}>
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="center container z-depth-1" style={{ marginTop: 50 }}>
        <div id="chat_messages" className="grey lighten-4">
          <ul className="center-align">
            {mensajes.map((msg, index) => (
              <li
                key={index}
                className={
                  user.nombre === msg.nombre
                    ? "local left-align"
                    : "unlocal left-align"
                }
              >
                <div className="row">
                  <div className="col l2 m2 s2 msg-avatar">
                    {user.nombre !== msg.nombre && <UserCircleIcon />}
                  </div>

                  <div className="col l9 m9 s9 msg-content grey lighten-2   grey lighten-2">
                    <div
                      className={
                        user.nombre !== msg.nombre ? "flecha-l" : "flecha-r"
                      }
                    ></div>
                    {user.nombre !== msg.nombre && (
                      <div className="titulo-mensage">{msg.nombre}</div>
                    )}
                    <p>
                      {user.nombre === msg.nombre ? msg.mensaje : msg.mensaje}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div id="chat_message" className="grey lighten-2">
          <div className="row">
            <div className="input-field col s12">
              <textarea
                id="message"
                className="browser-default chatTextarea"
                data-length="120"
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                onInput={onInputTextArea}
              ></textarea>
              <label id="label_message" htmlFor="message">
                Mensage
              </label>
            </div>
          </div>

          <button id="btn-chat" className="btn-flat" onClick={enviarMensaje}>
            <PaperAirplaneIcon width={30} height={30} />
          </button>
        </div>
      </div>
    </>
  );
}
