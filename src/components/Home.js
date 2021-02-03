import React, { useEffect } from "react";
import { StarFilled, HeartOutlined, HeartFilled } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Select, Button, Modal, Spin, Space } from "antd";
import { Context } from "../Store";

const urlMovie = "https://api.themoviedb.org/3/movie/";
const image = "https://www.themoviedb.org/t/p/w1280/";

const postFav = "https://api.themoviedb.org/3/account/{account_id}/favorite";
const api = "?api_key=bb8c35abad01decf94d738c76ecd3cb7&session_id=";
const apiKey = "?api_key=bb8c35abad01decf94d738c76ecd3cb7&language=en-US&page=";

const options = [
  {
    label: "Popular",
    value: "popular",
  },
  {
    label: "Now Playing",
    value: "now_playing",
  },
  {
    label: "Top Rated",
    value: "top_rated",
  },
  {
    label: "Upcoming",
    value: "upcoming",
  },
];

export default function Home() {
  const [state, dispatch] = React.useContext(Context);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [types, setTypes] = React.useState("now_playing");
  const [page, setPage] = React.useState(1);
  const [maxPage, setMaxPage] = React.useState(500);
  const [movies, setMovies] = React.useState([]);

  useEffect(async () => {
    fetch(urlMovie + types + apiKey + page)
      .then((res) => res.json())
      .catch((error) => console.error("Error:", error))
      .then((response) => {
        setMaxPage(response.total_pages);
        response = response.results.map((item) => {
          if (
            state.likedMovie !== undefined &&
            state.likedMovie.get(item.id) !== undefined
          ) {
            return Object.assign({}, item, { favorite: true });
          } else {
            return Object.assign({}, item, { favorite: false });
          }
        });
        // dispatch({ type: "SET_MOVIES", payload: response });
        setMovies(response.slice());
      });
  }, [types, page, state]);

  if (movies.length === 0) {
    return (
      <div className="spin">
        <Spin size="large" />
      </div>
    );
  }

  function handleChange(value) {
    setTypes(value);
  }

  function handleNext() {
    if (page + 1 <= maxPage) {
      setPage(page + 1);
    }
  }

  function handlePrev() {
    if (page - 1 > 0) {
      setPage(page - 1);
    }
  }

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const movieClicked = (id) => {
    if (state.session_id === null) {
      showModal();
      return;
    }

    let temp = movies.slice();
    let fav = false;
    var clonedMap = new Map(state.likedMovie);

    temp.forEach((element) => {
      if (element.id === id) {
        fav = !element.favorite;
        element.favorite = fav;
        if (fav === true) {
          clonedMap.set(id, true);
        } else {
          clonedMap.delete(id);
        }
      }
    });

    const body = {
      media_type: "movie",
      media_id: id,
      favorite: fav,
    };

    dispatch({ type: "SET_MOVIES", payload: temp });
    dispatch({ type: "SET_FAVORITE", payload: clonedMap });

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
    <>
      <div className="selectPage">
        <Button type="default" onClick={handlePrev}>
          Prev
        </Button>
        <div id="page">
          {page} / {maxPage}
        </div>
        <Button type="default" onClick={handleNext}>
          Next
        </Button>
        <p id="category">Category</p>
        <Select
          className="selectCategory"
          options={options}
          defaultValue="now_playing"
          style={{ width: 125 }}
          onChange={handleChange}
        />
      </div>
      <Modal
        title="Notice"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <h3>You have not logged in, please log in first.</h3>
      </Modal>
      <div className="movies">
        {movies.map((movie, k) => {
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

                <div className="movie__row">{heart}</div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
