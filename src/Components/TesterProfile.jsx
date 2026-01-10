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
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check for user_id (not id)
    if (user && user.user_id) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Use user.user_id instead of user.id
      const res = await API.get(`/auth/tester/profile/${user.user_id}`);
      setProfile(res.data);
    } catch (error) {
      console.error("Error loading profile:", error);
      setError("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while waiting for user context
  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingWrapper}>
          <div className={styles.spinner}></div>
          <p>Authenticating...</p>
        </div>
      </div>
    );
  }

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

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorWrapper}>
          <p>{error}</p>
          <button onClick={loadProfile} className={styles.retryButton}>
            Retry
          </button>
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
              {profile.name?.charAt(0).toUpperCase() || user.name?.charAt(0).toUpperCase() || 'T'}
            </div>
            <div className={styles.badge}>
              <Shield size={16} />
              Tester
            </div>
          </div>
          <h1 className={styles.profileName}>{profile.name || user.name}</h1>
          <p className={styles.profileEmail}>{profile.email || "No email available"}</p>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.infoItem}>
            <div className={styles.infoIcon}>
              <User size={18} />
            </div>
            <div className={styles.infoContent}>
              <span className={styles.label}>Full Name</span>
              <span className={styles.value}>{profile.name || user.name}</span>
            </div>
          </div>

          <div className={styles.infoItem}>
            <div className={styles.infoIcon}>
              <Calendar size={18} />
            </div>
            <div className={styles.infoContent}>
              <span className={styles.label}>Member Since</span>
              <span className={styles.value}>
                {profile.created_at 
                  ? new Date(profile.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : 'N/A'
                }
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
              <div className={`${styles.statIcon} ${styles.bugIcon}`}>
                <Bug size={24} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{profile.total_raised || 0}</span>
                <span className={styles.statLabel}>Bugs Raised</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={`${styles.statIcon} ${styles.resolvedIcon}`}>
                <CheckCircle size={24} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{profile.resolved || 0}</span>
                <span className={styles.statLabel}>Resolved</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={`${styles.statIcon} ${styles.rateIcon}`}>
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
              <span>{profile.resolved || 0} / {profile.total_raised || 0}</span>
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