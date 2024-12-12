import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import "./style/style.css";

function Footer() {
  return (
    <footer className=" text-center text-lg-start">
      <div className="container-fluid p-4">
        {/* About Section */}
        <div className="row mb-3">
          <div className="col-12 text-start">
            <h5 className="text-uppercase">About FbScore</h5>
            <p>
              FbScore provides live scores, match updates, and team details to
              keep you connected to the game you love.
            </p>
          </div>
        </div>

        <hr className="my-4" />

        {/* Follow Us Section */}
        <div className="row">
          <div className="col-12 text-center">
            <h5 className="text-uppercase">Follow Us</h5>
            <a
              href="https://facebook.com"
              className="text-dark me-4"
              aria-label="Facebook"
            >
              <i className="fa-brands fa-facebook"></i>
            </a>
            <a
              href="https://twitter.com"
              className="text-dark me-4"
              aria-label="Twitter"
            >
              <i className="fa-brands fa-x-twitter"></i>
            </a>
            <a
              href="https://instagram.com"
              className="text-dark me-4"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="text-center p-3" style={{ backgroundColor: "#F5F5F5" }}>
        © 2024 FbScore | All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
