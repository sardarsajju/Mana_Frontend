// src/pages/LandingPage/LandingPage.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../Pages/LandingPage.module.css";
import { 
  Bug, 
  Shield, 
  Users, 
  FolderKanban, 
  MessageSquare, 
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  BarChart3,
  Lock
} from "lucide-react";
import AuthContext from "../../context/AuthContext";

function LandingPage() {
  const {user} = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(0);



  const stats = [
    { value: "10K+", label: "Bugs Resolved" },
    { value: "500+", label: "Active Projects" },
    { value: "1000+", label: "Happy Users" },
    { value: "99.9%", label: "Uptime" }
  ];

  useEffect(()=>{
    if (user){
      const redirect = {
        "super-admin": "/super-admin",
        "admin": "/admin/dashboard",
        "developer": "/bugs",
        "tester": "/tester/dashboard",
        
      };

      navigate(redirect[user.role]);
    }
  },[user]);
  


  return (
    <div className={styles.container}>
      {/* Background Effects */}
      <div className={styles.backgroundEffects}>
        <div className={styles.gradientOrb1}></div>
        <div className={styles.gradientOrb2}></div>
        <div className={styles.gridPattern}></div>
      </div>

      {/* Navigation */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <Bug size={32} />
          <span>BugTracker</span>
        </div>

        <div className={styles.navLinks}>
          <a href="#about">About</a>
          <a href="#portals">Get Started</a>

          <span
            className={styles.superAdminLink}
            onClick={() => navigate("/super-admin/login")}
          >
            Super Admin
          </span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <Sparkles size={16} />
            <span>Next-Gen Bug Tracking Platform</span>
          </div>
          
          <h1 className={styles.heroTitle}>
            Track Bugs.
            <span className={styles.gradientText}> Ship Faster.</span>
          </h1>
          
          <p className={styles.heroDescription}>
            Streamline your bug tracking workflow with our powerful, intuitive platform. 
            Connect testers, developers, and admins seamlessly for faster issue resolution.
          </p>

          <div className={styles.heroCTA}>
            <button 
              className={styles.primaryBtn}
              onClick={() =>
                document
                  .getElementById("portals")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              Get Started
              <ArrowRight size={20} />
            </button>

            <button className={styles.secondaryBtn}>
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className={styles.statsRow}>
            {stats.map((stat, index) => (
              <div key={index} className={styles.statItem}>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Portal Selection Section - LOGIN ONLY */}
      <section id="portals" className={styles.portals}>
        <div className={styles.sectionHeader}>
          <h2>Access Portal</h2>
          <p>Login to your account as Admin, Tester, or Developer</p>
        </div>

        <div className={styles.portalCards}>
          {/* Universal Login Portal - Centered Single Card */}
          <div className={`${styles.portalCard} ${styles.singleCard}`}>
            <div className={styles.portalIcon}>
              <Shield size={48} />
            </div>
            <div className={styles.portalBadge}>All Roles</div>
            <h3>Login Portal</h3>
            <p>
              Access the platform with your credentials. Choose your role during login:
              Administrator, Tester, or Developer.
            </p>
            <ul className={styles.portalFeatures}>
              <li><CheckCircle2 size={16} /> Admin: Manage organizations & projects</li>
              <li><CheckCircle2 size={16} /> Tester: Report & track bugs</li>
              <li><CheckCircle2 size={16} /> Developer: Fix & resolve issues</li>
              <li><CheckCircle2 size={16} /> Role-based access control</li>
              <li><CheckCircle2 size={16} /> Secure authentication</li>
            </ul>
            <div className={styles.portalActions}>
              <button 
                className={styles.portalLoginBtn}
                onClick={() => navigate("/user/login")}
              >
                <Lock size={18} />
                Login to Portal
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={styles.about}>
        <div className={styles.aboutContent}>
          <div className={styles.aboutText}>
            <h2>Why Choose BugTracker?</h2>
            <p>
              BugTracker is designed to streamline your software development workflow 
              by providing a centralized platform for bug tracking, team collaboration, 
              and project management.
            </p>
            <div className={styles.benefitsList}>
              <div className={styles.benefit}>
                <Zap size={24} />
                <div>
                  <h4>Lightning Fast</h4>
                  <p>Quick bug reporting and instant notifications</p>
                </div>
              </div>
              <div className={styles.benefit}>
                <Lock size={24} />
                <div>
                  <h4>Secure</h4>
                  <p>Role-based access control and data protection</p>
                </div>
              </div>
              <div className={styles.benefit}>
                <Users size={24} />
                <div>
                  <h4>Collaborative</h4>
                  <p>Real-time chat and team coordination</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>
            <Bug size={24} />
            <span>BugTracker</span>
          </div>
          <p>© 2024 BugTracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;