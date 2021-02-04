import { Context } from "../Store";
import { useContext } from "react";
import { StarFilled, HeartFilled, HeartOutlined } from "@ant-design/icons";
import React from "react";
import { Link } from "react-router-dom";
import { Result, Button } from "antd";

const link =
  "https://api.themoviedb.org/3/account/{account_id}/favorite/movies";
const api = "?api_key=bb8c35abad01decf94d738c76ecd3cb7&session_id=";
const suffix = "&language=en-US&sort_by=created_at.asc";
const image = "https://www.themoviedb.org/t/p/w1280/";
const postFav = "https://api.themoviedb.org/3/account/{account_id}/favorite";

export default function FavoritePage() {
  const [state, dispatch] = useContext(Context);

  React.useEffect(() => {
    if (state.session_id === null) {
      return;
    }
    fetch(link + api + state.session_id + suffix)
      .then((res) => res.json())
      .catch((error) => console.error("Error:", error))
      .then((response) => {
        if (response === undefined || response.success === false) {
          dispatch({ type: "SET_MOVIES", payload: [] });
        } else {
          response = response.results.map((item, index) => {
            return Object.assign({}, item, { favorite: true });
          });
          dispatch({ type: "SET_MOVIES", payload: response });
        }
      });
  }, []);

  if (state.session_id === null) {
    return (
      <Result
        status="403"
        title="Login Required"
        subTitle="Sorry, you need to login first to access this page."
        extra={
          <Link to="/login">
            <Button type="primary">Go to Login</Button>
          </Link>
        }
      />
    );
  }

  if (state.movies.length === 0) {
    return (
      <Result
        title="You have no favorite movie so far, select some!"
        extra={
          <Link to="/">
            <Button type="primary" key="console">
              Back Home
            </Button>
          </Link>
        }
      />
    );
  }

  const movieClicked = (id) => {
    let temp = state.movies.slice();

    temp = temp.filter((element) => element.id !== id);

    console.log(id);
    console.log(temp);

    const body = {
      media_type: "movie",
      media_id: id,
      favorite: false,
    };

    dispatch({ type: "SET_MOVIES", payload: temp });

    fetch(postFav + api + state.session_id, {
      method: "POST", // or 'PUT'
      body: JSON.stringify(body), // data can be `string` or {object}!
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    })
      .then((res) => res.json())
      .catch((error) => console.error("Error:", error))
      .then((response) => console.log(response.status_message));
  };

  return (
    <div className="movies">
      {state.movies.map((movie, k) => {
        let heart = (
          <HeartOutlined
            className="outline"
            id={movie.id}
            onClick={() => {
              movieClicked(movie.id);
            }}
          />
        );
        if (movie.favorite === true) {
          heart = (
            <HeartFilled
              style={{ color: "red" }}
              className="filled"
              id={movie.id}
              onClick={() => {
                movieClicked(movie.id);
              }}
            />
          );
        }
        return (
          <div className="movie" key={movie.id}>
            <img
              className="movie__img"
              alt="movie__img"
              id={movie.id}
              src={image + movie.poster_path}
            />
            <Link
              to={"/movie/" + movie.id}
              className="movie__name"
              id={movie.id}
            >
              {movie.title}
            </Link>
            <div className="movie__data">
              <div className="movie__row">
                <StarFilled style={{ color: "gold" }} />
                <div className="avg">{movie.vote_average}</div>
              </div>
              <p className="movie__row">{heart}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
