// Enhanced TesterProfile.jsx with lucide-react
import React, { useEffect, useState, useContext } from "react";
import API from "../api/axiosConfig";
import styles from "./TesterProfile.module.css";
import { AuthContext } from "../context/AuthContext";
import { 
  User, 
  Calendar, 
  Bug, 
  CheckCircle,
  Award,
  Activity,
  Mail,
  Shield
} from "lucide-react";

function TesterProfile() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const res = await API.get(`/auth/tester/profile/${user.id}`);
      setProfile(res.data);
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingWrapper}>
          <div className={styles.spinner}></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={styles.container}>
        <p>Unable to load profile</p>
      </div>
    );
  }

  const resolveRate = profile.total_raised > 0 
    ? ((profile.resolved / profile.total_raised) * 100).toFixed(1)
    : 0;

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <div className={styles.header}>
          <div className={styles.avatarWrapper}>
            <div className={styles.avatar}>
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div className={styles.badge}>
              <Shield size={16} />
              Tester
            </div>
          </div>
          <h1 className={styles.profileName}>{profile.name}</h1>
          <p className={styles.profileEmail}>{profile.email || user.email}</p>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.infoItem}>
            <div className={styles.infoIcon}>
              <User size={18} />
            </div>
            <div className={styles.infoContent}>
              <span className={styles.label}>Full Name</span>
              <span className={styles.value}>{profile.name}</span>
            </div>
          </div>

          <div className={styles.infoItem}>
            <div className={styles.infoIcon}>
              <Calendar size={18} />
            </div>
            <div className={styles.infoContent}>
              <span className={styles.label}>Member Since</span>
              <span className={styles.value}>
                {new Date(profile.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>

          <div className={styles.infoItem}>
            <div className={styles.infoIcon}>
              <Mail size={18} />
            </div>
            <div className={styles.infoContent}>
              <span className={styles.label}>Role</span>
              <span className={styles.value}>Quality Assurance Tester</span>
            </div>
          </div>
        </div>

        <div className={styles.statsSection}>
          <h2 className={styles.sectionTitle}>
            <Activity size={20} />
            Bug Statistics
          </h2>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon + ' ' + styles.bugIcon}>
                <Bug size={24} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{profile.total_raised}</span>
                <span className={styles.statLabel}>Bugs Raised</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon + ' ' + styles.resolvedIcon}>
                <CheckCircle size={24} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{profile.resolved}</span>
                <span className={styles.statLabel}>Resolved</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon + ' ' + styles.rateIcon}>
                <Award size={24} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{resolveRate}%</span>
                <span className={styles.statLabel}>Resolve Rate</span>
              </div>
            </div>
          </div>

          <div className={styles.progressBar}>
            <div className={styles.progressLabel}>
              <span>Resolution Progress</span>
              <span>{profile.resolved} / {profile.total_raised}</span>
            </div>
            <div className={styles.progressTrack}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${resolveRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TesterProfile;