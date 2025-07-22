import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import "./AboutSection.css";
import anushkaPic from "../public/assets/anushka_pic.jpg";
import akshayPic from "../public/assets/akshay_pic.jpg";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const slideFromLeft = {
  hidden: { opacity: 0, x: -80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const slideFromRight = {
  hidden: { opacity: 0, x: 80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// Animated section component
const AnimatedSection = ({
  children,
  className,
  direction = "up",
  delay = 0,
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
    rootMargin: "-50px 0px",
  });

  const getAnimationVariant = () => {
    switch (direction) {
      case "left":
        return slideFromLeft;
      case "right":
        return slideFromRight;
      case "scale":
        return scaleIn;
      default:
        return fadeInUp;
    }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={getAnimationVariant()}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
};

const AboutSection = () => {
  const [timelineHeight, setTimelineHeight] = useState(0);
  const timelineRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const section = sectionRef.current;
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;

      // Calculate scroll progress within the section
      const sectionStart = sectionTop - windowHeight * 0.5;
      const sectionEnd = sectionTop + sectionHeight - windowHeight * 0.5;
      const scrollProgress = Math.max(
        0,
        Math.min(1, (scrollTop - sectionStart) / (sectionEnd - sectionStart))
      );

      // Update timeline height based on scroll progress
      const maxHeight = sectionHeight * 0.6;
      setTimelineHeight(scrollProgress * maxHeight);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const developers = [
    {
      name: "Anushka Gupta",
      role: "Lead Developer",
      initials: "AG",
      gradient: "linear-gradient(135deg, #ec4899, #8b5cf6)",
      color: "#ec4899",
      picture: anushkaPic,
      achievements: [
        "Full-stack MERN Developer with a strong command of React, Node.js, Express, and MongoDB",
        "Winner AIML Hackathon under Avishkar'24",
        "RunnerUp Tech-Maiden",
      ],
      side: "left",
    },
    {
      name: "Akshay Yadav",
      role: "Frontend Architect",
      initials: "AY",
      gradient: "linear-gradient(135deg, #3b82f6, #06b6d4)",
      color: "#3b82f6",
      picture: akshayPic,
      achievements: [
        "Full-Stack Developer & UI/UX Designer",
        "GSoc Contributer 2024",
        "React.js Expert with 4+ projects",
        "Founder of Horizon-lab",
        "Code-forces:1100",
        "2nd Runner up Doodle bot"
      ],
      side: "right",
    },
  ];

  return (
    <div className="about-section" ref={sectionRef}>
      <div className="about-container">
        {/* Section Header */}
        <AnimatedSection className="about-header">
          <h2 className="about-section-heading">Meet the Developers</h2>
          <p className="section-subtext">
            Meet the brilliant minds behind AI Class Manager
          </p>
        </AnimatedSection>

        {/* Timeline Container */}
        <div className="timeline-container">
          {/* Timeline Line */}
          <div className="timeline-line-wrapper">
            <div
              className="timeline-line"
              style={{ height: `${timelineHeight}px` }}
            />
          </div>

          {/* Developer Cards */}
          {developers.map((developer, index) => (
            <div key={index} className={`timeline-item ${developer.side}`}>
              {/* Left Side Content */}
              <div className="timeline-left">
                {developer.side === "left" ? (
                  <AnimatedSection direction="left" delay={index * 0.3}>
                    <div className="developer-profile">
                      <div className="developer-picture">
                        {developer.picture ? (
                          <img
                            src={developer.picture}
                            alt={developer.name}
                            className="developer-image"
                          />
                        ) : (
                          <div
                            className="developer-placeholder"
                            style={{ background: developer.gradient }}
                          >
                            {developer.initials}
                          </div>
                        )}
                      </div>
                      <h3 className="developer-name">{developer.name}</h3>
                      <p
                        className="developer-role"
                        style={{ color: developer.color }}
                      >
                        {developer.role}
                      </p>
                    </div>
                  </AnimatedSection>
                ) : (
                  <AnimatedSection direction="left" delay={index * 0.3}>
                    <div className="achievements-card">
                      <h4 className="achievements-title">🏆 About</h4>
                      <div className="achievements-list">
                        {developer.achievements.map((achievement, i) => (
                          <div key={i} className="achievement-item">
                            <div
                              className="achievement-dot"
                              style={{ backgroundColor: developer.color }}
                            />
                            <span className="achievement-text">
                              {achievement}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </AnimatedSection>
                )}
              </div>
              
              {/* Timeline Node */}
              <div className="timeline-node-wrapper">
                <AnimatedSection direction="scale" delay={index * 0.3 + 0.4}>
                  <div
                    className="timeline-node"
                    style={{ background: developer.gradient }}
                  />
                </AnimatedSection>
              </div>

              {/* Right Side Content */}
              <div className="timeline-right">
                {developer.side === "right" ? (
                  <AnimatedSection direction="right" delay={index * 0.3}>
                    <div className="developer-profile">
                      <div className="developer-picture">
                        {developer.picture ? (
                          <img
                            src={developer.picture}
                            alt={developer.name}
                            className="developer-image"
                          />
                        ) : (
                          <div
                            className="developer-placeholder"
                            style={{ background: developer.gradient }}
                          >
                            {developer.initials}
                          </div>
                        )}
                      </div>
                      <h3 className="developer-name">{developer.name}</h3>
                      <p
                        className="developer-role"
                        style={{ color: developer.color }}
                      >
                        {developer.role}
                      </p>
                    </div>
                  </AnimatedSection>
                ) : (
                  <AnimatedSection direction="right" delay={index * 0.3}>
                    <div className="achievements-card">
                      <h4 className="achievements-title">🏆 About</h4>
                      <div className="achievements-list">
                        {developer.achievements.map((achievement, i) => (
                          <div key={i} className="achievement-item">
                            <div
                              className="achievement-dot"
                              style={{ backgroundColor: developer.color }}
                            />
                            <span className="achievement-text">
                              {achievement}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </AnimatedSection>
                )}
              </div>
            </div>
          ))}

          {/* Collaboration Section */}
          <div className="timeline-item collaboration">
            <div className="timeline-collaboration">
              <AnimatedSection direction="up" delay={0.8}>
                <div className="collaboration-card">
                  <div className="collaboration-icon">
                    <div className="collaboration-dot" />
                  </div>
                  <h3 className="collaboration-title">Together We Innovate</h3>
                  <p className="collaboration-description">
                  Empowering the next generation of learning through a harmonious blend of AI, creativity, and cutting-edge web development.
                  </p>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;