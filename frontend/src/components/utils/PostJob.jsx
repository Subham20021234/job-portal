import { useState } from "react";
import axios from "axios";

export default function PostJob({ onJobPosted }) {
  const [jobData, setJobData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
  });

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/jobs",
        jobData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(res.data.message || "Job posted successfully!");
      setJobData({
        title: "",
        company: "",
        location: "",
        salary: "",
        description: "",
      });

      if (onJobPosted) onJobPosted();  
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to post job");
    }
  };

  return (
    <div className="container my-4">
      <h3>Post a New Job</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={jobData.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="company"
          placeholder="Company Name"
          value={jobData.company}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={jobData.location}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="salary"
          placeholder="Salary"
          value={jobData.salary}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Job Description"
          value={jobData.description}
          onChange={handleChange}
          required
        ></textarea>

        <button type="submit">Post Job</button>
      </form>
    </div>
  );
}
