import { NavLink } from "react-router-dom";

function NavBar() {
  return (
    <div className="top-bar">
      <nav className="site-nav" aria-label="Main navigation">
        <ul>
          <li>
            <NavLink to="/" end className="nav-link home-link">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/extension" className="nav-link extension-link">
              Extension
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default NavBar;
