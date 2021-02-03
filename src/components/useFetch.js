import React from "react";

const useFetch = function (url, options) {
  const [response, setResponse] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(function () {
    const fetchData = async () => {
      try {
        const res = await fetch(url, options);
        const json = await res.json();
        setResponse(json);
      } catch (error) {
        setError(error);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  return { response, error };
};

export default useFetch;
