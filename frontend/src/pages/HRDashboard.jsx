import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function HRDashboard() {
  const navigate = useNavigate();
  const [verifications, setVerifications] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [verifyingId, setVerifyingId] = useState(null);
  const [blockchainData, setBlockchainData] = useState(null);
  const [blockchainLoading, setBlockchainLoading] = useState(false);
  const [integrityData, setIntegrityData] = useState(null);
  const [integrityLoading, setIntegrityLoading] = useState(false);

  const fetchPendingVerifications = async () => {
    try {
      const response = await api.get("/verifications/pending");
      setVerifications(response.data.verifications);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load pending verifications"
      );
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await api.get("/verifications/history");
      setHistory(response.data.verifications);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load verification history"
      );
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");
      await Promise.all([
        fetchPendingVerifications(),
        fetchHistory(),
      ]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleVerify = async (id) => {
    try {
      setVerifyingId(id);
      setError("");
      setMessage("");
      setBlockchainData(null);
      setIntegrityData(null);

      const response = await api.put(
        `/verifications/${id}/verify`
      );

      setMessage(response.data.message);

      setVerifications((prev) =>
        prev.filter(
          (verification) => verification._id !== id
        )
      );

      await fetchHistory();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to verify employee"
      );
    } finally {
      setVerifyingId(null);
    }
  };

  const handleBlockchainDetails = async (id) => {
    try {
      setBlockchainLoading(true);
      setError("");
      setBlockchainData(null);

      const response = await api.get(
        `/verifications/${id}/blockchain`
      );

      setBlockchainData(response.data.blockchain);
    } catch (error) {
      console.error(
        "Blockchain details error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to fetch blockchain verification"
      );
    } finally {
      setBlockchainLoading(false);
    }
  };

  const handleIntegrityCheck = async (id) => {
    try {
      setIntegrityLoading(true);
      setError("");
      setIntegrityData(null);

      const response = await api.get(
        `/verifications/${id}/integrity`
      );

      setIntegrityData(response.data.integrity);
    } catch (error) {
      console.error(
        "Integrity check error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to check data integrity"
      );
    } finally {
      setIntegrityLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingBox}>
          <div style={styles.loadingLogo}>EV</div>
          <h2>Loading HR Dashboard</h2>
          <p>Securely loading verification records...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.backgroundGlow}></div>
      <div style={styles.backgroundGlow2}></div>

      <header style={styles.header}>
        <div style={styles.brand}>
          <div style={styles.brandLogo}>EV</div>

          <div>
            <h1 style={styles.brandTitle}>
              Employee Verification
            </h1>

            <p style={styles.brandSubtitle}>
              Secure Credential & Background Verification
            </p>
          </div>
        </div>

        <div style={styles.headerRight}>
          <div style={styles.roleBadge}>
            <span style={styles.roleDot}></span>
            HR Portal
          </div>

          <button
            onClick={handleLogout}
            style={styles.logoutButton}
          >
            <span style={styles.logoutIcon}>↪</span>
            Logout
          </button>
        </div>
      </header>

      <main style={styles.container}>
        <div style={styles.pageHeading}>
          <div>
            <p style={styles.smallTitle}>
              HUMAN RESOURCES PORTAL
            </p>

            <h2 style={styles.mainTitle}>
              HR Dashboard
            </h2>

            <p style={styles.mainDescription}>
              Review, verify and securely manage employee credentials.
            </p>
          </div>

          <div style={styles.securityBadge}>
            <span style={styles.greenDot}></span>
            Blockchain Secured
          </div>
        </div>

        {message && (
          <div style={styles.successMessage}>
            <span style={styles.messageIcon}>✓</span>
            {message}
          </div>
        )}

        {error && (
          <div style={styles.errorMessage}>
            <span style={styles.messageIcon}>!</span>
            {error}
          </div>
        )}

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIconPending}>◷</div>

            <div>
              <p style={styles.statLabel}>
                PENDING
              </p>

              <h3 style={styles.statNumber}>
                {verifications.length}
              </h3>

              <p style={styles.statText}>
                Awaiting verification
              </p>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIconVerified}>✓</div>

            <div>
              <p style={styles.statLabel}>
                VERIFIED
              </p>

              <h3 style={styles.statNumber}>
                {history.length}
              </h3>

              <p style={styles.statText}>
                Completed records
              </p>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIconBlockchain}>⛓</div>

            <div>
              <p style={styles.statLabel}>
                SECURITY
              </p>

              <h3 style={styles.statWord}>
                SECURE
              </h3>

              <p style={styles.statText}>
                Blockchain protected
              </p>
            </div>
          </div>
        </div>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionIconPending}>
              ◷
            </div>

            <div>
              <h2 style={styles.sectionTitle}>
                Pending Employee Verifications
              </h2>

              <p style={styles.sectionDescription}>
                Review employee information before approving verification.
              </p>
            </div>

            <div style={styles.requestCount}>
              {verifications.length} Pending
            </div>
          </div>

          <div style={styles.divider}></div>

          {verifications.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>✓</div>

              <h3>No Pending Requests</h3>

              <p>
                All employee verification requests have been processed.
              </p>
            </div>
          ) : (
            <div style={styles.cardsGrid}>
              {verifications.map((verification) => (
                <div
                  key={verification._id}
                  style={styles.employeeCard}
                >
                  <div style={styles.employeeTop}>
                    <div style={styles.employeeIdentity}>
                      <div style={styles.avatar}>
                        {(verification.employee?.name ||
                          "E")
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>
                        <h3 style={styles.employeeName}>
                          {verification.employee?.name ||
                            "Employee"}
                        </h3>

                        <p style={styles.employeeEmail}>
                          {verification.employee?.email ||
                            "N/A"}
                        </p>
                      </div>
                    </div>

                    <span style={styles.pendingBadge}>
                      Pending
                    </span>
                  </div>

                  <div style={styles.infoGrid}>
                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>
                        Employee ID
                      </span>

                      <span style={styles.infoValue}>
                        {verification.employeeId}
                      </span>
                    </div>

                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>
                        Company
                      </span>

                      <span style={styles.infoValue}>
                        {verification.company}
                      </span>
                    </div>

                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>
                        Designation
                      </span>

                      <span style={styles.infoValue}>
                        {verification.designation}
                      </span>
                    </div>

                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>
                        Joining Date
                      </span>

                      <span style={styles.infoValue}>
                        {new Date(
                          verification.joiningDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      handleVerify(verification._id)
                    }
                    disabled={
                      verifyingId === verification._id
                    }
                    style={{
                      ...styles.verifyButton,
                      opacity:
                        verifyingId === verification._id
                          ? 0.65
                          : 1,
                    }}
                  >
                    {verifyingId === verification._id
                      ? "Verifying..."
                      : "✓ Verify Employee"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionIconBlue}>
              ✓
            </div>

            <div>
              <h2 style={styles.sectionTitle}>
                Verification History
              </h2>

              <p style={styles.sectionDescription}>
                View completed employee verification records.
              </p>
            </div>

            <div style={styles.requestCount}>
              {history.length} Records
            </div>
          </div>

          <div style={styles.divider}></div>

          {history.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>⌁</div>

              <h3>No Verification History</h3>

              <p>
                Completed verification records will appear here.
              </p>
            </div>
          ) : (
            <div style={styles.cardsGrid}>
              {history.map((verification) => (
                <div
                  key={verification._id}
                  style={styles.historyCard}
                >
                  <div style={styles.employeeTop}>
                    <div style={styles.employeeIdentity}>
                      <div style={styles.avatarVerified}>
                        {(verification.employee?.name ||
                          "E")
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>
                        <h3 style={styles.employeeName}>
                          {verification.employee?.name ||
                            "Employee"}
                        </h3>

                        <p style={styles.employeeEmail}>
                          {verification.employee?.email ||
                            "N/A"}
                        </p>
                      </div>
                    </div>

                    <span style={styles.verifiedBadge}>
                      ✓ Verified
                    </span>
                  </div>

                  <div style={styles.infoGrid}>
                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>
                        Employee ID
                      </span>

                      <span style={styles.infoValue}>
                        {verification.employeeId}
                      </span>
                    </div>

                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>
                        Company
                      </span>

                      <span style={styles.infoValue}>
                        {verification.company}
                      </span>
                    </div>

                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>
                        Designation
                      </span>

                      <span style={styles.infoValue}>
                        {verification.designation}
                      </span>
                    </div>

                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>
                        Joining Date
                      </span>

                      <span style={styles.infoValue}>
                        {new Date(
                          verification.joiningDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {verification.verifiedBy && (
                    <div style={styles.verifiedInfo}>
                      <span>✓</span>
                      Verified by{" "}
                      <strong>
                        {verification.verifiedBy.name}
                      </strong>
                    </div>
                  )}

                  {verification.verifiedAt && (
                    <p style={styles.verifiedAt}>
                      Verified on{" "}
                      {new Date(
                        verification.verifiedAt
                      ).toLocaleString()}
                    </p>
                  )}

                  {verification.blockchainHash && (
                    <div style={styles.blockchainBox}>
                      <div style={styles.blockchainHeader}>
                        <div>
                          <span style={styles.chainIcon}>
                            ⛓
                          </span>

                          <strong>
                            Blockchain Protected
                          </strong>
                        </div>

                        <span style={styles.chainStatus}>
                          ● Secured
                        </span>
                      </div>

                      <p style={styles.hashLabel}>
                        Transaction Hash
                      </p>

                      <p style={styles.hash}>
                        {verification.blockchainHash}
                      </p>

                      <div style={styles.actionRow}>
                        <button
                          onClick={() =>
                            handleBlockchainDetails(
                              verification._id
                            )
                          }
                          disabled={blockchainLoading}
                          style={styles.blockchainButton}
                        >
                          {blockchainLoading
                            ? "Loading..."
                            : "View Blockchain"}
                          <span>→</span>
                        </button>

                        <button
                          onClick={() =>
                            handleIntegrityCheck(
                              verification._id
                            )
                          }
                          disabled={integrityLoading}
                          style={styles.integrityButton}
                        >
                          {integrityLoading
                            ? "Checking..."
                            : "Check Integrity"}
                          <span>✓</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {blockchainData && (
          <section style={styles.blockchainDetails}>
            <div style={styles.detailsHeader}>
              <div>
                <p style={styles.smallTitle}>
                  BLOCKCHAIN RECORD
                </p>

                <h2 style={styles.detailsTitle}>
                  Blockchain Verification Details
                </h2>
              </div>

              <div style={styles.verifiedBadge}>
                ✓ Verified
              </div>
            </div>

            <div style={styles.divider}></div>

            <div style={styles.blockchainGrid}>
              <div style={styles.blockchainField}>
                <span style={styles.blockchainLabel}>
                  Verification ID
                </span>

                <span style={styles.blockchainValue}>
                  {blockchainData.verificationId}
                </span>
              </div>

              <div style={styles.blockchainField}>
                <span style={styles.blockchainLabel}>
                  Employee ID
                </span>

                <span style={styles.blockchainValue}>
                  {blockchainData.employeeId}
                </span>
              </div>

              <div style={styles.blockchainFieldFull}>
                <span style={styles.blockchainLabel}>
                  Data Hash
                </span>

                <span style={styles.hashValue}>
                  {blockchainData.dataHash}
                </span>
              </div>

              <div style={styles.blockchainField}>
                <span style={styles.blockchainLabel}>
                  Verified By
                </span>

                <span style={styles.hashValue}>
                  {blockchainData.verifiedBy}
                </span>
              </div>

              <div style={styles.blockchainField}>
                <span style={styles.blockchainLabel}>
                  Verified At
                </span>

                <span style={styles.blockchainValue}>
                  {new Date(
                    Number(
                      blockchainData.verifiedAt
                    ) * 1000
                  ).toLocaleString()}
                </span>
              </div>

              {blockchainData.blockchainHash && (
                <div style={styles.blockchainFieldFull}>
                  <span style={styles.blockchainLabel}>
                    Transaction Hash
                  </span>

                  <span style={styles.hashValue}>
                    {blockchainData.blockchainHash}
                  </span>
                </div>
              )}

              <div style={styles.blockchainStatus}>
                <span>●</span>
                Blockchain Status: Verified
              </div>
            </div>
          </section>
        )}

        {integrityData && (
          <section
            style={{
              ...styles.integrityDetails,
              borderColor: integrityData.verified
                ? "#27643f"
                : "#742626",
              background: integrityData.verified
                ? "linear-gradient(145deg, #0d2117, #080e0b)"
                : "linear-gradient(145deg, #251010, #0e0808)",
            }}
          >
            <div style={styles.detailsHeader}>
              <div>
                <p
                  style={{
                    ...styles.smallTitle,
                    color: integrityData.verified
                      ? "#4fd984"
                      : "#ff5c5c",
                  }}
                >
                  SECURITY CHECK
                </p>

                <h2 style={styles.detailsTitle}>
                  Data Integrity Check
                </h2>
              </div>

              <div
                style={{
                  ...styles.verifiedBadge,
                  background: integrityData.verified
                    ? "#0c2617"
                    : "#2b1010",
                  borderColor: integrityData.verified
                    ? "#23643c"
                    : "#702626",
                  color: integrityData.verified
                    ? "#52d984"
                    : "#ff6565",
                }}
              >
                {integrityData.verified
                  ? "✓ Data Secure"
                  : "⚠ Data Changed"}
              </div>
            </div>

            <div style={styles.divider}></div>

            <div
              style={
                styles.integrityStatus
              }
            >
              <div
                style={{
                  ...styles.integrityIcon,
                  background:
                    integrityData.verified
                      ? "#12351f"
                      : "#351313",
                  color:
                    integrityData.verified
                      ? "#52d984"
                      : "#ff6262",
                }}
              >
                {integrityData.verified
                  ? "✓"
                  : "!"}
              </div>

              <div>
                <h3
                  style={styles.integrityTitle}
                >
                  {integrityData.verified
                    ? "Data Integrity Verified"
                    : "Data Integrity Failed"}
                </h3>

                <p
                  style={styles.integrityMessage}
                >
                  {integrityData.verified
                    ? "The current employee data matches the data stored on the blockchain."
                    : "The current employee data does not match the data stored on the blockchain."}
                </p>
              </div>
            </div>

            <div style={styles.hashComparison}>
              <div style={styles.hashPanel}>
                <span style={styles.blockchainLabel}>
                  Current MongoDB Data Hash
                </span>

                <p style={styles.hashValue}>
                  {integrityData.currentDataHash}
                </p>
              </div>

              <div style={styles.hashPanel}>
                <span style={styles.blockchainLabel}>
                  Blockchain Data Hash
                </span>

                <p style={styles.hashValue}>
                  {integrityData.blockchainDataHash}
                </p>
              </div>
            </div>
          </section>
        )}
      </main>

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
    boxSizing: "border-box",
    paddingBottom: "30px",
    background:
      "radial-gradient(circle at 50% 0%, #111923 0%, #06080b 35%, #000000 75%)",
    color: "#ffffff",
    position: "relative",
    overflow: "hidden",
  },

  backgroundGlow: {
    position: "fixed",
    width: "500px",
    height: "500px",
    top: "-300px",
    left: "50%",
    transform: "translateX(-50%)",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(45,100,190,0.18), transparent 68%)",
    pointerEvents: "none",
  },

  backgroundGlow2: {
    position: "fixed",
    width: "350px",
    height: "350px",
    right: "-200px",
    top: "35%",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(30,70,140,0.12), transparent 68%)",
    pointerEvents: "none",
  },

  header: {
    minHeight: "76px",
    padding: "0 6%",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid #252525",
    background: "rgba(8,8,8,0.92)",
    backdropFilter: "blur(15px)",
    position: "relative",
    zIndex: 5,
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
  },

  brandLogo: {
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
    fontWeight: "700",
    color: "#eeeeee",
  },

  brandSubtitle: {
    margin: "3px 0 0",
    fontSize: "10px",
    color: "#777777",
  },

  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  roleBadge: {
    padding: "7px 11px",
    borderRadius: "20px",
    border: "1px solid #304b65",
    background: "#101923",
    color: "#78baff",
    fontSize: "10px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },

  roleDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#4da3ff",
    boxShadow:
      "0 0 7px rgba(77,163,255,0.8)",
  },

  logoutButton: {
    height: "38px",
    padding: "0 17px",
    borderRadius: "8px",
    border: "1px solid #4b4b4b",
    background: "#171717",
    color: "#d5d5d5",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "7px",
  },

  logoutIcon: {
    fontSize: "17px",
  },

  container: {
    width: "92%",
    maxWidth: "1180px",
    margin: "0 auto",
    paddingTop: "38px",
    position: "relative",
    zIndex: 2,
  },

  pageHeading: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "27px",
    gap: "20px",
  },

  smallTitle: {
    margin: "0 0 5px",
    color: "#4d9cff",
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "2px",
  },

  mainTitle: {
    margin: 0,
    fontSize: "30px",
    fontWeight: "700",
    color: "#f1f1f1",
  },

  mainDescription: {
    margin: "7px 0 0",
    color: "#858585",
    fontSize: "13px",
  },

  securityBadge: {
    padding: "8px 13px",
    borderRadius: "20px",
    border: "1px solid #244a35",
    background: "#0c1b13",
    color: "#54d889",
    fontSize: "11px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "7px",
  },

  greenDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#43d47a",
    boxShadow: "0 0 8px #43d47a",
  },

  successMessage: {
    marginBottom: "18px",
    padding: "11px 15px",
    borderRadius: "9px",
    border: "1px solid #195c37",
    background: "#0b2115",
    color: "#53dd87",
    fontSize: "12px",
  },

  errorMessage: {
    marginBottom: "18px",
    padding: "11px 15px",
    borderRadius: "9px",
    border: "1px solid #702020",
    background: "#2a1010",
    color: "#ff7777",
    fontSize: "12px",
  },

  messageIcon: {
    marginRight: "8px",
    fontWeight: "700",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, 1fr)",
    gap: "16px",
    marginBottom: "25px",
  },

  statCard: {
    minHeight: "105px",
    padding: "18px",
    boxSizing: "border-box",
    border: "1px solid #343434",
    borderRadius: "12px",
    background:
      "linear-gradient(145deg, #1b1b1b, #0d0d0d)",
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  statIconPending: {
    width: "43px",
    height: "43px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#28200e",
    border: "1px solid #62501e",
    color: "#e4bd4f",
    fontSize: "22px",
  },

  statIconVerified: {
    width: "43px",
    height: "43px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0d2919",
    border: "1px solid #24643d",
    color: "#51dc86",
    fontSize: "20px",
  },

  statIconBlockchain: {
    width: "43px",
    height: "43px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#101d2d",
    border: "1px solid #244b73",
    color: "#55aaff",
    fontSize: "20px",
  },

  statLabel: {
    margin: 0,
    color: "#666666",
    fontSize: "9px",
    letterSpacing: "1.5px",
    fontWeight: "700",
  },

  statNumber: {
    margin: "3px 0",
    color: "#eeeeee",
    fontSize: "25px",
  },

  statWord: {
    margin: "3px 0",
    color: "#eeeeee",
    fontSize: "17px",
  },

  statText: {
    margin: 0,
    color: "#777777",
    fontSize: "9px",
  },

  section: {
    marginBottom: "28px",
    padding: "25px",
    border: "1px solid #363636",
    borderRadius: "14px",
    background:
      "linear-gradient(145deg, rgba(24,24,24,0.97), rgba(8,8,8,0.97))",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  sectionIconPending: {
    width: "35px",
    height: "35px",
    borderRadius: "9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#241f0d",
    border: "1px solid #67551d",
    color: "#e6bf51",
    fontSize: "19px",
  },

  sectionIconBlue: {
    width: "35px",
    height: "35px",
    borderRadius: "9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#101d2d",
    border: "1px solid #244b73",
    color: "#55aaff",
    fontSize: "17px",
  },

  sectionTitle: {
    margin: 0,
    color: "#eeeeee",
    fontSize: "17px",
    fontWeight: "650",
  },

  sectionDescription: {
    margin: "4px 0 0",
    color: "#777777",
    fontSize: "11px",
  },

  requestCount: {
    marginLeft: "auto",
    padding: "6px 10px",
    borderRadius: "6px",
    background: "#1c1c1c",
    border: "1px solid #393939",
    color: "#999999",
    fontSize: "10px",
  },

  divider: {
    height: "1px",
    background:
      "linear-gradient(90deg, #333333, transparent)",
    margin: "20px 0",
  },

  cardsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(330px, 1fr))",
    gap: "17px",
  },

  employeeCard: {
    padding: "18px",
    border: "1px solid #44402e",
    borderRadius: "11px",
    background:
      "linear-gradient(145deg, #1c1b17, #101010)",
  },

  historyCard: {
    padding: "18px",
    border: "1px solid #304538",
    borderRadius: "11px",
    background:
      "linear-gradient(145deg, #151c18, #101010)",
  },

  employeeTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "10px",
  },

  employeeIdentity: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
  },

  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(145deg, #574819, #25200f)",
    border: "1px solid #79642a",
    color: "#e8c75c",
    fontSize: "15px",
    fontWeight: "700",
  },

  avatarVerified: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(145deg, #17482b, #0c2115)",
    border: "1px solid #32744b",
    color: "#59dd88",
    fontSize: "15px",
    fontWeight: "700",
  },

  employeeName: {
    margin: 0,
    color: "#eeeeee",
    fontSize: "15px",
  },

  employeeEmail: {
    margin: "4px 0 0",
    color: "#707070",
    fontSize: "10px",
  },

  pendingBadge: {
    padding: "5px 9px",
    borderRadius: "20px",
    background: "#29200d",
    border: "1px solid #715b20",
    color: "#e7bd51",
    fontSize: "9px",
    fontWeight: "700",
    textTransform: "uppercase",
  },

  verifiedBadge: {
    padding: "5px 9px",
    borderRadius: "20px",
    background: "#0c2617",
    border: "1px solid #23643c",
    color: "#52d984",
    fontSize: "9px",
    fontWeight: "700",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "11px",
    marginTop: "17px",
    padding: "13px 0",
    borderTop: "1px solid #2d2d2d",
    borderBottom: "1px solid #2d2d2d",
  },

  infoItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  infoLabel: {
    color: "#666666",
    fontSize: "8px",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },

  infoValue: {
    color: "#cccccc",
    fontSize: "10px",
  },

  verifyButton: {
    width: "100%",
    height: "40px",
    marginTop: "15px",
    border: "1px solid #2c8a55",
    borderRadius: "7px",
    background:
      "linear-gradient(180deg, #176438, #0d4827)",
    color: "#ffffff",
    fontSize: "11px",
    fontWeight: "700",
    cursor: "pointer",
  },

  verifiedInfo: {
    marginTop: "12px",
    color: "#64d992",
    fontSize: "10px",
  },

  verifiedAt: {
    margin: "5px 0 0",
    color: "#666666",
    fontSize: "9px",
  },

  blockchainBox: {
    marginTop: "15px",
    padding: "12px",
    borderRadius: "8px",
    background: "#0b1118",
    border: "1px solid #203b56",
  },

  blockchainHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#8bc3ff",
    fontSize: "10px",
  },

  chainIcon: {
    marginRight: "6px",
  },

  chainStatus: {
    color: "#4edb83",
    fontSize: "9px",
  },

  hashLabel: {
    margin: "11px 0 4px",
    color: "#666666",
    fontSize: "9px",
  },

  hash: {
    margin: 0,
    color: "#7d9dbd",
    fontSize: "9px",
    wordBreak: "break-all",
    lineHeight: "1.5",
  },

  actionRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
    marginTop: "11px",
  },

  blockchainButton: {
    height: "34px",
    border: "1px solid #315b82",
    borderRadius: "6px",
    background: "#111e2b",
    color: "#66afff",
    fontSize: "9px",
    fontWeight: "600",
    cursor: "pointer",
  },

  integrityButton: {
    height: "34px",
    border: "1px solid #5d5229",
    borderRadius: "6px",
    background: "#201d12",
    color: "#e2c75d",
    fontSize: "9px",
    fontWeight: "600",
    cursor: "pointer",
  },

  emptyState: {
    padding: "45px 20px",
    textAlign: "center",
    border: "1px dashed #343434",
    borderRadius: "10px",
    background: "#0d0d0d",
  },

  emptyIcon: {
    width: "42px",
    height: "42px",
    margin: "0 auto 10px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#142619",
    color: "#51dc86",
    fontSize: "21px",
  },

  blockchainDetails: {
    marginTop: "28px",
    padding: "25px",
    border: "1px solid #315a80",
    borderRadius: "14px",
    background:
      "linear-gradient(145deg, #111b26, #090d12)",
    boxShadow:
      "0 0 25px rgba(35,100,160,0.1)",
  },

  integrityDetails: {
    marginTop: "28px",
    padding: "25px",
    border: "1px solid",
    borderRadius: "14px",
  },

  detailsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },

  detailsTitle: {
    margin: 0,
    fontSize: "21px",
    color: "#eeeeee",
  },

  blockchainGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
  },

  blockchainField: {
    padding: "14px",
    borderRadius: "8px",
    background: "#0d1218",
    border: "1px solid #202e3a",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  blockchainFieldFull: {
    gridColumn: "1 / -1",
    padding: "14px",
    borderRadius: "8px",
    background: "#0d1218",
    border: "1px solid #202e3a",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  blockchainLabel: {
    color: "#66717c",
    fontSize: "9px",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },

  blockchainValue: {
    color: "#d1dbe4",
    fontSize: "11px",
    wordBreak: "break-all",
  },

  hashValue: {
    margin: 0,
    color: "#76a9d2",
    fontSize: "10px",
    wordBreak: "break-all",
    lineHeight: "1.5",
  },

  blockchainStatus: {
    gridColumn: "1 / -1",
    padding: "12px",
    borderRadius: "8px",
    background: "#0c2617",
    border: "1px solid #23643c",
    color: "#52d984",
    fontSize: "11px",
    fontWeight: "600",
  },

  integrityStatus: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "16px",
    borderRadius: "9px",
    background: "rgba(0,0,0,0.2)",
    border: "1px solid #282828",
  },

  integrityIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    fontWeight: "700",
  },

  integrityTitle: {
    margin: 0,
    color: "#eeeeee",
    fontSize: "14px",
  },

  integrityMessage: {
    margin: "5px 0 0",
    color: "#888888",
    fontSize: "10px",
    lineHeight: "1.5",
  },

  hashComparison: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
    marginTop: "15px",
  },

  hashPanel: {
    padding: "14px",
    borderRadius: "8px",
    background: "#0b0d0d",
    border: "1px solid #292929",
  },

  footer: {
    width: "92%",
    maxWidth: "1180px",
    margin: "30px auto 0",
    paddingTop: "18px",
    borderTop: "1px solid #222222",
    display: "flex",
    justifyContent: "space-between",
    color: "#555555",
    fontSize: "9px",
    position: "relative",
    zIndex: 2,
  },

  loadingPage: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#050608",
    color: "#ffffff",
  },

  loadingBox: {
    textAlign: "center",
    padding: "40px",
  },

  loadingLogo: {
    width: "58px",
    height: "58px",
    margin: "0 auto 20px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#142b4d",
    border: "2px solid #4d75ad",
    color: "#75a9ff",
    fontWeight: "700",
    boxShadow:
      "0 0 25px rgba(50,110,220,0.5)",
  },
};

export default HRDashboard;