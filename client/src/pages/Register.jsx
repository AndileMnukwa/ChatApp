import { useContext } from "react";
import { Alert, Button, Form, Row, Col, Container, Card } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const { 
    registerInfo, 
    updateRegisterInfo, 
    registerUser, 
    registerError, 
    isRegisterLoading 
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
                <h2 className="fw-bold">Create Account</h2>
                <p className="text-muted">Please fill in your details to register</p>
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
                    Password must be at least 8 characters long
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
                    className="mb-3"
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
              
              <div className="text-center mt-3">
                <p className="mb-0">
                  Already have an account? <a href="/login" className="text-decoration-none">Sign in</a>
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