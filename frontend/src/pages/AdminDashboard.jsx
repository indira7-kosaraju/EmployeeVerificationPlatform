import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/users");

      setUsers(response.data.users);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const employeeCount = users.filter(
    (user) => user.role === "employee"
  ).length;

  const hrCount = users.filter(
    (user) => user.role === "hr"
  ).length;

  const adminCount = users.filter(
    (user) => user.role === "admin"
  ).length;

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingBox}>
          <div style={styles.loadingLogo}>EV</div>

          <h2>Loading Admin Dashboard</h2>

          <p>Securely loading user records...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.backgroundGlow}></div>
      <div style={styles.backgroundGlow2}></div>

      {/* HEADER */}
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
            Admin Portal
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

      {/* MAIN */}
      <main style={styles.container}>

        {/* PAGE HEADING */}
        <div style={styles.pageHeading}>
          <div>
            <p style={styles.smallTitle}>
              SYSTEM ADMINISTRATION
            </p>

            <h2 style={styles.mainTitle}>
              Admin Dashboard
            </h2>

            <p style={styles.mainDescription}>
              Manage registered users and monitor platform access.
            </p>
          </div>

          <div style={styles.securityBadge}>
            <span style={styles.greenDot}></span>
            System Secure
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div style={styles.errorMessage}>
            <span style={styles.messageIcon}>!</span>
            {error}
          </div>
        )}

        {/* STATISTICS */}
        <div style={styles.statsGrid}>

          <div style={styles.statCard}>
            <div style={styles.statIconUsers}>
              ♙
            </div>

            <div>
              <p style={styles.statLabel}>
                TOTAL USERS
              </p>

              <h3 style={styles.statNumber}>
                {users.length}
              </h3>

              <p style={styles.statText}>
                Registered accounts
              </p>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIconEmployee}>
              ◆
            </div>

            <div>
              <p style={styles.statLabel}>
                EMPLOYEES
              </p>

              <h3 style={styles.statNumber}>
                {employeeCount}
              </h3>

              <p style={styles.statText}>
                Employee accounts
              </p>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIconHR}>
              ◈
            </div>

            <div>
              <p style={styles.statLabel}>
                HR USERS
              </p>

              <h3 style={styles.statNumber}>
                {hrCount}
              </h3>

              <p style={styles.statText}>
                HR accounts
              </p>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIconAdmin}>
              ⚙
            </div>

            <div>
              <p style={styles.statLabel}>
                ADMINS
              </p>

              <h3 style={styles.statNumber}>
                {adminCount}
              </h3>

              <p style={styles.statText}>
                Administrator accounts
              </p>
            </div>
          </div>

        </div>

        {/* USERS SECTION */}
        <section style={styles.section}>

          <div style={styles.sectionHeader}>

            <div style={styles.sectionIcon}>
              ♙
            </div>

            <div>
              <h2 style={styles.sectionTitle}>
                All Users
              </h2>

              <p style={styles.sectionDescription}>
                View registered users and their platform information.
              </p>
            </div>

            <div style={styles.userCount}>
              {users.length} User
              {users.length !== 1 ? "s" : ""}
            </div>

          </div>

          <div style={styles.divider}></div>

          {users.length === 0 ? (

            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>
                ♙
              </div>

              <h3>No Users Found</h3>

              <p>
                No registered users are available.
              </p>
            </div>

          ) : (

            <div style={styles.usersGrid}>

              {users.map((user) => (

                <div
                  key={user._id}
                  style={styles.userCard}
                >

                  {/* USER HEADER */}
                  <div style={styles.userTop}>

                    <div style={styles.userIdentity}>

                      <div
                        style={{
                          ...styles.avatar,
                          ...(user.role === "admin"
                            ? styles.adminAvatar
                            : user.role === "hr"
                            ? styles.hrAvatar
                            : styles.employeeAvatar),
                        }}
                      >
                        {(user.name || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>

                        <h3 style={styles.userName}>
                          {user.name}
                        </h3>

                        <p style={styles.userEmail}>
                          {user.email}
                        </p>

                      </div>

                    </div>

                    <span
                      style={{
                        ...styles.roleBadgeSmall,
                        ...(user.role === "admin"
                          ? styles.adminRole
                          : user.role === "hr"
                          ? styles.hrRole
                          : styles.employeeRole),
                      }}
                    >
                      {user.role}
                    </span>

                  </div>

                  {/* USER DETAILS */}
                  <div style={styles.userDetails}>

                    {user.employeeId && (
                      <div style={styles.detailItem}>

                        <span style={styles.detailLabel}>
                          Employee ID
                        </span>

                        <span style={styles.detailValue}>
                          {user.employeeId}
                        </span>

                      </div>
                    )}

                    {user.company && (
                      <div style={styles.detailItem}>

                        <span style={styles.detailLabel}>
                          Company
                        </span>

                        <span style={styles.detailValue}>
                          {user.company}
                        </span>

                      </div>
                    )}

                    {user.designation && (
                      <div style={styles.detailItem}>

                        <span style={styles.detailLabel}>
                          Designation
                        </span>

                        <span style={styles.detailValue}>
                          {user.designation}
                        </span>

                      </div>
                    )}

                    {/* VERIFICATION */}
                    {user.verificationStatus && (
                      <div style={styles.detailItem}>

                        <span style={styles.detailLabel}>
                          Verification
                        </span>

                        <span
                          style={{
                            ...styles.verificationStatus,
                            ...(user.verificationStatus ===
                            "verified"
                              ? styles.verifiedStatus
                              : user.verificationStatus ===
                                "rejected"
                              ? styles.rejectedStatus
                              : styles.pendingStatus),
                          }}
                        >
                          {user.verificationStatus.toUpperCase()}
                        </span>

                      </div>
                    )}

                    {/* ACCOUNT CREATED */}
                    <div style={styles.detailItemFull}>

                      <span style={styles.detailLabel}>
                        Account Created
                      </span>

                      <span style={styles.detailValue}>
                        {new Date(
                          user.createdAt
                        ).toLocaleString()}
                      </span>

                    </div>

                  </div>

                  {/* ACCOUNT STATUS */}
                  <div style={styles.accountFooter}>

                    <div style={styles.activeStatus}>
                      <span style={styles.activeDot}></span>
                      Account Active
                    </div>

                    <span style={styles.secureText}>
                      🔒 Protected
                    </span>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

      {/* FOOTER */}
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
      "repeat(4, 1fr)",
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

  statIconUsers: {
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

  statIconEmployee: {
    width: "43px",
    height: "43px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#101d2d",
    border: "1px solid #244b73",
    color: "#65b4ff",
    fontSize: "18px",
  },

  statIconHR: {
    width: "43px",
    height: "43px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#241f0d",
    border: "1px solid #67551d",
    color: "#e6bf51",
    fontSize: "18px",
  },

  statIconAdmin: {
    width: "43px",
    height: "43px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#251313",
    border: "1px solid #672727",
    color: "#ff6660",
    fontSize: "18px",
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

  statText: {
    margin: 0,
    color: "#777777",
    fontSize: "9px",
  },

  section: {
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

  sectionIcon: {
    width: "35px",
    height: "35px",
    borderRadius: "9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#101d2d",
    border: "1px solid #244b73",
    color: "#55aaff",
    fontSize: "18px",
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

  userCount: {
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

  usersGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(340px, 1fr))",
    gap: "17px",
  },

  userCard: {
    padding: "18px",
    border: "1px solid #363636",
    borderRadius: "11px",
    background:
      "linear-gradient(145deg, #1a1a1a, #0e0e0e)",
  },

  userTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "10px",
  },

  userIdentity: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
  },

  avatar: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "15px",
    fontWeight: "700",
  },

  adminAvatar: {
    background:
      "linear-gradient(145deg, #592020, #241010)",
    border: "1px solid #7a3434",
    color: "#ff7770",
  },

  hrAvatar: {
    background:
      "linear-gradient(145deg, #594b19, #241e0c)",
    border: "1px solid #79652b",
    color: "#e9c95c",
  },

  employeeAvatar: {
    background:
      "linear-gradient(145deg, #173d60, #0d2034)",
    border: "1px solid #315d82",
    color: "#69b4ff",
  },

  userName: {
    margin: 0,
    color: "#eeeeee",
    fontSize: "15px",
  },

  userEmail: {
    margin: "4px 0 0",
    color: "#707070",
    fontSize: "10px",
  },

  roleBadgeSmall: {
    padding: "5px 9px",
    borderRadius: "20px",
    fontSize: "9px",
    fontWeight: "700",
    textTransform: "uppercase",
  },

  adminRole: {
    background: "#2b1111",
    border: "1px solid #6e2828",
    color: "#ff6963",
  },

  hrRole: {
    background: "#29200d",
    border: "1px solid #715b20",
    color: "#e7bd51",
  },

  employeeRole: {
    background: "#101f2e",
    border: "1px solid #315d82",
    color: "#65b4ff",
  },

  userDetails: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginTop: "17px",
    padding: "14px 0",
    borderTop: "1px solid #2d2d2d",
    borderBottom: "1px solid #2d2d2d",
  },

  detailItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "7px",
    minWidth: 0,
  },

  detailItemFull: {
    gridColumn: "1 / -1",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  detailLabel: {
    color: "#666666",
    fontSize: "8px",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },

  detailValue: {
    color: "#cccccc",
    fontSize: "10px",
    wordBreak: "break-word",
  },

  verificationStatus: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    width: "fit-content",
    minWidth: "74px",
    boxSizing: "border-box",
    padding: "7px 10px",
    borderRadius: "10px",
    fontSize: "8px",
    textTransform: "uppercase",
    fontWeight: "700",
    letterSpacing: "0.5px",
    lineHeight: "1",
  },

  verifiedStatus: {
    background: "#0c2617",
    border: "1px solid #23643c",
    color: "#52d984",
  },

  pendingStatus: {
    background: "#29200d",
    border: "1px solid #715b20",
    color: "#e7bd51",
  },

  rejectedStatus: {
    background: "#2b1111",
    border: "1px solid #6e2828",
    color: "#ff6963",
  },

  accountFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "13px",
  },

  activeStatus: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "#54d889",
    fontSize: "9px",
  },

  activeDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#43d47a",
    boxShadow: "0 0 7px #43d47a",
  },

  secureText: {
    color: "#555555",
    fontSize: "9px",
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
    background: "#101d2d",
    color: "#55aaff",
    fontSize: "21px",
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

export default AdminDashboard;