import { StarFilled, HeartOutlined, HeartFilled } from "@ant-design/icons";
import { Link } from "react-router-dom";

export default function Movies() {
  const mylist = useFetch(link + api + state.session_id + suffix);
  const [state] = React.useContext(Context);
  const movieList = res.response.results;

  if (!mylist.response) {
    return <div>Loading...</div>;
  }

  const movieClicked = (e) => {
    if (state.session_id === null) {
      showModal();
      return;
    }

    let fav = true;
    let id = e.currentTarget.id;

    if (e.currentTarget.className === "anticon anticon-heart filled") {
      fav = false;
    }

    const body = {
      media_type: "movie",
      media_id: id,
      favorite: fav,
    };

    fetch(postFav + api + state.session_id, {
      method: "POST", // or 'PUT'
      body: JSON.stringify(body), // data can be `string` or {object}!
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    })
      .then((res) => res.json())
      .catch((error) => console.error("Error:", error))
      .then((response) => {
        console.log(response);
      });
  };

  return (
    <div className="movies">
      {movieList.map((movie, k) => {
        let heart = (
          <HeartOutlined
            className="outline"
            id={movie.id}
            onClick={movieClicked}
          />
        );
        if (likedMovie !== undefined && likedMovie.indexOf(movie.id) > -1) {
          heart = (
            <HeartFilled
              style={{ color: "red" }}
              className="filled"
              id={movie.id}
              onClick={movieClicked}
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
              <p className="movie__row">
                <StarFilled style={{ color: "gold" }} />
                {movie.vote_average}
              </p>
              <p className="movie__row">{heart}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
