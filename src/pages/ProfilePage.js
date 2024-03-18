import React, { useState } from "react";
import Card from "../components/ui/Card";
import axios from "axios";
import classes from "./ProfilePage.module.css";

function ProfilePage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleUpdateProfile = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/updateProfile", {
        username,
        password,
        photo,
        email,
        phone,
      });
      setError("");
      setSuccess(true);
      console.log("Profile updated successfully:", response.data);
    } catch (error) {
      setError("Failed to update profile");
      console.error("Profile update failed:", error);
    }
  };

  return (
    <div className={classes.container}>
      <h1>Edit Profile</h1>
      <Card>
        <form className={classes.form} onSubmit={handleUpdateProfile}>
          <div className={classes.control}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className={classes.control}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className={classes.control}>
            <label htmlFor="photo">Photo URL</label>
            <input
              type="text"
              id="photo"
              value={photo}
              onChange={(e) => setPhoto(e.target.value)}
            />
          </div>
          <div className={classes.control}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={classes.control}>
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          {error && <p className={classes.error}>{error}</p>}
          {success && (
            <p className={classes.success}>Profile updated successfully!</p>
          )}
          <div className={classes.actions}>
            <button type="submit" className={classes.update}>
              Update Profile
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default ProfilePage;
