/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import "./Login.css";
import { UserIcon, LockClosedIcon } from "@heroicons/react/24/solid";

export default function Login() {
  const { isAuthenticated, signin, errors } = useAuth();
  const { register, handleSubmit, reset } = useForm();

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/chat");
  }, [isAuthenticated]);

  useEffect(() => {
    if (errors.length > 0) {
      console.log(errors);
      reset();
    }
  }, [errors]);

  const onSubmit = handleSubmit((values) => {
    signin(values);
  });

  return (
    <>
      <div
        style={{
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          backgroundImage: "url(/b8ed0822-8bf8-4a08-8940-d63dc3b3f086.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          color: "#595959",
        }}
      >
        <div
          className="container"
          style={{
            width: 460,
            backdropFilter: "blur(7px)",
            padding: 20,
            borderStyle: "solid",
            borderColor: "#80808047",
            borderWidth: 1,
          }}
        >
          <h2 className="center">Login</h2>

          {errors.length > 0 &&
            errors.map((message, index) => (
              <div key={index}>
                <p className="red-text text-darken-3">{message}</p>
              </div>
            ))}

          <form onSubmit={onSubmit}>
            <div className="row">
              <div
                className="input-field col s12"
                style={{ position: "relative" }}
              >
                <input
                  type="text"
                  id="nombre"
                  className="browser-default input-login"
                  {...register("nombre", { required: true })}
                />
                <label id="label_nombre" htmlFor="nombre">
                  Nombre
                </label>

                <UserIcon
                  width={25}
                  style={{ position: "absolute", top: 11, left: 20 }}
                />
              </div>
              <div
                className="input-field col s12"
                style={{ position: "relative" }}
              >
                <input
                  type="password"
                  id="password"
                  className="browser-default input-login"
                  {...register("password", { required: true })}
                />
                <label id="label_pass" htmlFor="password">
                  Password
                </label>

                <LockClosedIcon
                  width={25}
                  style={{ position: "absolute", top: 11, left: 20 }}
                />
              </div>
              <div className="col s12">
                <button
                  className="css-button-shadow-border-sliding--black"
                  style={{
                    width: "100%",
                  }}
                >
                  Login
                </button>
              </div>
            </div>
          </form>

          <span style={{ marginLeft: 12 }}>
            No tienes una cuenta?
            <Link style={{ color: "#363232", marginLeft: 5 }} to="/register">
              <b>Regísrese</b>
            </Link>
          </span>
        </div>
      </div>
    </>
  );
}
