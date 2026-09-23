import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    employeeId: "",
    company: "",
    designation: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/register", formData);
      setMessage(response.data.message);

      setFormData({
        name: "",
        email: "",
        password: "",
        employeeId: "",
        company: "",
        designation: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.glow}></div>

      <div style={styles.card}>
        <div style={styles.innerCard}>

          {/* EV Logo */}
          <div style={styles.logoOuter}>
            <div style={styles.logo}>EV</div>
          </div>

          {/* Header */}
          <div style={styles.header}>
            <h1 style={styles.title}>
              Employee Verification
            </h1>
            <p style={styles.subtitle}>
              Secure Credential & Background Verification
            </p>
          </div>

          <div style={styles.divider}></div>

          {/* Heading */}
          <h2 style={styles.heading}>
            Create Account
          </h2>

          <p style={styles.description}>
            Register as an employee to submit verification requests.
          </p>

          {/* Success */}
          {message && (
            <div style={styles.success}>
              ✓ {message}
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Full Name */}
            <div style={styles.field}>
              <label style={styles.label}>
                Full Name
              </label>

              <div style={styles.inputWrapper}>
                <span style={styles.icon}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="8" r="3.5" />
                    <path d="M5 20c.8-3.4 3.1-5 7-5s6.2 1.6 7 5" />
                  </svg>
                </span>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  style={styles.input}
                />
              </div>
            </div>

            {/* Email */}
            <div style={styles.field}>
              <label style={styles.label}>
                Email Address
              </label>

              <div style={styles.inputWrapper}>
                <span style={styles.icon}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="M3 7l9 6 9-6" />
                  </svg>
                </span>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  style={styles.input}
                />
              </div>
            </div>

            {/* Password */}
            <div style={styles.field}>
              <label style={styles.label}>
                Password
              </label>

              <div style={styles.inputWrapper}>
                <span style={styles.icon}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="5" y="10" width="14" height="10" rx="2" />
                    <path d="M8 10V7a4 4 0 018 0v3" />
                  </svg>
                </span>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  minLength="6"
                  required
                  style={styles.input}
                />
              </div>
            </div>

            {/* Employee ID */}
            <div style={styles.field}>
              <label style={styles.label}>
                Employee ID
              </label>

              <div style={styles.inputWrapper}>
                <span style={styles.icon}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="4" y="4" width="16" height="16" rx="2" />
                    <path d="M8 9h8M8 13h5M8 17h3" />
                  </svg>
                </span>

                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  placeholder="Example: EMP010"
                  required
                  style={styles.input}
                />
              </div>
            </div>

            {/* Company */}
            <div style={styles.field}>
              <label style={styles.label}>
                Company
              </label>

              <div style={styles.inputWrapper}>
                <span style={styles.icon}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 20V7l8-4 8 4v13" />
                    <path d="M8 20v-5h8v5M8 9h2M14 9h2M8 12h2M14 12h2" />
                  </svg>
                </span>

                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  required
                  style={styles.input}
                />
              </div>
            </div>

            {/* Designation */}
            <div style={styles.field}>
              <label style={styles.label}>
                Designation
              </label>

              <div style={styles.inputWrapper}>
                <span style={styles.icon}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="6" width="18" height="13" rx="2" />
                    <path d="M9 6V4h6v2M8 11h8M10 15h4" />
                  </svg>
                </span>

                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="Example: Software Developer"
                  required
                  style={styles.input}
                />
              </div>
            </div>

            {/* Create Account */}
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>

          {/* Login Link */}
          <div style={styles.loginText}>
            <span>
              Already have an account?
            </span>

            <Link
              to="/login"
              style={styles.link}
            >
              Sign in
            </Link>
          </div>

          {/* Security */}
          <div style={styles.security}>
            <span style={styles.lock}>🔒</span>
            Your information is securely protected
          </div>

        </div>
      </div>

      <div style={styles.star}>✦</div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "15px 20px",
    boxSizing: "border-box",
    background: "radial-gradient(circle at 50% 15%, #121923 0%, #06080b 38%, #000000 75%)",
    position: "relative",
    overflow: "hidden",
  },

  glow: {
    position: "absolute",
    width: "420px",
    height: "420px",
    top: "-230px",
    left: "50%",
    transform: "translateX(-50%)",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(45,100,190,0.22), transparent 68%)",
    pointerEvents: "none",
  },

  card: {
    width: "100%",
    maxWidth: "540px",
    background: "linear-gradient(145deg, #222222, #0d0d0d)",
    border: "1px solid #414141",
    borderRadius: "15px",
    padding: "15px",
    boxSizing: "border-box",
    position: "relative",
    zIndex: 2,
    boxShadow: "0 20px 55px rgba(0,0,0,0.8)",
  },

  innerCard: {
    position: "relative",
    border: "1px solid #383838",
    borderRadius: "14px",
    padding: "48px 27px 20px",
    background: "linear-gradient(180deg, #151515, #080808)",
    boxSizing: "border-box",
    boxShadow: "inset 0 0 30px rgba(0,0,0,0.45)",
  },

  logoOuter: {
    position: "absolute",
    top: "-37px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "radial-gradient(circle, rgba(50,100,190,0.6), transparent 70%)",
    boxShadow: "0 0 20px rgba(50,110,220,0.65)",
  },

  logo: {
    width: "54px",
    height: "54px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "radial-gradient(circle at 35% 30%, #4776b8, #142b4d)",
    border: "2px solid #4d75ad",
    color: "#75a9ff",
    fontSize: "18px",
    fontWeight: "700",
    letterSpacing: "1px",
    boxShadow: "inset 0 0 15px rgba(255,255,255,0.08)",
  },

  header: {
    textAlign: "center",
  },

  title: {
    margin: "0",
    color: "#f4f4f4",
    fontSize: "23px",
    fontWeight: "700",
    letterSpacing: "-0.5px",
  },

  subtitle: {
    margin: "7px 0 0",
    color: "#929292",
    fontSize: "12px",
    lineHeight: "1.4",
  },

  divider: {
    height: "1px",
    background: "linear-gradient(90deg, transparent, #353535, transparent)",
    margin: "23px 0 25px",
  },

  heading: {
    margin: "0",
    color: "#eeeeee",
    fontSize: "22px",
    fontWeight: "650",
    textAlign: "center",
  },

  description: {
    margin: "7px 0 20px",
    color: "#909090",
    fontSize: "13px",
    lineHeight: "1.4",
    textAlign: "center",
  },

  field: {
    marginBottom: "11px",
  },

  label: {
    display: "block",
    marginBottom: "5px",
    color: "#dddddd",
    fontSize: "13px",
    fontWeight: "600",
  },

  inputWrapper: {
    position: "relative",
    width: "100%",
  },

  icon: {
    position: "absolute",
    left: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#858585",
    display: "flex",
    alignItems: "center",
    zIndex: 1,
  },

  input: {
    width: "100%",
    height: "43px",
    padding: "0 14px 0 52px",
    boxSizing: "border-box",
    border: "1px solid #555555",
    borderRadius: "9px",
    outline: "none",
    background: "linear-gradient(180deg, #292929, #202020)",
    color: "#ffffff",
    fontSize: "13px",
    boxShadow: "inset 0 2px 7px rgba(0,0,0,0.4)",
  },

  success: {
    padding: "10px 12px",
    marginBottom: "13px",
    borderRadius: "8px",
    background: "#0b2415",
    border: "1px solid #14532d",
    color: "#4ade80",
    textAlign: "center",
    fontSize: "12px",
  },

  error: {
    padding: "10px 12px",
    marginBottom: "13px",
    borderRadius: "8px",
    background: "#2a1010",
    border: "1px solid #702020",
    color: "#ff7777",
    textAlign: "center",
    fontSize: "12px",
  },

  button: {
    width: "100%",
    height: "48px",
    marginTop: "5px",
    border: "1px solid #ef403a",
    borderRadius: "9px",
    background: "linear-gradient(180deg, #f13b36, #d31f1b)",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 5px 15px rgba(220,35,30,0.3)",
  },

  loginText: {
    marginTop: "15px",
    textAlign: "center",
    color: "#909090",
    fontSize: "13px",
  },

  link: {
    display: "block",
    marginTop: "6px",
    color: "#4da3ff",
    fontSize: "15px",
    fontWeight: "700",
    textDecoration: "none",
  },

  security: {
    marginTop: "13px",
    paddingTop: "9px",
    borderTop: "1px solid #2d2d2d",
    textAlign: "center",
    color: "#999999",
    fontSize: "11px",
  },

  lock: {
    marginRight: "4px",
  },

  star: {
    position: "absolute",
    right: "7%",
    bottom: "8%",
    color: "#eeeeee",
    fontSize: "30px",
    opacity: 0.7,
    zIndex: 1,
  },
};

export default Register;