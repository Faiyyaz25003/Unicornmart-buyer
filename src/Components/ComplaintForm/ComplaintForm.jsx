"use client";
import { useState } from "react";
import axios from "axios";

export default function ComplaintForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/complaints", form);
    alert("Complaint Submitted");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Complaint Form</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          value={form.name}
        />
        <br />
        <br />
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={form.email}
        />
        <br />
        <br />
        <input
          name="subject"
          placeholder="Subject"
          onChange={handleChange}
          value={form.subject}
        />
        <br />
        <br />
        <textarea
          name="message"
          placeholder="Message"
          onChange={handleChange}
          value={form.message}
        ></textarea>
        <br />
        <br />
        <button type="submit">Submit Complaint</button>
      </form>
    </div>
  );
}
