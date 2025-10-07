// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import "./Sidebar.css";

// const Sidebar = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleSidebar = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <>
//       <div className={`sidebar ${isOpen ? "open" : ""}`}>
//         <Link to="/" onClick={toggleSidebar}>Home</Link>
//         <Link to="/about" onClick={toggleSidebar}>About</Link>
//         <Link to="/contact" onClick={toggleSidebar}>Contact</Link>
//       </div>
//       <button onClick={toggleSidebar} className="toggle-btn">
//         {isOpen ? "☰" : "☰"}
//       </button>

//     </>
//   );
// };

// export default Sidebar;
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  // Sidebar links
  const links = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  // Filter links based on search term
  const filteredLinks = links.filter((link) =>
    link.name.toLowerCase().includes(searchTerm)
  );

  return (
    <>

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />

        {/* Links */}
        {filteredLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            onClick={toggleSidebar} // Close sidebar after navigation
          >
            {link.name}
          </Link>
        ))}

        {/* Show message if no links match */}
        {filteredLinks.length === 0 && (
          <p className="no-result">No pages found</p>
        )}
      </div>
      <button onClick={toggleSidebar} className="toggle-btn">
        {isOpen ? "☰" : "☰"}
      </button>
    </>
  );
};

export default Sidebar;
