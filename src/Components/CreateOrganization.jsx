import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";
import { Building2, Plus, ArrowLeft, Loader2 } from "lucide-react";
import "../Components/CreateOrganization.css";

function CreateOrganization() {
  const [orgName, setOrgName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!orgName.trim()) {
      setError("Please enter organization name");
      return;
    }

    // ✅ Get user_id from localStorage (NON-JWT FLOW)
    const user_id = localStorage.getItem("user_id");

    if (!user_id) {
      setError("User not logged in. Please login again.");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/bugs/organization/create", {
        org_name: orgName,
        user_id: Number(user_id), // 👈 ensure number
      });

      console.log("✅ Organization created:", response.data);
      navigate("/admin/select-organization");
    } catch (err) {
      console.error("❌ Create org error:", err);

      if (err.response) {
        setError(err.response.data.error || "Error creating organization");
      } else if (err.request) {
        setError("Network error. Please check your connection.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-org-page">
      <div className="create-org-card">
        {/* Back Button */}
        <button
          className="back-btn"
          onClick={() => navigate("/admin/select-organization")}
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Header */}
        <div className="card-header">
          <div className="header-icon">
            <Building2 size={28} />
          </div>
          <h2>Create Organization</h2>
          <p>Set up a new organization for your team</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {error && <div className="error-msg">{error}</div>}

          <div className="form-group">
            <label>Organization Name</label>
            <input
              type="text"
              placeholder="Enter organization name"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              disabled={loading}
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={18} className="spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus size={18} />
                Create Organization
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateOrganization;
