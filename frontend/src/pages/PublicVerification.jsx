import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function PublicVerification() {
  const navigate = useNavigate();

  const [verificationId, setVerificationId] = useState("");
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();

    setError("");
    setVerification(null);

    if (!verificationId.trim()) {
      setError("Please enter a verification ID.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.get(
        `/verifications/public/${verificationId.trim()}`
      );

      setVerification(response.data.blockchain);
    } catch (error) {
      console.error("Public verification error:", error);

      setError(
        error.response?.data?.message ||
          "Verification failed. Please check the verification ID."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Background effects */}
      <div style={styles.glowTop}></div>
      <div style={styles.glowRight}></div>

      {/* ================= HEADER ================= */}

      <header style={styles.header}>
        <div style={styles.brand}>
          <div style={styles.logo}>EV</div>

          <div>
            <h1 style={styles.brandTitle}>
              Employee Verification
            </h1>

            <p style={styles.brandSubtitle}>
              Secure Credential & Background Verification
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/login")}
          style={styles.loginButton}
        >
          Login
        </button>
      </header>

      {/* ================= MAIN ================= */}

      <main style={styles.container}>

        {/* Heading */}

        <section style={styles.hero}>
          <div style={styles.heroIcon}>
            ✓
          </div>

          <div style={styles.securityLabel}>
            PUBLIC BLOCKCHAIN VERIFICATION
          </div>

          <h2 style={styles.title}>
            Verify Employee Credentials
          </h2>

          <p style={styles.description}>
            Verify an employee's credential securely using
            the blockchain record stored by the Employee
            Verification Platform.
          </p>

          <div style={styles.secureBadge}>
            <span style={styles.greenDot}></span>
            Blockchain Network Secure
          </div>
        </section>

        {/* ================= VERIFICATION CARD ================= */}

        <section style={styles.verifyCard}>

          <div style={styles.cardHeader}>
            <div style={styles.cardIcon}>
              #
            </div>

            <div>
              <h3 style={styles.cardTitle}>
                Verification ID
              </h3>

              <p style={styles.cardSubtitle}>
                Enter the unique ID associated with the
                employee verification record.
              </p>
            </div>
          </div>

          <div style={styles.divider}></div>

          <form onSubmit={handleVerify}>

            <label style={styles.label}>
              VERIFICATION ID
            </label>

            <div style={styles.inputContainer}>

              <span style={styles.inputPrefix}>
                ID
              </span>

              <input
                type="text"
                value={verificationId}
                onChange={(e) =>
                  setVerificationId(e.target.value)
                }
                placeholder="Enter verification ID"
                style={styles.input}
                autoComplete="off"
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.verifyButton,
                ...(loading
                  ? styles.disabledButton
                  : {}),
              }}
            >
              {loading ? (
                <>
                  <span style={styles.spinner}>
                    ◌
                  </span>

                  Verifying Blockchain Record...
                </>
              ) : (
                <>
                  <span>✓</span>

                  Verify Employee
                </>
              )}
            </button>

          </form>

          {/* Error */}

          {error && (
            <div style={styles.errorBox}>
              <div style={styles.errorIcon}>
                !
              </div>

              <div>
                <h4 style={styles.errorTitle}>
                  Verification Failed
                </h4>

                <p style={styles.errorText}>
                  {error}
                </p>
              </div>
            </div>
          )}

        </section>

        {/* ================= RESULT ================= */}

        {verification && (
          <section style={styles.resultCard}>

            {/* Result heading */}

            <div style={styles.resultHeader}>

              <div style={styles.resultLeft}>

                <div style={styles.successIcon}>
                  ✓
                </div>

                <div>
                  <p style={styles.resultLabel}>
                    VERIFICATION SUCCESSFUL
                  </p>

                  <h2 style={styles.resultTitle}>
                    Employee Verified
                  </h2>
                </div>

              </div>

              <div style={styles.verifiedBadge}>
                <span style={styles.greenDot}></span>
                VERIFIED
              </div>

            </div>

            <div style={styles.divider}></div>

            {/* Details */}

            <div style={styles.detailsGrid}>

              <div style={styles.detailBox}>
                <span style={styles.detailLabel}>
                  VERIFICATION ID
                </span>

                <span style={styles.detailValue}>
                  {verification.verificationId}
                </span>
              </div>

              <div style={styles.detailBox}>
                <span style={styles.detailLabel}>
                  EMPLOYEE ID
                </span>

                <span style={styles.detailValue}>
                  {verification.employeeId}
                </span>
              </div>

              <div style={styles.detailBoxFull}>
                <span style={styles.detailLabel}>
                  DATA HASH
                </span>

                <span style={styles.hashValue}>
                  {verification.dataHash}
                </span>
              </div>

              <div style={styles.detailBoxFull}>
                <span style={styles.detailLabel}>
                  BLOCKCHAIN ADDRESS
                </span>

                <span style={styles.hashValue}>
                  {verification.verifiedBy}
                </span>
              </div>

              <div style={styles.detailBox}>
                <span style={styles.detailLabel}>
                  VERIFIED AT
                </span>

                <span style={styles.detailValue}>
                  {new Date(
                    Number(
                      verification.verifiedAt
                    ) * 1000
                  ).toLocaleString()}
                </span>
              </div>

              {verification.blockchainHash && (
                <div style={styles.detailBox}>
                  <span style={styles.detailLabel}>
                    TRANSACTION HASH
                  </span>

                  <span style={styles.hashValue}>
                    {verification.blockchainHash}
                  </span>
                </div>
              )}

            </div>

            {/* Blockchain confirmation */}

            <div style={styles.blockchainBox}>

              <div style={styles.blockchainLeft}>

                <div style={styles.chainIcon}>
                  ⛓
                </div>

                <div>
                  <h4 style={styles.blockchainTitle}>
                    Blockchain Record Confirmed
                  </h4>

                  <p style={styles.blockchainText}>
                    The verification record exists on the
                    blockchain and can be independently verified.
                  </p>
                </div>

              </div>

              <div style={styles.confirmed}>
                ✓ CONFIRMED
              </div>

            </div>

          </section>
        )}

        {/* ================= INFO CARDS ================= */}

        <section style={styles.infoGrid}>

          <div style={styles.infoCard}>
            <div style={styles.infoIcon}>
              ⛓
            </div>

            <h3 style={styles.infoTitle}>
              Blockchain Secured
            </h3>

            <p style={styles.infoText}>
              Verification records are secured using
              blockchain technology.
            </p>
          </div>

          <div style={styles.infoCard}>
            <div style={styles.infoIcon}>
              ✓
            </div>

            <h3 style={styles.infoTitle}>
              Independent Verification
            </h3>

            <p style={styles.infoText}>
              Credential information can be checked
              without employee login access.
            </p>
          </div>

          <div style={styles.infoCard}>
            <div style={styles.infoIcon}>
              🔒
            </div>

            <h3 style={styles.infoTitle}>
              Tamper Resistant
            </h3>

            <p style={styles.infoText}>
              Blockchain records provide an immutable
              verification reference.
            </p>
          </div>

        </section>

      </main>

      {/* ================= FOOTER ================= */}

      <footer style={styles.footer}>

        <span>
          🔒 Secure Employee Verification Platform
        </span>

        <span>
          Powered by Blockchain Technology
        </span>

      </footer>

    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    background:
      "radial-gradient(circle at 50% 0%, #111923 0%, #06080b 38%, #000000 78%)",
    color: "#ffffff",
    position: "relative",
    overflow: "hidden",
    boxSizing: "border-box",
    paddingBottom: "35px",
  },

  glowTop: {
    position: "fixed",
    width: "550px",
    height: "550px",
    top: "-380px",
    left: "50%",
    transform: "translateX(-50%)",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(40,100,190,0.20), transparent 68%)",
    pointerEvents: "none",
  },

  glowRight: {
    position: "fixed",
    width: "400px",
    height: "400px",
    right: "-250px",
    top: "35%",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(40,80,160,0.12), transparent 68%)",
    pointerEvents: "none",
  },

  header: {
    height: "76px",
    padding: "0 6%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid #252525",
    background: "rgba(8,8,8,0.94)",
    backdropFilter: "blur(15px)",
    position: "relative",
    zIndex: 5,
    boxSizing: "border-box",
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
  },

  logo: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "radial-gradient(circle at 35% 30%, #4776b8, #142b4d)",
    border: "1px solid #4d75ad",
    color: "#75a9ff",
    fontSize: "13px",
    fontWeight: "700",
    letterSpacing: "1px",
    boxShadow:
      "0 0 14px rgba(50,110,220,0.45)",
  },

  brandTitle: {
    margin: 0,
    fontSize: "17px",
    color: "#eeeeee",
  },

  brandSubtitle: {
    margin: "3px 0 0",
    fontSize: "10px",
    color: "#777777",
  },

  loginButton: {
    height: "36px",
    padding: "0 17px",
    borderRadius: "7px",
    border: "1px solid #4a4a4a",
    background: "#171717",
    color: "#d5d5d5",
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: "600",
  },

  container: {
    width: "92%",
    maxWidth: "820px",
    margin: "0 auto",
    paddingTop: "45px",
    position: "relative",
    zIndex: 2,
  },

  hero: {
    textAlign: "center",
    marginBottom: "28px",
  },

  heroIcon: {
    width: "48px",
    height: "48px",
    margin: "0 auto 13px",
    borderRadius: "13px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(145deg, #142f4f, #0c1725)",
    border: "1px solid #315b86",
    color: "#69b4ff",
    fontSize: "22px",
    fontWeight: "700",
    boxShadow:
      "0 0 22px rgba(55,130,230,0.18)",
  },

  securityLabel: {
    color: "#4d9cff",
    fontSize: "9px",
    fontWeight: "700",
    letterSpacing: "2px",
  },

  title: {
    margin: "7px 0 0",
    color: "#f1f1f1",
    fontSize: "30px",
    fontWeight: "700",
  },

  description: {
    maxWidth: "600px",
    margin: "9px auto 12px",
    color: "#808080",
    fontSize: "12px",
    lineHeight: "1.7",
  },

  secureBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    padding: "6px 11px",
    borderRadius: "20px",
    border: "1px solid #244a35",
    background: "#0c1b13",
    color: "#54d889",
    fontSize: "9px",
    fontWeight: "600",
  },

  greenDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#43d47a",
    boxShadow: "0 0 8px #43d47a",
  },

  verifyCard: {
    padding: "25px",
    border: "1px solid #363636",
    borderRadius: "14px",
    background:
      "linear-gradient(145deg, rgba(24,24,24,0.98), rgba(8,8,8,0.98))",
    boxShadow: "0 20px 50px rgba(0,0,0,0.30)",
  },

  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  cardIcon: {
    width: "38px",
    height: "38px",
    borderRadius: "9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#101d2d",
    border: "1px solid #244b73",
    color: "#55aaff",
    fontSize: "17px",
    fontWeight: "700",
  },

  cardTitle: {
    margin: 0,
    color: "#eeeeee",
    fontSize: "16px",
  },

  cardSubtitle: {
    margin: "4px 0 0",
    color: "#707070",
    fontSize: "10px",
  },

  divider: {
    height: "1px",
    background:
      "linear-gradient(90deg, #333333, transparent)",
    margin: "20px 0",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    color: "#737373",
    fontSize: "9px",
    fontWeight: "700",
    letterSpacing: "1.3px",
  },

  inputContainer: {
    height: "48px",
    display: "flex",
    alignItems: "center",
    border: "1px solid #3a3a3a",
    borderRadius: "8px",
    background: "#0b0b0b",
    overflow: "hidden",
  },

  inputPrefix: {
    width: "45px",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRight: "1px solid #292929",
    color: "#4d9cff",
    fontSize: "10px",
    fontWeight: "700",
  },

  input: {
    flex: 1,
    height: "100%",
    padding: "0 14px",
    border: "none",
    outline: "none",
    background: "transparent",
    color: "#eeeeee",
    fontSize: "13px",
    boxSizing: "border-box",
  },

  verifyButton: {
    width: "100%",
    height: "45px",
    marginTop: "14px",
    border: "1px solid #b52e2e",
    borderRadius: "8px",
    background:
      "linear-gradient(135deg, #9d2929, #721d1d)",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "700",
    boxShadow:
      "0 5px 18px rgba(130,30,30,0.22)",
  },

  disabledButton: {
    opacity: 0.65,
    cursor: "not-allowed",
  },

  spinner: {
    display: "inline-block",
    marginRight: "7px",
    fontSize: "16px",
  },

  errorBox: {
    marginTop: "16px",
    padding: "12px 14px",
    display: "flex",
    gap: "10px",
    borderRadius: "9px",
    border: "1px solid #702020",
    background: "#2a1010",
  },

  errorIcon: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#6e2424",
    color: "#ff8a8a",
    fontWeight: "700",
    fontSize: "11px",
    flexShrink: 0,
  },

  errorTitle: {
    margin: 0,
    color: "#ff7777",
    fontSize: "11px",
  },

  errorText: {
    margin: "3px 0 0",
    color: "#b66c6c",
    fontSize: "10px",
  },

  resultCard: {
    marginTop: "22px",
    padding: "25px",
    border: "1px solid #28583b",
    borderRadius: "14px",
    background:
      "linear-gradient(145deg, rgba(16,27,20,0.98), rgba(7,12,9,0.98))",
  },

  resultHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
  },

  resultLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  successIcon: {
    width: "43px",
    height: "43px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0d2a19",
    border: "1px solid #28683e",
    color: "#54d889",
    fontSize: "20px",
    fontWeight: "700",
  },

  resultLabel: {
    margin: 0,
    color: "#54d889",
    fontSize: "8px",
    letterSpacing: "1.5px",
    fontWeight: "700",
  },

  resultTitle: {
    margin: "4px 0 0",
    color: "#eeeeee",
    fontSize: "18px",
  },

  verifiedBadge: {
    padding: "7px 11px",
    borderRadius: "20px",
    background: "#0d2618",
    border: "1px solid #28683e",
    color: "#54d889",
    fontSize: "9px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },

  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },

  detailBox: {
    padding: "13px",
    borderRadius: "8px",
    border: "1px solid #2b3d32",
    background: "#0b120e",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  detailBoxFull: {
    gridColumn: "1 / -1",
    padding: "13px",
    borderRadius: "8px",
    border: "1px solid #2b3d32",
    background: "#0b120e",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  detailLabel: {
    color: "#64766b",
    fontSize: "8px",
    letterSpacing: "1px",
    fontWeight: "700",
  },

  detailValue: {
    color: "#cbd8d0",
    fontSize: "10px",
    wordBreak: "break-all",
    lineHeight: "1.5",
  },

  hashValue: {
    color: "#9db5a7",
    fontSize: "9px",
    wordBreak: "break-all",
    lineHeight: "1.6",
    fontFamily: "monospace",
  },

  blockchainBox: {
    marginTop: "17px",
    padding: "14px",
    borderRadius: "9px",
    border: "1px solid #294735",
    background: "#0c1711",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
  },

  blockchainLeft: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  chainIcon: {
    width: "34px",
    height: "34px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#11271a",
    border: "1px solid #2b6840",
    color: "#54d889",
    fontSize: "16px",
  },

  blockchainTitle: {
    margin: 0,
    color: "#d8e4dc",
    fontSize: "11px",
  },

  blockchainText: {
    margin: "3px 0 0",
    color: "#66766c",
    fontSize: "9px",
  },

  confirmed: {
    padding: "6px 9px",
    borderRadius: "15px",
    background: "#0d2618",
    border: "1px solid #28683e",
    color: "#54d889",
    fontSize: "8px",
    fontWeight: "700",
    flexShrink: 0,
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "12px",
    marginTop: "20px",
  },

  infoCard: {
    padding: "16px",
    borderRadius: "10px",
    border: "1px solid #292929",
    background: "rgba(14,14,14,0.9)",
  },

  infoIcon: {
    width: "31px",
    height: "31px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#101d2d",
    border: "1px solid #244b73",
    color: "#55aaff",
    fontSize: "13px",
  },

  infoTitle: {
    margin: "10px 0 0",
    color: "#d4d4d4",
    fontSize: "10px",
  },

  infoText: {
    margin: "5px 0 0",
    color: "#686868",
    fontSize: "8px",
    lineHeight: "1.5",
  },

  footer: {
    width: "92%",
    maxWidth: "820px",
    margin: "32px auto 0",
    paddingTop: "17px",
    borderTop: "1px solid #222222",
    display: "flex",
    justifyContent: "space-between",
    color: "#555555",
    fontSize: "9px",
  },
};

export default PublicVerification;