import { useContext } from "react";
import { Alert, Button, Form, Row, Col, Container, Card } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const {
    loginUser,
    loginError,
    loginInfo,
    updateLoginInfo,
    isLoginLoading,
  } = useContext(AuthContext);

  return (
    <Container fluid className="bg-light">
      <Row 
        style={{
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Col xs={12} md={6} lg={4}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2 className="fw-bold">Welcome Back</h2>
                <p className="text-muted">Please enter your credentials to login</p>
              </div>
              
              <Form onSubmit={loginUser}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    onChange={(e) =>
                      updateLoginInfo({ ...loginInfo, email: e.target.value })
                    }
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    onChange={(e) =>
                      updateLoginInfo({ ...loginInfo, password: e.target.value })
                    }
                    required
                  />
                  <div className="d-flex justify-content-end mt-1">
                    <a href="#" className="text-decoration-none small">Forgot password?</a>
                  </div>
                </Form.Group>
                
                {loginError?.error && (
                  <Alert variant="danger" className="mb-3">
                    <p className="mb-0">{loginError?.message}</p>
                  </Alert>
                )}
                
                <div className="d-grid gap-2">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    size="lg" 
                    className="mb-3"
                    disabled={isLoginLoading}
                  >
                    {isLoginLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </div>
              </Form>
              
              <div className="text-center mt-3">
                <p className="mb-0">
                  Don't have an account? <a href="/register" className="text-decoration-none">Register</a>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;