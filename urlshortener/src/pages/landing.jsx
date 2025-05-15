import LandingHeader from "../components/LandingHeader";
import Footer from "../components/Footer";
// import { useNavigate} from "react-router-dom"
export default function LandingPage() {
  // const navigate = useNavigate();

  return (
    <>
      <LandingHeader />
      <div className="landing-page">
        <h1 className="main-heading">
          Welcome to shortening your long links white Shortlynk
        </h1>
        <div className="container">
          <p>
            ShortURL is a free tool to shorten URLs and generate short links URL
            shortener <br /> allows to create a shortened link making it easy to
            share
          </p>
          {/* <form action="">
            <input type="text" className="input" placeholder="Enter long url" />
            <button className="submit" type="submit">
              {" "}
              Shorten
            </button>
          </form> */}
        </div>
      </div>
      <div className="btns">
        <button className="btn register">Create account</button>
        <button className="btn login">Login</button>
      </div>
      <Footer />
    </>
  );
}
