import { Form, Input, Button, Spin, message } from "antd";
import React, { useContext, useEffect } from "react";
import useFetch from "./useFetch";
import { Context } from "../Store";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import logo from "../login.svg";

const layout = {
  labelCol: { span: 1 },
  wrapperCol: { span: 0 },
};
const tailLayout = {
  wrapperCol: { offset: 0, span: 0 },
};

const favLink =
  "https://api.themoviedb.org/3/account/{account_id}/favorite/movies";
const api = "?api_key=bb8c35abad01decf94d738c76ecd3cb7&session_id=";
const suffix = "&language=en-US&sort_by=created_at.asc";
const apiKey = "bb8c35abad01decf94d738c76ecd3cb7";

const fetchToken =
  "https://api.themoviedb.org/3/authentication/token/new?api_key=bb8c35abad01decf94d738c76ecd3cb7";

const url =
  "https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=bb8c35abad01decf94d738c76ecd3cb7";

const newSession =
  "https://api.themoviedb.org/3/authentication/session/new?api_key=bb8c35abad01decf94d738c76ecd3cb7";

const LoginPage = () => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [state, dispatch] = useContext(Context);
  const [loadings, setLoadings] = React.useState(false);
  const history = useHistory();

  const res = useFetch(fetchToken);
  if (!res.response) {
    return (
      <div className="spin">
        <Spin size="large" />
      </div>
    );
  }

  const data = {
    username: username,
    password: password,
    request_token: res.response.request_token,
  };

  const register = () => {
    window.location = "https://www.themoviedb.org/signup";
  };

  const requestSession = (token) => {
    const request_token = {
      request_token: token,
    };

    fetch(newSession, {
      method: "POST", // or 'PUT'
      body: JSON.stringify(request_token), // data can be `string` or {object}!
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    })
      .then((res) => res.json())
      .catch((error) => console.error("Error:", error))
      .then((response) => {
        dispatch({ type: "SET_ID", payload: response.session_id });
        message.success("Success logged in");
        requestFavoriteMovie(response.session_id);
      });
  };

  const requestFavoriteMovie = (id) => {
    fetch(favLink + api + id + suffix)
      .then((res) => res.json())
      .catch((error) => console.error("Error:", error))
      .then((response) => {
        let temp = new Map();
        response.results.map((e) => temp.set(e.id, true));
        dispatch({ type: "SET_FAVORITE", payload: temp });
        dispatch({ type: "SET_USERNAME", payload: username });
        setLoadings(false);
        history.push("/");
      });
  };

  function OnFinish() {
    setLoadings(true);
    fetch(url, {
      method: "POST", // or 'PUT'
      body: JSON.stringify(data), // data can be `string` or {object}!
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    })
      .then((res) => res.json())
      .catch((error) => console.error("Error:", error))
      .then((response) => {
        if (response.success === true) {
          localStorage.setItem("username", data.username);
          localStorage.setItem("password", data.password);
          localStorage.setItem("api", apiKey);
          requestSession(response.request_token);
        } else {
          message.error(response.status_message);
          setLoadings(false);
        }
      });
  }

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="log">
      <div className="form">
        <section
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <img src={logo} alt="logo" style={{ height: 28, marginRight: 40 }} />
          <div
            style={{ display: "flex", justifyContent: "center", fontSize: 29 }}
          >
            Login to your account
          </div>
        </section>
        <Form
          {...layout}
          initialValues={{ remember: true }}
          onFinish={OnFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                loading={loadings}
              >
                Log in
              </Button>
              <div style={{ marginLeft: 18 }}>
                <Button type="default" onClick={register}>
                  Register
                </Button>
              </div>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
