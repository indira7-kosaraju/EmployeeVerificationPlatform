import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function EmployeeDashboard() {
  const navigate = useNavigate();
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [blockchainData, setBlockchainData] = useState(null);
  const [blockchainLoading, setBlockchainLoading] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: "",
    company: "",
    designation: "",
    joiningDate: "",
  });

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/verifications/my");
      setVerifications(response.data.verification);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load verifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await api.post("/verifications", formData);
      setMessage(response.data.message);

      setFormData({
        employeeId: "",
        company: "",
        designation: "",
        joiningDate: "",
      });

      fetchVerifications();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create verification request"
      );
    }
  };

  const handleBlockchainDetails = async (id) => {
    try {
      setBlockchainLoading(true);
      setError("");
      setBlockchainData(null);

      const response = await api.get(`/verifications/${id}/blockchain`);
      setBlockchainData(response.data.blockchain);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to fetch blockchain details"
      );
    } finally {
      setBlockchainLoading(false);
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
          <h2>Loading Dashboard</h2>
          <p>Securely loading your verification data...</p>
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
            <h1 style={styles.brandTitle}>Employee Verification</h1>
            <p style={styles.brandSubtitle}>
              Secure Credential & Background Verification
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={styles.logoutButton}
        >
          <span style={styles.logoutIcon}>↪</span>
          Logout
        </button>
      </header>

      <main style={styles.container}>
        <div style={styles.pageHeading}>
          <div>
            <p style={styles.smallTitle}>EMPLOYEE PORTAL</p>
            <h2 style={styles.mainTitle}>Employee Dashboard</h2>
            <p style={styles.mainDescription}>
              Manage your employment verification requests securely.
            </p>
          </div>

          <div style={styles.securityBadge}>
            <span style={styles.greenDot}></span>
            Blockchain Secured
          </div>
        </div>

        {message && (
          <div style={styles.successMessage}>
            <span>✓</span>
            {message}
          </div>
        )}

        {error && (
          <div style={styles.errorMessage}>
            <span>!</span>
            {error}
          </div>
        )}

        <section style={styles.createCard}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionIcon}>+</div>
            <div>
              <h2 style={styles.sectionTitle}>
                Create Verification Request
              </h2>
              <p style={styles.sectionDescription}>
                Submit your employment details for verification.
              </p>
            </div>
          </div>

          <div style={styles.divider}></div>

          <form onSubmit={handleSubmit}>
            <div style={styles.formGrid}>
              <div style={styles.field}>
                <label style={styles.label}>Employee ID</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}>▣</span>
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    placeholder="EMP001"
                    required
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Company</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}>▥</span>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="ABC Technologies"
                    required
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Designation</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}>◆</span>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    placeholder="Software Developer"
                    required
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Joining Date</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}>▣</span>
                  <input
                    type="date"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleChange}
                    required
                    style={styles.dateInput}
                  />
                </div>
              </div>
            </div>

            <button type="submit" style={styles.submitButton}>
              Submit Verification
              <span style={styles.arrow}>→</span>
            </button>
          </form>
        </section>

        <section style={styles.requestsSection}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionIconBlue}>✓</div>
            <div>
              <h2 style={styles.sectionTitle}>
                My Verification Requests
              </h2>
              <p style={styles.sectionDescription}>
                Track the status of your submitted requests.
              </p>
            </div>

            <div style={styles.requestCount}>
              {verifications.length} Request
              {verifications.length !== 1 ? "s" : ""}
            </div>
          </div>

          <div style={styles.divider}></div>

          {verifications.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>⌁</div>
              <h3>No Verification Requests</h3>
              <p>
                You have not submitted any verification requests yet.
              </p>
            </div>
          ) : (
            <div style={styles.requestsGrid}>
              {verifications.map((verification) => (
                <div
                  key={verification._id}
                  style={styles.requestCard}
                >
                  <div style={styles.requestTop}>
                    <div>
                      <h3 style={styles.companyName}>
                        {verification.company}
                      </h3>
                      <p style={styles.designation}>
                        {verification.designation}
                      </p>
                    </div>

                    <span
                      style={{
                        ...styles.status,
                        ...(verification.verificationStatus ===
                        "verified"
                          ? styles.statusVerified
                          : styles.statusPending),
                      }}
                    >
                      {verification.verificationStatus}
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
                          <span style={styles.blockchainIcon}>⛓</span>
                          <strong>Blockchain Verified</strong>
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

                      <button
                        onClick={() =>
                          handleBlockchainDetails(
                            verification._id
                          )
                        }
                        style={styles.blockchainButton}
                      >
                        View Blockchain Details
                        <span>→</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {blockchainLoading && (
          <section style={styles.blockchainDetails}>
            <div style={styles.blockchainLoading}>
              <div style={styles.spinner}></div>
              <h2>Loading Blockchain Details...</h2>
              <p>Reading verification data from blockchain.</p>
            </div>
          </section>
        )}

        {blockchainData && (
          <section style={styles.blockchainDetails}>
            <div style={styles.blockchainTitleRow}>
              <div>
                <p style={styles.smallTitle}>BLOCKCHAIN RECORD</p>
                <h2 style={styles.blockchainTitle}>
                  Blockchain Verification
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

              <div style={styles.blockchainFieldFull}>
                <span style={styles.blockchainLabel}>
                  Verified By Wallet
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
                    Number(blockchainData.verifiedAt) * 1000
                  ).toLocaleString()}
                </span>
              </div>

              <div style={styles.blockchainField}>
                <span style={styles.blockchainLabel}>
                  Blockchain Status
                </span>
                <span style={styles.blockchainVerified}>
                  ● Verified on Blockchain
                </span>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer style={styles.footer}>
        <span>🔒 Secure Employee Verification Platform</span>
        <span>Powered by Blockchain Technology</span>
      </footer>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    boxSizing: "border-box",
    padding: "0 0 30px",
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
    boxShadow: "0 0 14px rgba(50,110,220,0.45)",
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

  createCard: {
    padding: "25px",
    border: "1px solid #363636",
    borderRadius: "14px",
    background:
      "linear-gradient(145deg, rgba(29,29,29,0.96), rgba(10,10,10,0.96))",
    boxShadow: "0 18px 45px rgba(0,0,0,0.35)",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  sectionIcon: {
    width: "35px",
    height: "35px",
    borderRadius: "9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#241313",
    border: "1px solid #6d2a2a",
    color: "#ff5751",
    fontSize: "22px",
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

  divider: {
    height: "1px",
    background:
      "linear-gradient(90deg, #333333, transparent)",
    margin: "20px 0",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "17px",
  },

  field: {
    width: "100%",
  },

  label: {
    display: "block",
    marginBottom: "7px",
    color: "#cfcfcf",
    fontSize: "11px",
    fontWeight: "600",
  },

  inputWrapper: {
    position: "relative",
    width: "100%",
  },

  inputIcon: {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#777777",
    fontSize: "13px",
    zIndex: 1,
  },

  input: {
    width: "100%",
    height: "45px",
    padding: "0 13px 0 42px",
    boxSizing: "border-box",
    border: "1px solid #454545",
    borderRadius: "8px",
    outline: "none",
    background: "#202020",
    color: "#ffffff",
    fontSize: "12px",
  },

  dateInput: {
    width: "100%",
    height: "45px",
    padding: "0 13px 0 42px",
    boxSizing: "border-box",
    border: "1px solid #454545",
    borderRadius: "8px",
    outline: "none",
    background: "#202020",
    color: "#ffffff",
    fontSize: "12px",
    colorScheme: "dark",
  },

  submitButton: {
    marginTop: "20px",
    width: "100%",
    height: "46px",
    border: "1px solid #ef403a",
    borderRadius: "8px",
    background:
      "linear-gradient(180deg, #f13b36, #d31f1b)",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 5px 17px rgba(220,35,30,0.25)",
  },

  arrow: {
    marginLeft: "9px",
    fontSize: "16px",
  },

  requestsSection: {
    marginTop: "28px",
    padding: "25px",
    border: "1px solid #363636",
    borderRadius: "14px",
    background:
      "linear-gradient(145deg, rgba(24,24,24,0.97), rgba(8,8,8,0.97))",
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

  requestsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))",
    gap: "17px",
  },

  requestCard: {
    padding: "18px",
    border: "1px solid #3b3b3b",
    borderRadius: "11px",
    background:
      "linear-gradient(145deg, #1c1c1c, #101010)",
  },

  requestTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "10px",
  },

  companyName: {
    margin: 0,
    color: "#eeeeee",
    fontSize: "16px",
  },

  designation: {
    margin: "5px 0 0",
    color: "#777777",
    fontSize: "11px",
  },

  status: {
    padding: "5px 9px",
    borderRadius: "20px",
    fontSize: "9px",
    fontWeight: "700",
    textTransform: "uppercase",
  },

  statusVerified: {
    background: "#0d2919",
    border: "1px solid #24643d",
    color: "#51dc86",
  },

  statusPending: {
    background: "#29200d",
    border: "1px solid #715b20",
    color: "#e7bd51",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    marginTop: "17px",
    padding: "12px 0",
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
    fontSize: "9px",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },

  infoValue: {
    color: "#cccccc",
    fontSize: "11px",
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

  blockchainIcon: {
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

  blockchainButton: {
    width: "100%",
    height: "34px",
    marginTop: "11px",
    border: "1px solid #315b82",
    borderRadius: "6px",
    background: "#111e2b",
    color: "#66afff",
    fontSize: "10px",
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
    fontSize: "35px",
    color: "#555555",
  },

  blockchainDetails: {
    marginTop: "28px",
    padding: "25px",
    border: "1px solid #315a80",
    borderRadius: "14px",
    background:
      "linear-gradient(145deg, #111b26, #090d12)",
    boxShadow: "0 0 25px rgba(35,100,160,0.1)",
  },

  blockchainTitleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  blockchainTitle: {
    margin: 0,
    fontSize: "21px",
    color: "#eeeeee",
  },

  verifiedBadge: {
    padding: "7px 12px",
    borderRadius: "20px",
    background: "#0c2617",
    border: "1px solid #23643c",
    color: "#52d984",
    fontSize: "10px",
    fontWeight: "700",
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
  },

  hashValue: {
    color: "#76a9d2",
    fontSize: "10px",
    wordBreak: "break-all",
    lineHeight: "1.5",
  },

  blockchainVerified: {
    color: "#50d682",
    fontSize: "11px",
    fontWeight: "600",
  },

  blockchainLoading: {
    textAlign: "center",
    padding: "35px",
  },

  spinner: {
    width: "28px",
    height: "28px",
    margin: "0 auto 15px",
    border: "3px solid #293746",
    borderTop: "3px solid #4da3ff",
    borderRadius: "50%",
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
    boxShadow: "0 0 25px rgba(50,110,220,0.5)",
  },
};

export default EmployeeDashboard;