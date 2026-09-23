import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Login failed"
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

          {/* ================= LOGO ================= */}

          <div style={styles.logoOuter}>
            <div style={styles.logo}>EV</div>
          </div>

          {/* ================= HEADER ================= */}

          <div style={styles.header}>
            <h1 style={styles.title}>
              Employee Verification
            </h1>

            <p style={styles.subtitle}>
              Secure Credential & Background Verification
            </p>
          </div>

          <div style={styles.divider}></div>

          {/* ================= LOGIN ================= */}

          <h2 style={styles.heading}>
            Welcome Back
          </h2>

          <p style={styles.description}>
            Sign in to access your verification dashboard.
          </p>

          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>

            {/* EMAIL */}

            <div style={styles.field}>
              <label style={styles.label}>
                Email Address
              </label>

              <div style={styles.inputWrapper}>
                <span style={styles.icon}>
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <rect
                      x="3"
                      y="5"
                      width="18"
                      height="14"
                      rx="2"
                    />

                    <path d="M3 7l9 6 9-6" />
                  </svg>
                </span>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                  style={styles.input}
                />
              </div>
            </div>

            {/* PASSWORD */}

            <div style={styles.field}>
              <label style={styles.label}>
                Password
              </label>

              <div style={styles.inputWrapper}>
                <span style={styles.icon}>
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <rect
                      x="5"
                      y="10"
                      width="14"
                      height="10"
                      rx="2"
                    />

                    <path d="M8 10V7a4 4 0 018 0v3" />
                  </svg>
                </span>

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                  style={styles.input}
                />
              </div>
            </div>

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading
                ? "Signing In..."
                : "Sign In"}
            </button>
          </form>

          {/* ================= REGISTER ================= */}

          <div style={styles.registerText}>
            <span>
              Don't have an account?
            </span>

            <Link
              to="/register"
              style={styles.link}
            >
              Create an account
            </Link>
          </div>

          {/* ================= PUBLIC VERIFICATION ================= */}

          <div style={styles.verifySection}>

            <div style={styles.verifyDivider}>
  <span style={styles.verifyLine}></span>

  <span style={styles.orText}>OR</span>

  <span style={styles.verifyLine}></span>
