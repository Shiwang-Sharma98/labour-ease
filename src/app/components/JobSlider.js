"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const JobPostingsSlider = () => {
  const router = useRouter();
  const [jobPostings, setJobPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedJob, setExpandedJob] = useState(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  useEffect(() => {
    const fetchJobPostings = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/getJobPostings");
        const data = await response.json();

        if (data?.jobs && Array.isArray(data.jobs)) {
          setJobPostings(data.jobs);
        } else {
          setError("Invalid data format received");
        }
      } catch (err) {
        console.error("Error fetching job postings:", err);
        setError("Failed to fetch job postings");
      } finally {
        setLoading(false);
      }
    };

    fetchJobPostings();
  }, []);

  const handleApplyClick = () => {
    router.push("/login");
  };

  const handleReadMore = (job) => {
    setExpandedJob(job);
  };

  const closeModal = () => {
    setExpandedJob(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center p-8 rounded-lg shadow-md max-w-lg mx-auto bg-card text-card-foreground">
        <div className="w-8 h-8 border-4 border-t-4 border-foreground rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-foreground">Loading job postings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 rounded-lg shadow-md max-w-lg mx-auto bg-card">
        <p className="text-lg text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative max-w-4xl mx-auto p-6">
      <div className="slider-theme-wrapper">
        <Slider {...settings}>
          {jobPostings.map((job) => (
            <div key={job.job_id} className="px-4 py-6">
              <div className="job-card bg-card text-card-foreground p-6 rounded-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition duration-300 ease-in-out">
                <h2 className="text-2xl font-bold mb-4">{job.title}</h2>
                <p className="mb-6">
                  {job.description.length > 300
                    ? `${job.description.substring(0, 300)}...`
                    : job.description}
                </p>
                <div className="flex justify-center gap-6">
                  <button
                    onClick={handleApplyClick}
                    className="
                      px-6 py-2
                      bg-primary text-primary-foreground
                      rounded-md
                      hover:bg-primary/90
                      transition duration-300
                    "
                  >
                    Apply Now
                  </button>
                  {job.description.length > 300 && (
                    <button
                      onClick={() => handleReadMore(job)}
                      className="
                        px-6 py-2
                        border-2 border-foreground
                        text-foreground
                        rounded-md
                        hover:bg-foreground/10
                        transition duration-300
                      "
                    >
                      Read More
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {expandedJob && (
        <div
          className="fixed inset-0 bg-foreground/50 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-card text-card-foreground rounded-lg p-6 max-w-xl w-full relative overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-3xl font-semibold mb-4">{expandedJob.title}</h2>
            <p className="mb-6">{expandedJob.description}</p>
            <button
              onClick={closeModal}
              className="
                px-6 py-2
                bg-primary text-primary-foreground
                rounded-md
                hover:bg-primary/90
                transition duration-300
              "
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobPostingsSlider;
