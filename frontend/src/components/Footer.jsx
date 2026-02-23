import { FaHeart, FaInstagram, FaTwitter, FaGithub } from "react-icons/fa";
import "./Footer.css";

export default function Footer() {
    return (
        <footer className="wh-footer">
            <div className="wh-footer-inner">
                <div className="wh-footer-grid">
                    <div className="wh-footer-col">
                        <h4>WanderHome</h4>
                        <p className="wh-footer-desc">
                            Discover unique stays and unforgettable experiences around the globe.
                        </p>
                        <div className="wh-footer-socials">
                            <a href="#"><FaInstagram /></a>
                            <a href="#"><FaTwitter /></a>
                            <a href="#"><FaGithub /></a>
                        </div>
                    </div>
                    <div className="wh-footer-col">
                        <h5>Explore</h5>
                        <a href="#">Trending</a>
                        <a href="#">Iconic Cities</a>
                        <a href="#">Mountains</a>
                        <a href="#">Beaches</a>
                    </div>
                    <div className="wh-footer-col">
                        <h5>Host</h5>
                        <a href="#">List your Home</a>
                        <a href="#">Responsible hosting</a>
                        <a href="#">Resources</a>
                    </div>
                    <div className="wh-footer-col">
                        <h5>Support</h5>
                        <a href="#">Help Centre</a>
                        <a href="#">Safety</a>
                        <a href="#">Cancellation</a>
                    </div>
                </div>
                <div className="wh-footer-bottom">
                    <p>
                        © 2026 WanderHome, Inc. · Made with{" "}
                        <FaHeart className="wh-footer-heart" /> by Lavkush
                    </p>
                </div>
            </div>
        </footer>
    );
}
