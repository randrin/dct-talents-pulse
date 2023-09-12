import dotenv from "dotenv";

dotenv.config();

const config = {
  API_URL: process.env.REACT_APP_API,
  API_KEY_COUNTRIES: process.env.REACT_APP_API_KEY_COUNTRIES,
};

export default config;
