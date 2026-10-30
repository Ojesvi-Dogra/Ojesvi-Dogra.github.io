// Content carried over from the existing portfolio. Review dates before publishing.
export const experience = [
  {
    role: "Software Developer",
    company: "Tata Consultancy Services",
    location: "Indiana",
    dates: "Nov 2021 — Present",
    bullets: [
      "Developed and maintained scheduling, payroll, and HR applications supporting nearly 100,000 United Airlines employees.",
      "Built a solution to categorize 2,100 business requests and improve issue tracking.",
      "Collaborated across teams on root cause analysis and production issue resolution.",
      "Led remediation and testing for more than 10,000 application security issues.",
    ],
    skills: ["Java", "Spring", "Hibernate", "REST"],
  },
  {
    role: "Website Coordinator",
    company: "Purdue University",
    location: "Indiana",
    dates: "Sep 2019 — May 2021",
    bullets: [
      "Developed more than 100 university webpages using WordPress, JavaScript, and jQuery.",
      "Created web traffic reports for 194 websites using Google Analytics and Data Studio.",
      "Published and maintained content across more than 10,000 webpages.",
    ],
    skills: ["WordPress", "JavaScript", "Google Analytics"],
  },
  {
    role: "Network Analyst",
    company: "HCL",
    location: "Noida, India",
    dates: "Jun 2018 — Aug 2018",
    bullets: [
      "Administered access to secured company data through internal networks.",
      "Used UNIX commands through Citrix to troubleshoot licensing and system issues.",
    ],
    skills: ["UNIX", "Citrix"],
  },
  {
    role: "Java Developer",
    company: "Training Basket",
    location: "Noida, India",
    dates: "Jan 2018 — Jun 2018",
    bullets: [
      "Used J2EE and NLP to parse multiple data formats for a web application.",
      "Developed JSP interfaces and Java and Python algorithms for predictive data tools.",
    ],
    skills: ["Java", "Python", "JSP", "NLP"],
  },
];
export const education = [
  {
    school: "Purdue University",
    degree: "Master of Science, Computer Science",
    dates: "2019 — 2021",
    courses:
      "Software Design · Database Systems · Data Mining & Machine Learning",
  },
  {
    school: "Bahra University",
    degree: "Bachelor of Technology, Computer Science",
    dates: "2014 — 2018",
    courses: "Data Structures · Theory of Automata · Big Data",
  },
];
export const skills = [
  { category: "Programming", items: ["Java", "Python", "JavaScript", "R"] },
  {
    category: "Development",
    items: ["Spring", "Hibernate", "REST APIs", "WordPress"],
  },
  { category: "Data", items: ["Data analysis", "MongoDB", "Google Analytics"] },
];
export type Project = {
  id: string;
  category: "Personal" | "Academic";
  title: string;
  description: string;
  href?: string;
};
// Replace these template entries with verified projects. Add href only for real links.
export const projects: Project[] = [
  {
    id: "personal-1",
    category: "Personal",
    title: "[Personal project name]",
    description: "Share the inspiration, what you built, and what you learned.",
  },
  {
    id: "personal-2",
    category: "Personal",
    title: "[Creative project name]",
    description: "Describe a hobby-driven experiment or creative project.",
  },
  {
    id: "academic-1",
    category: "Academic",
    title: "[Academic project name]",
    description:
      "Describe the course context, your contribution, and the outcome.",
  },
  {
    id: "academic-2",
    category: "Academic",
    title: "[Research or coursework project]",
    description: "Explain the research question, methods, and findings.",
  },
];
