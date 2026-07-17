import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h2 className="gradient-text font-main" style={{ fontSize: '1.6rem', fontWeight: '700', letterSpacing: '0.05em' }}>TRINETHRA <span style={{ fontSize: '0.9rem', fontWeight: '700', letterSpacing: '0.1em', color: 'var(--primary)' }}>v3</span></h2>
        </Link>
      </div>
      <div className="nav-links">
        <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
        <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>About</Link>
        <Link to="/explore" className={`nav-link ${isActive('/explore') ? 'active' : ''}`}>Explore</Link>
        <Link to="/version-1" className={`nav-link ${isActive('/version-1') ? 'active' : ''}`}>v1.0</Link>
        <Link to="/version-2" className={`nav-link ${isActive('/version-2') ? 'active' : ''}`}>v2.0</Link>
        <Link to="/upcoming" className={`nav-link ${isActive('/upcoming') ? 'active' : ''}`}>Upcoming</Link>
      </div>
    </nav>
  );
}
