import { Link } from "react-router-dom";
import { FaHeart, FaInstagram, FaTwitter, FaGithub, FaGlobe } from "react-icons/fa";
import { TbHomeSpark } from "react-icons/tb";
import "./Footer.css";

export default function Footer() {
    return (
        <footer className="wh-footer">
            <div className="wh-footer-inner">
                <div className="wh-footer-grid">
                    <div className="wh-footer-col">
                        <div className="wh-footer-brand">
                            <TbHomeSpark className="wh-footer-logo" />
                            <span>farebnb</span>
                        </div>
                        <p className="wh-footer-desc">
                            Discover luxury stays, beachside villas, mountain chalets, and unforgettable travel experiences across the globe.
                        </p>
                        <div className="wh-footer-socials">
                            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub"><FaGithub /></a>
                            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter"><FaTwitter /></a>
                            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a>
                        </div>
                    </div>
                    <div className="wh-footer-col">
                        <h5>Explore Stays</h5>
                        <Link to="/?category=Trending">Trending</Link>
                        <Link to="/?category=Beachfront">Beachfront</Link>
                        <Link to="/?category=Mountains">Mountains</Link>
                        <Link to="/?category=Castles">Castles & Villas</Link>
                    </div>
                    <div className="wh-footer-col">
                        <h5>Hosting</h5>
                        <Link to="/listings/new">Airbnb your home</Link>
                        <Link to="/host/listings">Host Dashboard</Link>
                        <Link to="/host/listings">Community Forum</Link>
                    </div>
                    <div className="wh-footer-col">
                        <h5>Support & Trust</h5>
                        <Link to="/">Help Centre</Link>
                        <Link to="/">AirCover protection</Link>
                        <Link to="/">Cancellation options</Link>
                    </div>
                </div>
                <div className="wh-footer-bottom">
                    <div className="wh-footer-copy">
                        © 2026 Farebnb, Inc. · Privacy · Terms · Sitemap · Company details
                    </div>
                    <div className="wh-footer-lang-curr">
                        <span><FaGlobe /> English (IN)</span>
                        <span>₹ INR</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
