import axios from "axios";

export const switcheoClient = axios.create({
  baseURL: "https://interview.switcheo.com/",
});
