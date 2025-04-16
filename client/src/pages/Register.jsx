import { useContext, useState } from "react";
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
  
  // Add form validation state
  const [validated, setValidated] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    name: null,
    email: null,
    password: null
  });

  // Password validation rules
  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number";
    if (!/[^A-Za-z0-9]/.test(password)) return "Password must contain at least one special character";
    return null;
  };

  // Email validation
  const validateEmail = (email) => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return null;
  };

  // Name validation
  const validateName = (name) => {
    if (!name) return "Name is required";
    if (name.length < 3) return "Name must be at least 3 characters";
    if (name.length > 30) return "Name must be less than 30 characters";
    return null;
  };

  // Handle form field validation
  const handleChange = (e, field) => {
    const value = e.target.value;
    updateRegisterInfo({ ...registerInfo, [field]: value });
    
    let error = null;
    if (field === 'password') {
      error = validatePassword(value);
    } else if (field === 'email') {
      error = validateEmail(value);
    } else if (field === 'name') {
      error = validateName(value);
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
    const nameError = validateName(registerInfo.name);
    const emailError = validateEmail(registerInfo.email);
    const passwordError = validatePassword(registerInfo.password);
    
    setValidationErrors({
      name: nameError,
      email: emailError,
      password: passwordError
    });
    
    // If any errors, don't submit
    if (nameError || emailError || passwordError) {
      setValidated(true);
      return;
    }
    
    // Submit the form
    registerUser(e);
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
                <h2 className="auth-title">Create Account</h2>
                <p className="auth-subtitle">Join WeChat and start connecting</p>
              </div>
              
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your full name"
                    onChange={(e) => handleChange(e, 'name')}
                    isInvalid={validated && validationErrors.name}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.name}
                  </Form.Control.Feedback>
                </Form.Group>
                
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
                    placeholder="Create a strong password"
                    onChange={(e) => handleChange(e, 'password')}
                    isInvalid={validated && validationErrors.password}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.password}
                  </Form.Control.Feedback>
                  <Form.Text className={validationErrors.password ? "text-danger" : "text-muted"}>
                    Password must be at least 8 characters with uppercase, lowercase, numbers and special characters
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