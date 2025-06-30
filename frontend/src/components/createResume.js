import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const apiBase = "http://localhost:8000"; // Change if backend runs elsewhere

const CreateResume = ({ setResume }) => {
  const navigate = useNavigate();
  const [resumeValues, setResumeValues] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    emailId: '',
    contactNumber: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    nationality: '',
    heading: {
      heading: '',
      summary: ''
    },
    education: [{
      course: '',
      college: '',
      board: '',
      percentage: '',
      yearOfPass: ''
    }],
    experience: [{
      organisation: '',
      designation: '',
      from: '',
      to: ''
    }],
    skills: [{ skillName: '' }]
  });

  // AI Enhance handlers (for heading and summary only)
  const enhanceSection = async (section) => {
    let content = "";
    if (section === "heading") content = resumeValues.heading.heading;
    else if (section === "summary") content = resumeValues.heading.summary;
    else return;

    try {
      const res = await axios.post(`${apiBase}/ai-enhance`, {
        section,
        content
      });
      const improved = res.data.improved;
      if (section === "heading") {
        setResumeValues(prev => ({ ...prev, heading: { ...prev.heading, heading: improved } }));
      } else if (section === "summary") {
        setResumeValues(prev => ({ ...prev, heading: { ...prev.heading, summary: improved } }));
      }
    } catch (e) {
      console.error(e);
      alert("AI Enhance failed.");
    }
  };

  const handleChange = (e, field, section, index) => {
    const value = e.target.value;
    if (section) {
      setResumeValues(prev => {
        const updated = [...prev[section]];
        updated[index][field] = value;
        return { ...prev, [section]: updated };
      });
    } else if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setResumeValues(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setResumeValues(prev => ({ ...prev, [field]: value }));
    }
  };

  const addField = (section, template) => {
    setResumeValues(prev => ({
      ...prev,
      [section]: [...prev[section], template]
    }));
  };

  const deleteField = (e, section, index) => {
    e.preventDefault();
    setResumeValues(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const handlePreviewResume = (e) => {
    e.preventDefault();
    setResume(resumeValues);
    navigate('/resume-preview');
  };

  // Save Resume Handler
  const handleSaveResume = async () => {
    try {
      await axios.post(`${apiBase}/save-resume`, { resume: resumeValues });
      alert("Resume saved!");
    } catch (e) {
      alert("Failed to save resume.");
    }
  };

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4 text-success">Create Your Resume</h2>
      <form onSubmit={handlePreviewResume}>
        {/* Contact Info */}
        <h4 className="text-secondary">Contact Information</h4>
        <div className="row mb-3">
          {['firstName', 'middleName', 'lastName'].map((field, idx) => (
            <div className="col-md-4" key={idx}>
              <input
                type="text"
                className="form-control"
                placeholder={field.replace(/([A-Z])/g, ' $1')}
                value={resumeValues[field]}
                onChange={(e) => handleChange(e, field)}
                required={field !== 'middleName'}
              />
            </div>
          ))}
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <input
              type="email"
              className="form-control"
              placeholder="Email ID"
              value={resumeValues.emailId}
              onChange={(e) => handleChange(e, 'emailId')}
              required
            />
          </div>
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Contact Number"
              value={resumeValues.contactNumber}
              onChange={(e) => handleChange(e, 'contactNumber')}
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          {['address', 'city', 'state'].map((field, idx) => (
            <div className="col-md-4" key={idx}>
              <input
                type="text"
                className="form-control"
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={resumeValues[field]}
                onChange={(e) => handleChange(e, field)}
                required
              />
            </div>
          ))}
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Pincode"
              value={resumeValues.pincode}
              onChange={(e) => handleChange(e, 'pincode')}
              required
            />
          </div>
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Nationality"
              value={resumeValues.nationality}
              onChange={(e) => handleChange(e, 'nationality')}
              required
            />
          </div>
        </div>

        {/* Heading & Summary */}
        <h4 className="text-secondary mt-4 d-flex align-items-center">
          Resume Heading & Summary
          
        </h4>
        <div className="mb-3">
          <div className="d-flex align-items-center mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Heading (e.g. Full Stack Developer)"
              value={resumeValues.heading.heading}
              onChange={(e) => handleChange(e, 'heading.heading')}
              required
            />
            <button
              type="button"
              className="btn btn-outline-info btn-sm ms-2"
              onClick={() => enhanceSection("heading")}
              disabled={!resumeValues.heading.heading}
            >
              Enhance with AI
            </button>
          </div>
          <div className="d-flex align-items-center">
            <textarea
              className="form-control"
              placeholder="Summary"
              rows={3}
              value={resumeValues.heading.summary}
              onChange={(e) => handleChange(e, 'heading.summary')}
              required
            ></textarea>
            <button
              type="button"
              className="btn btn-outline-info btn-sm ms-2"
              onClick={() => enhanceSection("summary")}
              disabled={!resumeValues.heading.summary}
            >
              Enhance with AI
            </button>
          </div>
        </div>

        {/* Education */}
        <h4 className="text-secondary mt-4">Education</h4>
        {resumeValues.education.map((edu, i) => (
          <div className="border rounded p-3 mb-3" key={i}>
            {resumeValues.education.length > 1 && (
              <button className="btn btn-sm btn-danger float-end" onClick={(e) => deleteField(e, 'education', i)}>Delete</button>
            )}
            {Object.entries(edu).map(([field, val], idx) => (
              <div className="d-flex align-items-center mb-2" key={idx}>
                <input
                  type="text"
                  className="form-control"
                  placeholder={field.replace(/([A-Z])/g, ' $1')}
                  value={val}
                  onChange={(e) => handleChange(e, field, 'education', i)}
                />
              </div>
            ))}
          </div>
        ))}
        <button className="btn btn-success mb-3" onClick={(e) => {
          e.preventDefault();
          addField('education', {
            course: '', college: '', board: '', percentage: '', yearOfPass: ''
          });
        }}>
          Add Education
        </button>

        {/* Experience */}
        <h4 className="text-secondary mt-4">Experience</h4>
        {resumeValues.experience.map((exp, i) => (
          <div className="border rounded p-3 mb-3" key={i}>
            {resumeValues.experience.length > 1 && (
              <button className="btn btn-sm btn-danger float-end" onClick={(e) => deleteField(e, 'experience', i)}>Delete</button>
            )}
            {Object.entries(exp).map(([field, val], idx) => (
              <div className="d-flex align-items-center mb-2" key={idx}>
                <input
                  type="text"
                  className="form-control"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={val}
                  onChange={(e) => handleChange(e, field, 'experience', i)}
                />
              </div>
            ))}
          </div>
        ))}
        <button className="btn btn-success mb-3" onClick={(e) => {
          e.preventDefault();
          addField('experience', { organisation: '', designation: '', from: '', to: '' });
        }}>
          Add Experience
        </button>

        {/* Skills */}
        <h4 className="text-secondary mt-4">Skills</h4>
        {resumeValues.skills.map((skill, i) => (
          <div className="row mb-2" key={i}>
            <div className="col-md-10 d-flex align-items-center">
              <input
                type="text"
                className="form-control"
                placeholder="Skill"
                value={skill.skillName}
                onChange={(e) => handleChange(e, 'skillName', 'skills', i)}
              />
            </div>
            <div className="col-md-2">
              {resumeValues.skills.length > 1 && (
                <button className="btn btn-danger w-100" onClick={(e) => deleteField(e, 'skills', i)}>Delete</button>
              )}
            </div>
          </div>
        ))}
        <button className="btn btn-success mb-4" onClick={(e) => {
          e.preventDefault();
          addField('skills', { skillName: '' });
        }}>
          Add Skill
        </button>

        {/* Action buttons */}
        <div className="text-center">
          <button type="submit" className="btn btn-primary px-5 py-2 me-3">Preview Resume</button>
          <button
            type="button"
            className="btn btn-outline-primary px-5 py-2"
            onClick={handleSaveResume}
          >
            Save Resume
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateResume;