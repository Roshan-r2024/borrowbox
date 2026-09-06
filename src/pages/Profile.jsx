import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const API_URL = "http://localhost:5000";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");

  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [passwordOpen, setPasswordOpen] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");


  /* =========================
     LOAD PROFILE
  ========================= */

  useEffect(() => {
    const storedUser =
      localStorage.getItem("borrowBoxUser");

    if (!storedUser) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);

      if (!parsedUser.email) {
        navigate("/login", { replace: true });
        return;
      }

      loadProfile(parsedUser.email);

    } catch (err) {
      console.error("User data error:", err);

      localStorage.removeItem("borrowBoxUser");

      navigate("/login", { replace: true });
    }
  }, [navigate]);


  /* =========================
     GET PROFILE
  ========================= */

  const loadProfile = async (email) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/auth/profile/${encodeURIComponent(email)}`
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Unable to load profile."
        );
        setLoading(false);
        return;
      }

      setUser(data.user);

      setNickname(data.user.nickname || "");
      setPhone(data.user.phone || "");

      if (data.user.profilePicture) {
        setImagePreview(
          data.user.profilePicture.startsWith("http")
            ? data.user.profilePicture
            : `${API_URL}${data.user.profilePicture}`
        );
      } else {
        setImagePreview("");
      }

      localStorage.setItem(
        "borrowBoxUser",
        JSON.stringify(data.user)
      );

    } catch (err) {
      console.error("Profile loading error:", err);

      setError(
        "Cannot connect to Borrow Box server. Make sure the backend is running."
      );

    } finally {
      setLoading(false);
    }
  };


  /* =========================
     IMAGE SELECT
  ========================= */

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Please select a JPG, JPEG, PNG or WEBP image."
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Profile picture must be less than 5MB."
      );
      return;
    }

    setError("");
    setProfileImage(file);

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };


  /* =========================
     OPEN EDIT PROFILE
  ========================= */

  const handleEditProfile = () => {
    if (!user) return;

    setNickname(user.nickname || "");
    setPhone(user.phone || "");
    setProfileImage(null);

    if (user.profilePicture) {
      setImagePreview(
        user.profilePicture.startsWith("http")
          ? user.profilePicture
          : `${API_URL}${user.profilePicture}`
      );
    } else {
      setImagePreview("");
    }

    setMessage("");
    setError("");

    setEditOpen(true);
  };


  /* =========================
     SAVE PROFILE
  ========================= */

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!nickname.trim()) {
      setError("Nickname is required.");
      return;
    }

    if (
      phone.trim() &&
      !/^[0-9]{10}$/.test(phone.trim())
    ) {
      setError(
        "Phone number must contain exactly 10 digits."
      );
      return;
    }

    if (!user?.email) {
      setError("User email not found.");
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();

      formData.append(
        "email",
        user.email
      );

      formData.append(
        "nickname",
        nickname.trim()
      );

      formData.append(
        "phone",
        phone.trim()
      );

      if (profileImage) {
        formData.append(
          "profilePicture",
          profileImage
        );
      }

      const response = await fetch(
        `${API_URL}/api/auth/profile`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Unable to update profile."
        );
        setSaving(false);
        return;
      }

      setUser(data.user);

      localStorage.setItem(
        "borrowBoxUser",
        JSON.stringify(data.user)
      );

      if (data.user.profilePicture) {
        setImagePreview(
          data.user.profilePicture.startsWith("http")
            ? data.user.profilePicture
            : `${API_URL}${data.user.profilePicture}`
        );
      }

      setProfileImage(null);

      setMessage(
        "Profile updated successfully."
      );

      setEditOpen(false);

    } catch (err) {
      console.error(
        "Update profile error:",
        err
      );

      setError(
        "Cannot connect to Borrow Box server."
      );

    } finally {
      setSaving(false);
    }
  };


  /* =========================
     CHANGE PASSWORD
  ========================= */

  const handleChangePassword = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (
      !currentPassword ||
      !newPassword ||
      !confirmNewPassword
    ) {
      setError(
        "Please fill all password fields."
      );
      return;
    }

    if (newPassword.length < 6) {
      setError(
        "New password must be at least 6 characters."
      );
      return;
    }

    if (
      newPassword !== confirmNewPassword
    ) {
      setError(
        "New passwords do not match."
      );
      return;
    }

    if (
      currentPassword === newPassword
    ) {
      setError(
        "New password must be different from your current password."
      );
      return;
    }

    if (!user?.email) {
      setError("User email not found.");
      return;
    }

    setChangingPassword(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/change-password`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email: user.email,
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Unable to change password."
        );

        setChangingPassword(false);
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");

      setPasswordOpen(false);

      setMessage(
        "Password changed successfully."
      );

    } catch (err) {
      console.error(
        "Change password error:",
        err
      );

      setError(
        "Cannot connect to Borrow Box server."
      );

    } finally {
      setChangingPassword(false);
    }
  };


  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = () => {
    localStorage.removeItem(
      "borrowBoxUser"
    );

    localStorage.removeItem(
      "borrowBoxEmail"
    );

    navigate("/login", {
      replace: true,
    });
  };


  /* =========================
     PROFILE IMAGE URL
  ========================= */

  const getProfileImage = () => {
    if (imagePreview) {
      return imagePreview;
    }

    if (user?.profilePicture) {
      if (
        user.profilePicture.startsWith(
          "http"
        )
      ) {
        return user.profilePicture;
      }

      return `${API_URL}${user.profilePicture}`;
    }

    return "";
  };


  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <div className="profile-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }


  /* =========================
     NO USER
  ========================= */

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-empty">
          <h2>Profile unavailable</h2>

          <button
            onClick={() =>
              navigate("/login")
            }
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="profile-page">

      {/* =========================
          HEADER
      ========================= */}

      <header className="profile-header">

        <div
          className="profile-brand"
          onClick={() =>
            navigate("/home")
          }
        >
          <div className="profile-brand-logo">
            ◇
          </div>

          <div>
            <h2>Borrow Box</h2>

            <span>
              Campus sharing
            </span>
          </div>
        </div>


        <button
          className="profile-back-button"
          onClick={() =>
            navigate("/home")
          }
        >
          ← Back to Home
        </button>

      </header>


      {/* =========================
          MAIN
      ========================= */}

      <main className="profile-main">

        <div className="profile-heading">

          <span className="profile-tag">
            ACCOUNT
          </span>

          <h1>My Profile</h1>

          <p>
            Manage your Borrow Box
            account information.
          </p>

        </div>


        {message && (
          <div className="profile-success">
            ✓ {message}
          </div>
        )}


        {error && (
          <div className="profile-error">
            {error}
          </div>
        )}


        {/* =========================
            PROFILE CARD
        ========================= */}

        <section className="profile-card">

          <div className="profile-top">

            <div className="profile-avatar">

              {getProfileImage() ? (
                <img
                  src={getProfileImage()}
                  alt="Profile"
                />
              ) : (
                <span>
                  {user.nickname
                    ? user.nickname
                        .charAt(0)
                        .toUpperCase()
                    : "U"}
                </span>
              )}

            </div>


            <div className="profile-name">

              <h2>
                {user.nickname}
              </h2>

              <p>
                VIT Student
              </p>

            </div>


            <button
              className="profile-edit-button"
              onClick={
                handleEditProfile
              }
            >
              Edit Profile
            </button>

          </div>


          <div className="profile-divider"></div>


          {/* =========================
              ACCOUNT DETAILS
          ========================= */}

          <div className="profile-details">

            <div className="profile-detail">

              <span className="detail-label">
                Nickname
              </span>

              <strong>
                {user.nickname || "Not set"}
              </strong>

            </div>


            <div className="profile-detail">

              <span className="detail-label">
                College Email
              </span>

              <div className="email-detail">

                <strong>
                  {user.email}
                </strong>

                <span className="locked-badge">
                  🔒 Locked
                </span>

              </div>

              <small>
                Email cannot be changed
                after registration.
              </small>

            </div>


            <div className="profile-detail">

              <span className="detail-label">
                Phone Number
              </span>

              <strong>
                {user.phone ||
                  "Not added"}
              </strong>

            </div>


            <div className="profile-detail">

              <span className="detail-label">
                Account Type
              </span>

              <strong>
                VIT Student
              </strong>

            </div>

          </div>


          <div className="profile-divider"></div>


          {/* =========================
              ACTIONS
          ========================= */}

          <div className="profile-actions">

            <button
              className="profile-action-button"
              onClick={() =>
                setPasswordOpen(true)
              }
            >
              Change Password
            </button>


            <button
              className="profile-action-button"
              onClick={() =>
                navigate("/my-items")
              }
            >
              My Items
            </button>


            <button
              className="profile-logout-button"
              onClick={handleLogout}
            >
              Log Out
            </button>

          </div>

        </section>

      </main>


      {/* =========================
          EDIT PROFILE MODAL
      ========================= */}

      {editOpen && (
        <div className="profile-modal-overlay">

          <div className="profile-modal">

            <div className="modal-header">

              <div>
                <span className="profile-tag">
                  ACCOUNT
                </span>

                <h2>
                  Edit Profile
                </h2>

                <p>
                  Update your profile
                  information.
                </p>
              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setEditOpen(false)
                }
              >
                ×
              </button>

            </div>


            <form
              onSubmit={
                handleSaveProfile
              }
            >

              {/* PROFILE PICTURE */}

              <div className="edit-picture-section">

                <div className="edit-picture">

                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                    />
                  ) : (
                    <span>
                      {nickname
                        ? nickname
                            .charAt(0)
                            .toUpperCase()
                        : "U"}
                    </span>
                  )}

                </div>


                <div className="picture-controls">

                  <label
                    htmlFor="profilePicture"
                    className="change-picture-button"
                  >
                    Change Picture
                  </label>

                  <input
                    id="profilePicture"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={
                      handleImageChange
                    }
                    hidden
                  />

                  <small>
                    JPG, PNG or WEBP.
                    Maximum 5MB.
                  </small>

                </div>

              </div>


              {/* NICKNAME */}

              <div className="modal-field">

                <label htmlFor="nickname">
                  Nickname
                </label>

                <input
                  id="nickname"
                  type="text"
                  value={nickname}
                  onChange={(e) =>
                    setNickname(
                      e.target.value
                    )
                  }
                  placeholder="Enter your nickname"
                />

              </div>


              {/* PHONE */}

              <div className="modal-field">

                <label htmlFor="phone">
                  Phone Number
                </label>

                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(
                      e.target.value.replace(
                        /\D/g,
                        ""
                      ).slice(0, 10)
                    )
                  }
                  placeholder="Enter 10 digit phone number"
                  maxLength="10"
                />

              </div>


              {/* EMAIL */}

              <div className="modal-field">

                <label htmlFor="lockedEmail">
                  College Email
                </label>

                <div className="locked-input">

                  <input
                    id="lockedEmail"
                    type="email"
                    value={user.email}
                    disabled
                    readOnly
                  />

                  <span>
                    🔒
                  </span>

                </div>

                <small>
                  Your registered email
                  cannot be changed.
                </small>

              </div>


              {error && (
                <div className="modal-error">
                  {error}
                </div>
              )}


              <div className="modal-buttons">

                <button
                  type="button"
                  className="modal-cancel"
                  onClick={() =>
                    setEditOpen(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="modal-save"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}


      {/* =========================
          CHANGE PASSWORD MODAL
      ========================= */}

      {passwordOpen && (
        <div className="profile-modal-overlay">

          <div className="profile-modal password-modal">

            <div className="modal-header">

              <div>
                <span className="profile-tag">
                  SECURITY
                </span>

                <h2>
                  Change Password
                </h2>

                <p>
                  Create a new password
                  for your account.
                </p>
              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setPasswordOpen(false)
                }
              >
                ×
              </button>

            </div>


            <form
              onSubmit={
                handleChangePassword
              }
            >

              <div className="modal-field">

                <label htmlFor="currentPassword">
                  Current Password
                </label>

                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) =>
                    setCurrentPassword(
                      e.target.value
                    )
                  }
                  placeholder="Enter current password"
                />

              </div>


              <div className="modal-field">

                <label htmlFor="newPassword">
                  New Password
                </label>

                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(
                      e.target.value
                    )
                  }
                  placeholder="Enter new password"
                />

              </div>


              <div className="modal-field">

                <label htmlFor="confirmNewPassword">
                  Confirm New Password
                </label>

                <input
                  id="confirmNewPassword"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) =>
                    setConfirmNewPassword(
                      e.target.value
                    )
                  }
                  placeholder="Re-enter new password"
                />

              </div>


              <div className="password-note">
                Password must contain
                at least 6 characters.
              </div>


              {error && (
                <div className="modal-error">
                  {error}
                </div>
              )}


              <div className="modal-buttons">

                <button
                  type="button"
                  className="modal-cancel"
                  onClick={() =>
                    setPasswordOpen(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="modal-save"
                  disabled={
                    changingPassword
                  }
                >
                  {changingPassword
                    ? "Changing..."
                    : "Change Password"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default Profile;