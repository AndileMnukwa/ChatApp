import { useContext } from "react";
import { Alert, Button, Form, Row, Col, Container, Card } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Register = () => {
  const { 
    registerInfo, 
    updateRegisterInfo, 
    registerUser, 
    registerError, 
    isRegisterLoading 
  } = useContext(AuthContext);
  
  return (
    <Container fluid className="py-5">
      <Row 
        style={{
          minHeight: "80vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Col xs={12} md={6} lg={5} xl={4}>
          <Card className="auth-card border-0 shadow-sm">
            <Card.Body>
              <div className="text-center mb-4">
                <h2 className="auth-title">Create Account</h2>
                <p className="auth-subtitle">Join WeChat and start connecting</p>
              </div>
              
              <Form onSubmit={registerUser}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your full name"
                    onChange={(e) =>
                      updateRegisterInfo({ ...registerInfo, name: e.target.value })
                    }
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    onChange={(e) =>
                      updateRegisterInfo({ ...registerInfo, email: e.target.value })
                    }
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Create a strong password"
                    onChange={(e) =>
                      updateRegisterInfo({ ...registerInfo, password: e.target.value })
                    }
                    required
                  />
                  <Form.Text className="text-muted">
                    Password must be at least 8 characters with letters, numbers and special characters
                  </Form.Text>
                </Form.Group>
                
                {registerError?.error && (
                  <Alert variant="danger" className="mb-3">
                    <p className="mb-0">{registerError?.message}</p>
                  </Alert>
                )}
                
                <div className="d-grid gap-2">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    size="lg" 
                    className="auth-btn mb-3"
                    disabled={isRegisterLoading}
                  >
                    {isRegisterLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating account...
                      </>
                    ) : (
                      "Register"
                    )}
                  </Button>
                </div>
              </Form>
              
              <div className="text-center mt-4">
                <p className="mb-0">
                  Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;