</div>

            <button
              type="button"
              onClick={() => navigate("/verify")}
              style={styles.verifyButton}
            >
              <span style={styles.verifyIcon}>
                ✓
              </span>

              Verify Employee Credential
            </button>

            <p style={styles.verifyDescription}>
              Verify an employee credential using
              blockchain technology
            </p>

          </div>

          {/* ================= SECURITY ================= */}

          <div style={styles.security}>
            <span style={styles.lock}>
              🔒
            </span>

            Secure authentication
          </div>

        </div>
      </div>

      <div style={styles.star}>
        ✦
      </div>
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
    padding: "20px",
    boxSizing: "border-box",
    background:
      "radial-gradient(circle at 50% 15%, #121923 0%, #06080b 38%, #000000 75%)",
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
    background:
      "radial-gradient(circle, rgba(45,100,190,0.22), transparent 68%)",
    pointerEvents: "none",
  },

  card: {
    width: "100%",
    maxWidth: "520px",
    background:
      "linear-gradient(145deg, #222222, #0d0d0d)",
    border: "1px solid #414141",
    borderRadius: "15px",
    padding: "16px",
    boxSizing: "border-box",
    position: "relative",
    zIndex: 2,
    boxShadow:
      "0 20px 55px rgba(0,0,0,0.8)",
  },

  innerCard: {
    position: "relative",
    border: "1px solid #383838",
    borderRadius: "14px",
    padding: "50px 28px 20px",
    background:
      "linear-gradient(180deg, #151515, #080808)",
    boxSizing: "border-box",
    boxShadow:
      "inset 0 0 30px rgba(0,0,0,0.45)",
  },

  logoOuter: {
    position: "absolute",
    top: "-38px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "radial-gradient(circle, rgba(50,100,190,0.6), transparent 70%)",
    boxShadow:
      "0 0 20px rgba(50,110,220,0.65)",
  },

  logo: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "radial-gradient(circle at 35% 30%, #4776b8, #142b4d)",
    border: "2px solid #4d75ad",
    color: "#75a9ff",
    fontSize: "19px",
    fontWeight: "700",
    letterSpacing: "1px",
    boxShadow:
      "inset 0 0 15px rgba(255,255,255,0.08)",
  },

  header: {
    textAlign: "center",
  },

  title: {
    margin: "0",
    color: "#f4f4f4",
    fontSize: "24px",
    fontWeight: "700",
    letterSpacing: "-0.5px",
  },

  subtitle: {
    margin: "7px 0 0",
    color: "#929292",
    fontSize: "13px",
    lineHeight: "1.4",
  },

  divider: {
    height: "1px",
    background:
      "linear-gradient(90deg, transparent, #353535, transparent)",
    margin: "25px 0 27px",
  },

  heading: {
    margin: "0",
    color: "#eeeeee",
    fontSize: "23px",
    fontWeight: "650",
    textAlign: "center",
  },

  description: {
    margin: "7px 0 25px",
    color: "#909090",
    fontSize: "13px",
    lineHeight: "1.4",
    textAlign: "center",
  },

  field: {
    marginBottom: "15px",
  },

  label: {
    display: "block",
    marginBottom: "6px",
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
    height: "48px",
    padding: "0 14px 0 52px",
    boxSizing: "border-box",
    border: "1px solid #555555",
    borderRadius: "10px",
    outline: "none",
    background:
      "linear-gradient(180deg, #292929, #202020)",
    color: "#ffffff",
    fontSize: "14px",
    boxShadow:
      "inset 0 2px 7px rgba(0,0,0,0.4)",
  },

  button: {
    width: "100%",
    height: "51px",
    marginTop: "3px",
    border: "1px solid #ef403a",
    borderRadius: "10px",
    background:
      "linear-gradient(180deg, #f13b36, #d31f1b)",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow:
      "0 5px 15px rgba(220,35,30,0.3)",
  },

  error: {
    padding: "10px 12px",
    marginBottom: "15px",
    borderRadius: "8px",
    background: "#2a1010",
    border: "1px solid #702020",
    color: "#ff7777",
    textAlign: "center",
    fontSize: "12px",
  },

  registerText: {
    marginTop: "18px",
    textAlign: "center",
    color: "#909090",
    fontSize: "13px",
  },

  link: {
    display: "block",
    marginTop: "7px",
    color: "#4da3ff",
    fontSize: "15px",
    fontWeight: "700",
    textDecoration: "none",
  },

  /* ================= PUBLIC VERIFY ================= */

  verifySection: {
    marginTop: "20px",
    textAlign: "center",
  },

  verifyDivider: {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "12px",
  margin: "20px 0 16px",
  boxSizing: "border-box",
},

verifyLine: {
  flex: 1,
  height: "1px",
  background:
    "linear-gradient(90deg, transparent, #353535)",
},

orText: {
  color: "#777777",
  fontSize: "10px",
  fontWeight: "600",
  letterSpacing: "1px",
  whiteSpace: "nowrap",
},
  verifyIcon: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "7px",
    background: "#142b4d",
    border: "1px solid #4d75ad",
    color: "#69b4ff",
    fontSize: "11px",
    fontWeight: "700",
  },

  verifyButton: {
    width: "100%",
    height: "43px",
    borderRadius: "9px",
    border: "1px solid #315b86",
    background:
      "linear-gradient(180deg, #142b45, #0d1b2b)",
    color: "#69b4ff",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow:
      "0 5px 16px rgba(30,90,160,0.16)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  verifyDescription: {
    margin: "7px 0 0",
    color: "#5f5f5f",
    fontSize: "9px",
  },

  security: {
    marginTop: "16px",
    paddingTop: "11px",
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

export default Login;