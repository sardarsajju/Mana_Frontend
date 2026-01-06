// Enhanced DeveloperProfile.jsx with lucide-react
import React, { useEffect, useState, useContext } from "react";
import API from "../api/axiosConfig";
import styles from "./DeveloperProfile.module.css";
import { AuthContext } from "../context/AuthContext";
import {
  Code2,
  User,
  Calendar,
  Bug,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Award,
  Activity,
  BarChart3
} from "lucide-react";

function DeveloperProfile() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.user_id) {
      loadProfile();
    }
  }, [user]);


  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const res = await API.get(`/auth/developer/profile/${user.user_id}`);
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

  const total = profile.total_assigned || 1;
  const openPercentage = ((profile.open_count / total) * 100).toFixed(1);
  const inProgressPercentage = ((profile.in_progress_count / total) * 100).toFixed(1);
  const resolvedPercentage = ((profile.resolved_count / total) * 100).toFixed(1);

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <div className={styles.header}>
          <div className={styles.avatarWrapper}>
            <div className={styles.avatar}>
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div className={styles.badge}>
              <Code2 size={16} />
              Developer
            </div>
          </div>
          <h1 className={styles.profileName}>{profile.name}</h1>
          <p className={styles.profileRole}>Software Developer</p>
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
              <Bug size={18} />
            </div>
            <div className={styles.infoContent}>
              <span className={styles.label}>Total Assigned</span>
              <span className={styles.value}>{profile.total_assigned} bugs</span>
            </div>
          </div>
        </div>

        <div className={styles.statsSection}>
          <h2 className={styles.sectionTitle}>
            <BarChart3 size={20} />
            Bug Resolution Stats
          </h2>

          <div className={styles.statsCards}>
            <div className={styles.statCard + ' ' + styles.openCard}>
              <div className={styles.statIcon}>
                <AlertCircle size={24} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{profile.open_count}</span>
                <span className={styles.statLabel}>Open</span>
              </div>
            </div>

            <div className={styles.statCard + ' ' + styles.progressCard}>
              <div className={styles.statIcon}>
                <Clock size={24} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{profile.in_progress_count}</span>
                <span className={styles.statLabel}>In Progress</span>
              </div>
            </div>

            <div className={styles.statCard + ' ' + styles.resolvedCard}>
              <div className={styles.statIcon}>
                <CheckCircle size={24} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{profile.resolved_count}</span>
                <span className={styles.statLabel}>Resolved</span>
              </div>
            </div>
          </div>

          <div className={styles.chartSection}>
            <h3 className={styles.chartTitle}>
              <Activity size={18} />
              Resolution Progress
            </h3>

            <div className={styles.barChart}>
              <div className={styles.barItem}>
                <div className={styles.barHeader}>
                  <span className={styles.barLabel}>Open</span>
                  <span className={styles.barCount}>
                    {profile.open_count} ({openPercentage}%)
                  </span>
                </div>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill + ' ' + styles.openBar}
                    style={{ width: `${openPercentage}%` }}
                  >
                    <span className={styles.barPercentage}>{openPercentage}%</span>
                  </div>
                </div>
              </div>

              <div className={styles.barItem}>
                <div className={styles.barHeader}>
                  <span className={styles.barLabel}>In Progress</span>
                  <span className={styles.barCount}>
                    {profile.in_progress_count} ({inProgressPercentage}%)
                  </span>
                </div>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill + ' ' + styles.progressBar}
                    style={{ width: `${inProgressPercentage}%` }}
                  >
                    <span className={styles.barPercentage}>{inProgressPercentage}%</span>
                  </div>
                </div>
              </div>

              <div className={styles.barItem}>
                <div className={styles.barHeader}>
                  <span className={styles.barLabel}>Resolved</span>
                  <span className={styles.barCount}>
                    {profile.resolved_count} ({resolvedPercentage}%)
                  </span>
                </div>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill + ' ' + styles.resolvedBar}
                    style={{ width: `${resolvedPercentage}%` }}
                  >
                    <span className={styles.barPercentage}>{resolvedPercentage}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.performanceMetric}>
              <Award size={20} />
              <span>Resolution Rate: </span>
              <strong>{resolvedPercentage}%</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeveloperProfile;