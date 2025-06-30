import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';

const ResumePreview = ({ resumeValues }) => {
  const resumeRef = useRef();
  const navigate = useNavigate();

  const handleDownloadPDF = () => {
    const element = resumeRef.current;
    html2pdf()
      .set({
        margin: 0.5,
        filename: 'Resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      })
      .from(element)
      .save();
  };

  const hasHeadingOrSummary = resumeValues.heading?.heading?.trim() || resumeValues.heading?.summary?.trim();
  const hasEducation = Array.isArray(resumeValues.education) && resumeValues.education.some(
    edu => edu.course || edu.college || edu.board || edu.percentage || edu.yearOfPass
  );
  const hasExperience = Array.isArray(resumeValues.experience) && resumeValues.experience.some(
    exp => exp.organisation || exp.designation || exp.from || exp.to
  );
  const hasSkills = Array.isArray(resumeValues.skills) && resumeValues.skills.some(
    s => s.skillName
  );

  return (
    <>
      {/* Bootstrap Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-success sticky-top">
        <div className="container-fluid">
          <span className="navbar-brand">Resume Preview</span>
          <div className="ms-auto d-flex gap-2">
            <button className="btn btn-light" onClick={() => navigate('/')}>Home</button>
            <button className="btn btn-light" onClick={() => navigate('/create-resume')}>Edit Resume</button>
            <button className="btn btn-warning" onClick={handleDownloadPDF}>Download PDF</button>
          </div>
        </div>
      </nav>

      {/* Resume Content */}
      <div ref={resumeRef} className="resume-preview p-4">
        <div className="resume-container">
          <header className="text-center border-bottom pb-3">
            <h1>
              {[resumeValues.firstName, resumeValues.middleName, resumeValues.lastName].filter(Boolean).join(' ')}
            </h1>
            <p>
              {resumeValues.emailId && <>Email: {resumeValues.emailId}</>}
              {(resumeValues.emailId && resumeValues.contactNumber) && ' | '}
              {resumeValues.contactNumber && <>Phone: {resumeValues.contactNumber}</>}
            </p>
            <p>
              {[resumeValues.city, resumeValues.state].filter(Boolean).join(', ')}
              {(resumeValues.city || resumeValues.state) && resumeValues.pincode ? ` - ${resumeValues.pincode}` : resumeValues.pincode}
              {resumeValues.nationality && ` | Nationality: ${resumeValues.nationality}`}
            </p>
            {resumeValues.address && <p>{resumeValues.address}</p>}
          </header>

          {hasHeadingOrSummary && (
            <section className="section mt-4">
              <h2>Professional Summary</h2>
              {resumeValues.heading.heading && <h4>{resumeValues.heading.heading}</h4>}
              {resumeValues.heading.summary && <p>{resumeValues.heading.summary}</p>}
            </section>
          )}

          {hasEducation && (
            <section className="section mt-4">
              <h2>Education</h2>
              {resumeValues.education.map((edu, i) => (
                (edu.course || edu.college || edu.board || edu.percentage || edu.yearOfPass) && (
                  <div className="education-entry mb-3" key={i}>
                    {edu.course && <h5>{edu.course}</h5>}
                    {(edu.college || edu.board) && <p>{[edu.college, edu.board].filter(Boolean).join(' - ')}</p>}
                    {(edu.percentage || edu.yearOfPass) && (
                      <p>
                        {edu.percentage && <>Percentage: {edu.percentage}</>}
                        {edu.percentage && edu.yearOfPass && ' | '}
                        {edu.yearOfPass && <>Year: {edu.yearOfPass}</>}
                      </p>
                    )}
                  </div>
                )
              ))}
            </section>
          )}

          {hasExperience && (
            <section className="section mt-4">
              <h2>Experience</h2>
              {resumeValues.experience.map((exp, i) => (
                (exp.designation || exp.organisation || exp.from || exp.to) && (
                  <div className="experience-entry mb-3" key={i}>
                    {(exp.designation || exp.organisation) && (
                      <h5>{[exp.designation, exp.organisation].filter(Boolean).join(' at ')}</h5>
                    )}
                    {(exp.from || exp.to) && (
                      <p>
                        {exp.from && <>From: {exp.from}</>}
                        {exp.from && exp.to && ' – '}
                        {exp.to && <>To: {exp.to}</>}
                      </p>
                    )}
                  </div>
                )
              ))}
            </section>
          )}

          {hasSkills && (
            <section className="section mt-4">
              <h2>Skills</h2>
              <ul className="skills-list d-flex flex-wrap list-unstyled">
                {resumeValues.skills.map((s, i) =>
                  s.skillName && <li key={i} className="badge bg-primary text-white me-2 mb-2 p-2">{s.skillName}</li>
                )}
              </ul>
            </section>
          )}

          <section className="section mt-4">
            <h2>Declaration</h2>
            <p>
              I hereby declare that the information provided above is true and correct to the best of my knowledge and belief.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default ResumePreview;
