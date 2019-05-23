var appconstants = {};

if (process.env.NODE_ENV === "production") {
  appconstants = {
    base_url: "https://nepsanjaal.herokuapp.com/api"
  };
} else {
  appconstants = {
    base_url: "http://localhost:8080/api"
  };
}

export default appconstants;