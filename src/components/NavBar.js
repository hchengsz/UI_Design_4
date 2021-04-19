import { Link, BrowserRouter as Router, Route } from "react-router-dom";
import logo from "../logo.svg";
import Home from "./Home";
import { Button, Popconfirm, message, Menu } from "antd";
import MoviePage from "./MoviePage";
import LoginPage from "./LoginPage";
import FavoritePage from "./FavoritePage";
import RatedPage from "./RatedPage";
import React, { useEffect } from "react";
import { Context } from "../Store";

const favLink =
  "https://api.themoviedb.org/3/account/{account_id}/favorite/movies";
const api = "?api_key=bb8c35abad01decf94d738c76ecd3cb7&session_id=";
const suffix = "&language=en-US&sort_by=created_at.asc";

const fetchToken =
  "https://api.themoviedb.org/3/authentication/token/new?api_key=bb8c35abad01decf94d738c76ecd3cb7";

const url =
  "https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=bb8c35abad01decf94d738c76ecd3cb7";

const newSession =
  "https://api.themoviedb.org/3/authentication/session/new?api_key=bb8c35abad01decf94d738c76ecd3cb7";

function NavBar() {
  const [state, dispatch] = React.useContext(Context);
  const [login, setLogin] = React.useState(null);
  const [key, setKey] = React.useState([""]);

  useEffect(() => {
    const confirm = () => {
      const copyMovies = state.movies.map((v) => {
        v.favorite = false;
        return v;
      });
      dispatch({ type: "LOG_OUT", payload: copyMovies });
      localStorage.clear();
      message.success("Success logged out");
    };

    const retriveToken = async (username, password) => {
      fetch(fetchToken)
        .then((res) => res.json())
        .catch((error) => console.error("Error:", error))
        .then((response) => {
          retriveData(username, password, response.request_token);
        });
    };
    const retriveData = async (username, password, token) => {
      const data = {
        username: username,
        password: password,
        request_token: token,
      };
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
            requestSession(response.request_token);
          } else {
            message.error(response.status_message);
          }
        });
    };

    const requestSession = async (token) => {
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
          requestFavoriteMovie(response.session_id);
        });
    };

    const requestFavoriteMovie = async (id) => {
      if (id === undefined) {
        return;
      } else {
        console.log("success");
      }
      fetch(favLink + api + id + suffix)
        .then((res) => res.json())
        .catch((error) => console.error("Error:", error))
        .then((response) => {
          let temp = new Map();
          response.results.map((e) => temp.set(e.id, true));
          dispatch({ type: "SET_FAVORITE", payload: temp });
          dispatch({
            type: "SET_USERNAME",
            payload: localStorage.getItem("username"),
          });
          message.success("Success logged in");
        });
    };
    function fetchData() {
      let username = localStorage.getItem("username");
      let password = localStorage.getItem("password");
      if (username !== null && password !== null && state.session_id === null) {
        retriveToken(
          localStorage.getItem("username"),
          localStorage.getItem("password")
        );
      }
      if (state.session_id === null) {
        setLogin(
          <Link to="/login">
            <Button
              className="login"
              onClick={() => {
                changeKey([""]);
              }}
            >
              Login
            </Button>
          </Link>
        );
      } else {
        setLogin(
          <div>
            <Popconfirm
              placement="bottomLeft"
              title="Do you want to log out?"
              onConfirm={confirm}
              okText="Yes"
              cancelText="No"
            >
              <Button type="text" className="login">
                {state.username}
              </Button>
            </Popconfirm>
          </div>
        );
      }
    }
    fetchData();
  }, [state, dispatch]);

  // const confirm = () => {
  //   const copyMovies = state.movies.map((v) => {
  //     v.favorite = false;
  //     return v;
  //   });
  //   dispatch({ type: "LOG_OUT", payload: copyMovies });
  //   localStorage.clear();
  //   message.success("Success logged out");
  // };

  // const retriveToken = async (username, password) => {
  //   fetch(fetchToken)
  //     .then((res) => res.json())
  //     .catch((error) => console.error("Error:", error))
  //     .then((response) => {
  //       retriveData(username, password, response.request_token);
  //     });
  // };

  function changeKey(key) {
    setKey(key);
  }

  return (
    <Router>
      {/* hyperlink */}
      <Menu className="nav" mode="horizontal" selectedKeys={key}>
        <Link to="/">
          <img
            src={logo}
            alt="logo"
            onClick={() => {
              changeKey(["Home"]);
            }}
          />
        </Link>
        <Menu.Item
          key="Home"
          onClick={() => {
            changeKey(["Home"]);
          }}
        >
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item
          key="Favorite"
          onClick={() => {
            changeKey(["Favorite"]);
          }}
        >
          <Link to="/favorite">Favorite</Link>
        </Menu.Item>
        <Menu.Item
          key="Rated"
          onClick={() => {
            changeKey(["Rated"]);
          }}
        >
          <Link to="/rated">Rated</Link>
        </Menu.Item>
        {login}
      </Menu>

      <Menu className="mobile-nav" mode="horizontal" selectedKeys={key}>
        <Link to="/">
          <img
            src={logo}
            alt="logo"
            onClick={() => {
              changeKey(["Home"]);
            }}
          />
        </Link>
        <div class="hamburger">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </Menu>

      <Route path="/" exact>
        <Home />
      </Route>
      <Route path="/favorite" exact>
        <FavoritePage />
      </Route>
      <Route path="/rated" exact>
        <RatedPage />
      </Route>
      <Route path="/login" exact>
        <LoginPage />
      </Route>
      <Route path="/movie/:id" exact>
        <MoviePage />
      </Route>
    </Router>
  );
}

export default NavBar;
