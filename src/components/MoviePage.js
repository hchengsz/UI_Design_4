import { Select, Button, Spin, message } from "antd";
import { useParams } from "react-router-dom";
import React, { useContext } from "react";
import { StarFilled } from "@ant-design/icons";
import useFetch from "./useFetch";
import { Context } from "../Store";

const baseUrl = "https://api.themoviedb.org/3/movie/";
const apiKey = "?api_key=bb8c35abad01decf94d738c76ecd3cb7&language=en-US";
const image = "https://www.themoviedb.org/t/p/w1280/";
const link = "https://api.themoviedb.org/3/account/{account_id}/rated/movies";
const api = "?api_key=bb8c35abad01decf94d738c76ecd3cb7&session_id=";
const suffix = "&language=en-US&sort_by=created_at.asc";

const options = [
  {
    value: 1,
    label: "1",
  },
  {
    value: 2,
    label: "2",
  },
  {
    value: 3,
    label: "3",
  },
  {
    value: 4,
    label: "4",
  },
  {
    value: 5,
    label: "5",
  },
  {
    value: 6,
    label: "6",
  },
  {
    value: 7,
    label: "7",
  },
  {
    value: 8,
    label: "8",
  },
  {
    value: 9,
    label: "9",
  },
  {
    value: 10,
    label: "10",
  },
];

function MoviePage() {
  const { id } = useParams();
  const res = useFetch(baseUrl + id + apiKey);
  const [state, dispatch] = useContext(Context);
  const [loadings, setLoadings] = React.useState(false);
  let ratingValue = 1;

  React.useEffect(() => {
    if (state.session_id === null) {
      return;
    }
    fetch(link + api + state.session_id + suffix)
      .then((res) => res.json())
      .catch((error) => console.error("Error:", error))
      .then((response) => {
        if (response !== undefined && response.success !== false) {
          let myRate = response.results.filter(
            (e) => e.id === parseInt(id, 10)
          );
          if (myRate.length === 0) {
            dispatch({ type: "SET_RATE", payload: "Not yet" });
          } else {
            let temp = myRate[0].rating.toString();
            dispatch({ type: "SET_RATE", payload: temp });
          }
        }
      });
  }, [loadings, id, dispatch, state.session_id]);

  if (!res.response) {
    return (
      <div className="spin">
        <Spin size="large" />
      </div>
    );
  }

  const movie = res.response;
  const productionCompanies = movie.production_companies;
  console.log(movie.genres);

  function handleChange(value) {
    ratingValue = value;
  }

  const ratingMovie = () => {
    if (state.session_id === null) {
      message.error("You have not logged in yet, please log in first.");
      return;
    }
    const body = {
      value: ratingValue,
    };
    setLoadings(true);

    fetch(
      "https://api.themoviedb.org/3/movie/" +
        id +
        "/rating" +
        api +
        state.session_id,
      {
        method: "POST", // or 'PUT'
        body: JSON.stringify(body), // data can be `string` or {object}!
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      }
    )
      .then((res) => res.json())
      .catch((error) => console.error("Error:", error))
      .then((response) => {
        if (response.success === true) {
          message.success("Success rated");
        }
        setLoadings(false);
      });
  };

  return (
    <div className="data">
      <div id="image">
        <img
          className="poster"
          id={movie.id}
          src={image + movie.poster_path}
          alt="movie poster"
        />
      </div>
      <div id="text">
        <h1>{movie.title}</h1>
        <h3>Release Date:</h3>
        <p>{movie.release_date}</p>
        <h3>Overview:</h3>
        <p id="overview">{movie.overview}</p>
        <h3>Genres:</h3>
        <div className="genre">
          {movie.genres.map((v) => (
            <div key={v.name}>{v.name}</div>
          ))}
        </div>
        <h3>Rating:</h3>
        <div className="rating">
          <StarFilled style={{ color: "gold" }} />
          <div style={{ marginLeft: 10 }}> {movie.vote_average}</div>
        </div>
        <h3>Your Rating:</h3>
        <p>{state.yourRate}</p>
        <div className="rating">
          <Select options={options} defaultValue={1} onChange={handleChange} />
          <Button
            style={{ marginLeft: 10 }}
            onClick={ratingMovie}
            type="primary"
            loading={loadings}
          >
            RATE IT!
          </Button>
        </div>
        <h3>Production Compaines:</h3>
        <div className="productionCompanies">
          {productionCompanies.map((v) => {
            if (v.logo_path === null) {
              return (
                <div className="company" key={v.name}>
                  <p style={{ color: "red" }}>Image Loading Error</p>
                  <p key={v.id} style={{ fontSize: 16 }}>
                    {v.name}
                  </p>
                </div>
              );
            }
            return (
              <div className="company" key={v.name}>
                <img
                  style={{ height: 40 }}
                  alt={v.name}
                  src={"https://www.themoviedb.org/t/p/w1280/" + v.logo_path}
                ></img>
                <p key={v.id} style={{ fontSize: 16 }}>
                  {v.name}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MoviePage;
