import { Container, Nav, Navbar, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import NotificationAlert  from "./chat/NotificationAlert";

const NavBar = () => {
  const { user, logoutUser } = useContext(AuthContext);

  const confirmLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logoutUser();
    }
  };

  return (
    <Navbar
      className="mb-4"
      style={{
        height: "3.75rem",
        backgroundColor: "#3498db",
      }}
    >
      <Container>
        <h2>
          <Link
            to="/"
            className="link-light text-decoration-none"
            style={{
              fontWeight: "bold",
            }}
          >
            WeChatApp
          </Link>
        </h2>
        <span
          className="text-warning"
          style={{
            fontSize: "1rem",
            fontWeight: "500",
          }}
        >
          {user ? `Logged in as ${user.name}` : "Not logged in"}
        </span>
        <Nav>
          <Stack direction="horizontal" gap={3}>
            {user ? (
              <>
                <NotificationAlert />
                <Link
                  onClick={confirmLogout}
                  to="/login"
                  className="link-light text-decoration-none"
                  style={{
                    fontSize: "1rem",
                    textDecoration: "underline",
                  }}
                >
                  Logout
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="link-light text-decoration-none"
                  style={{
                    fontSize: "1rem",
                  }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="link-light text-decoration-none"
                  style={{
                    fontSize: "1rem",
                  }}
                >
                  Register
                </Link>
              </>
            )}
          </Stack>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBar;