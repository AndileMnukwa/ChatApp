import { useContext, useState } from "react";
import { Alert, Button, Form, Row, Col, Container, Card } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Login = () => {
  const {
    loginUser,
    loginError,
    loginInfo,
    updateLoginInfo,
    isLoginLoading,
  } = useContext(AuthContext);

  // Add form validation state
  const [validated, setValidated] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    email: null,
    password: null
  });

  // Email validation
  const validateEmail = (email) => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return null;
  };

  // Password validation
  const validatePassword = (password) => {
    if (!password) return "Password is required";
    return null;
  };

  // Handle form field validation
  const handleChange = (e, field) => {
    const value = e.target.value;
    updateLoginInfo({ ...loginInfo, [field]: value });
    
    let error = null;
    if (field === 'email') {
      error = validateEmail(value);
    } else if (field === 'password') {
      error = validatePassword(value);
    }
    
    setValidationErrors({
      ...validationErrors,
      [field]: error
    });
  };

  // Handle form submission with validation
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const emailError = validateEmail(loginInfo.email);
    const passwordError = validatePassword(loginInfo.password);
    
    setValidationErrors({
      email: emailError,
      password: passwordError
    });
    
    // If any errors, don't submit
    if (emailError || passwordError) {
      setValidated(true);
      return;
    }
    
    // Submit the form
    loginUser(e);
  };

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
                <h2 className="auth-title">Welcome Back</h2>
                <p className="auth-subtitle">Sign in to continue to WeChat</p>
              </div>
              
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    onChange={(e) => handleChange(e, 'email')}
                    isInvalid={validated && validationErrors.email}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.email}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    onChange={(e) => handleChange(e, 'password')}
                    isInvalid={validated && validationErrors.password}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.password}
                  </Form.Control.Feedback>
                  <div className="d-flex justify-content-end mt-1">
                    <Link to="#" className="text-decoration-none small auth-link">Forgot password?</Link>
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
                    className="auth-btn mb-3"
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
              
              <div className="text-center mt-4">
                <p className="mb-0">
                  Don't have an account? <Link to="/register" className="auth-link">Register Now</Link>
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