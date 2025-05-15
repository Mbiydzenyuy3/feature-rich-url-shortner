import LandingHeader from "../components/LandingHeader";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
export default function LandingPage() {
  return (
    <>
      <LandingHeader />
      <div className="landing-page">
        <h1 className="main-heading">
          Welcome to shortening your long links with Shortlynk
        </h1>
        <div className="container">
          <p>
            ShortURL is a free tool to shorten URLs and generate short links URL
            shortener <br /> allows to create a shortened link making it easy to
            share
          </p>
        </div>
        <div className="btns">
          <Link to="/register">
            {" "}
            <button className="btn register">Get Started</button>
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
}
