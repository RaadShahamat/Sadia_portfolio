/* =====================================================================
   SITE CONTENT  —  edit this file to update the website.
   ---------------------------------------------------------------------
   * Every list on the site (news, research, publications, talks,
     teaching, projects, gallery, CV details) is written here.
   * PHOTOS ARE NOT LISTED HERE. Put photos in the folders inside /images
     (see README.md). The site shows whatever it finds in each folder —
     any number, any name. Empty folders simply show nothing.
   * Keep the commas and quotes exactly as they are.
   ===================================================================== */

window.SITE = {

  /* ---------- Basic profile ---------- */
  profile: {
    name: "Sadia Anjum Mim",
    shortName: "S. A. Mim",          // how your name appears in author lists (shown in bold)
    email: "sadiaanjummim27@gmail.com",
    links: {
      linkedin: "https://www.linkedin.com/in/sadia-anjum-mim-a39b27281",
      researchgate: "https://www.researchgate.net/profile/Sadia-Mim-10",
      scholar: "",                   // add your Google Scholar link here when ready ("" = hidden)
      orcid: "",                     // add your ORCID link here when ready ("" = hidden)
      github: ""                     // optional
    },
    cvPdf: "cv/Sadia_Anjum_Mim_CV.pdf"
  },

  interests: [
    "Computational Fluid Dynamics (CFD)",
    "Machine Learning",
    "Microfluidics",
    "Design Optimization",
    "MEMS and Microfabrication"
  ],

  /* ---------- News (newest first). The home page shows the first 3. ---------- */
  news: [
    { date: "Jul 2026", text: "Presented “Optimizing microfluidic CTC separation using Bayesian methods” at ASME FEDSM 2026 in Bellevue, WA." },
    { date: "Summer 2026", text: "Served as research mentor to two undergraduate students in the NSF REU program." },
    { date: "2026", text: "First-author article published in <i>Biomedical Microdevices</i>." },
    { date: "2026", text: "Co-authored article published in <i>Biotechnology Progress</i>." },
    { date: "2026", text: "Two co-authored manuscripts submitted to IEEE BigData 2026." },
    { date: "Aug 2025", text: "Started the M.S. in Mechanical Engineering and a Graduate Teaching Assistant role at Washington State University Vancouver." }
  ],

  /* ---------- Research experience ---------- */
  research: [
    {
      label: "Current",
      dates: "Aug 2025 – Present",
      place: "Computer-Aided Engineering Lab, Dept. of ME, WSU",
      title: "Transfer-enhanced Bayesian optimization for microfluidic CTC separation",
      summary: "I developed a simulation-driven Bayesian optimization framework (Python + COMSOL Multiphysics) for designing deterministic lateral displacement (DLD) devices that separate circulating tumor cells (CTCs). It needs 67.2% fewer simulations and 80% less time-to-solution than an evolution strategy (ES), and it outperforms GA, DE and PSO.",
      details: [
        "I am now developing multi-objective and transfer-learning methods that balance CTC separation against pressure drop and reuse knowledge across related DLD design tasks."
      ],
      tags: ["Bayesian optimization", "Gaussian processes", "Transfer learning", "COMSOL", "Python"],
      advisor: "Advisor: Dr. Xiaolin (Linda) Chen, Associate Professor",
      photoFolder: "research/dld-optimization",          // photos: images/research/dld-optimization/
      caption: "DLD device design and simulation results."   // optional; otherwise taken from the file name
    },
    {
      label: "Undergraduate thesis",
      dates: "Jul 2023 – Jun 2024",
      place: "Macro to Micro Scale Fluids Engineering Lab, Dept. of ME, BUET",
      title: "Non-Newtonian fluid flow past a circular cylinder at low Reynolds number",
      summary: "A study of Newtonian and shear-thinning power-law fluids flowing past a circular cylinder using ANSYS Fluent, focusing on drag reduction and confinement effects.",
      details: [
        "Covered power-law index n = 0.2–1.0 and Reynolds number Re = 0.1–40."
      ],
      tags: ["ANSYS Fluent", "Non-Newtonian flow", "CFD"],
      advisor: "Advisor: Dr. A. B. M. Toufique Hasan, Professor",
      photoFolder: "research/non-newtonian-flow",        // photos: images/research/non-newtonian-flow/
      caption: "Flow field around the cylinder."
    }
  ],

  /* ---------- Publications ----------
     type: "journal" | "conference" | "review"
     status: shown as a small label
     authors: write your own name exactly as profile.shortName so it turns bold
     The home page shows the first 3. */
  publications: [
    {
      id: "J1", type: "journal", status: "Published",
      authors: ["S. A. Mim", "M. R. Uddin", "X. Chen"],
      title: "Bayesian optimization of deterministic lateral displacement devices for circulating tumor cell separation",
      venue: "Biomedical Microdevices, vol. 28, art. no. 72, 2026",
      doi: "10.1007/s10544-026-00856-4",
      bib: { kind: "article", key: "mim2026bayesian", journal: "Biomedical Microdevices", volume: "28", number: "", pages: "72", year: "2026",
             authors: "Mim, Sadia Anjum and Uddin, M. R. and Chen, Xiaolin" }
    },
    {
      id: "J2", type: "journal", status: "Published",
      authors: ["T. Sarowar", "S. A. Mim", "X. Chen"],
      title: "Data-driven design of deterministic lateral displacement microfluidic devices for CTC separation",
      venue: "Biotechnology Progress, vol. 42, no. 4, e88515, 2026",
      doi: "10.1002/btpr.88515",
      bib: { kind: "article", key: "sarowar2026datadriven", journal: "Biotechnology Progress", volume: "42", number: "4", pages: "e88515", year: "2026",
             authors: "Sarowar, T. and Mim, Sadia Anjum and Chen, Xiaolin" }
    },
    {
      id: "C1", type: "conference", status: "Presented",
      authors: ["S. A. Mim", "M. R. Uddin", "X. Chen"],
      title: "Optimizing microfluidic CTC separation using Bayesian methods",
      venue: "Proc. ASME 2026 Fluids Engineering Division Summer Meeting (FEDSM2026), Bellevue, WA, USA, Jul. 26–29, 2026, Paper No. FEDSM2026-184031",
      doi: "",
      bib: { kind: "inproceedings", key: "mim2026optimizing", booktitle: "Proceedings of the ASME 2026 Fluids Engineering Division Summer Meeting (FEDSM2026)", address: "Bellevue, WA, USA", note: "Paper No. FEDSM2026-184031", year: "2026",
             authors: "Mim, Sadia Anjum and Uddin, M. R. and Chen, Xiaolin" }
    },
    {
      id: "R1", type: "review", status: "Under review",
      authors: ["P. Maggu", "S. A. Mim", "M. R. Uddin", "X. Chen"],
      title: "Surrogate-level versus acquisition-level transfer learning for DLD optimization",
      venue: "Submitted to IEEE International Conference on Big Data (BigData 2026)",
      doi: ""
    },
    {
      id: "R2", type: "review", status: "Under review",
      authors: ["V. Varikooty", "S. A. Mim", "M. R. Uddin", "X. Chen"],
      title: "Adaptive source trust in transfer Bayesian optimization: Gated RGPE versus TST-R for DLD design",
      venue: "Submitted to IEEE International Conference on Big Data (BigData 2026)",
      doi: ""
    },
    {
      id: "R3", type: "review", status: "Under review",
      authors: ["R. S. Alif", "S. A. Mim", "M. K. Alom", "M. Foysal"],
      title: "A robust hybrid deep ensemble framework for MRI-based brain tumor classification using power-law preprocessing",
      venue: "Computer Methods and Programs in Biomedicine Update, revised manuscript under review",
      doi: ""
    }
  ],

  /* ---------- Talks and conferences ---------- */
  talks: [
    {
      title: "Optimizing microfluidic CTC separation using Bayesian methods",
      event: "ASME 2026 Fluids Engineering Division Summer Meeting (FEDSM2026)",
      place: "Bellevue, Washington",
      date: "July 26–29, 2026",
      note: "Paper No. FEDSM2026-184031",
      photoFolder: "conferences/fedsm-2026"              // photos: images/conferences/fedsm-2026/
    }
  ],

  /* ---------- Teaching and mentoring ---------- */
  teaching: {
    role: "Graduate Teaching Assistant",
    place: "School of Engineering and Computer Science, Washington State University Vancouver",
    dates: "Aug 2025 – Present",
    duties: "Office hours, grading, and one-on-one technical guidance for undergraduate engineering students.",
    courses: [
      { code: "MECH 251", name: "Numerical Computing for Engineers" },
      { code: "MECH 314", name: "Machine Design I" },
      { code: "MECH 414", name: "Machine Design II" },
      { code: "MECH 485", name: "Computer-Aided Engineering" }
    ],
    mentoring: "Research mentor to two undergraduate students in the NSF Research Experiences for Undergraduates (REU) program, Summer 2026."
  },

  /* ---------- Projects ----------
     Each project gets its own page: project.html?id=<slug>
     Photos go in images/projects/<slug>/  (any number).
       - a file named "cover" (cover.jpg, cover.png ...) is used on the card;
         if there is none, the first photo is used;
       - all other photos appear on the project's own page;
       - no photos at all is fine: the card gets a neat text cover. */
  projects: [
    {
      slug: "volcanic-ash",
      title: "ML-based classification of volcanic ash particle collisions",
      meta: "Machine learning · Ongoing",
      summary: "Building a particle-motion simulator and labeled dataset to classify rebound, aggregation, and disaggregation events in high-speed imagery.",
      description: [
        "I am building a particle-motion simulator and a labeled dataset to classify rebound, aggregation, and disaggregation events in high-speed imagery of volcanic ash particle collisions."
      ],
      tools: ["Python", "Machine learning", "Image processing"],
      links: []
    },
    {
      slug: "nlp-summarizer",
      title: "NLP text summarizer",
      meta: "Natural language processing · 2024–2025",
      summary: "Fine-tuned Google’s PEGASUS model on the SAMSum dataset and evaluated it with ROUGE metrics.",
      description: [
        "Fine-tuned Google’s PEGASUS transformer model on the SAMSum dialogue dataset to produce short summaries of conversations, and evaluated the results with ROUGE metrics."
      ],
      tools: ["Python", "PyTorch", "PEGASUS", "ROUGE"],
      links: [{ label: "Code on GitHub", url: "https://github.com/RaadShahamat/NLP_Text-Summarizer" }]
    },
    {
      slug: "robotic-fish",
      title: "Bio-inspired RC robotic fish",
      meta: "Robotics · 2022",
      summary: "Designed and built an Arduino-controlled, Bluetooth-operated robotic fish mimicking natural fish motion.",
      description: [
        "Designed and built an Arduino-controlled, Bluetooth-operated robotic fish that mimics the swimming motion of a natural fish."
      ],
      tools: ["Arduino", "Bluetooth", "Mechanical design"],
      links: [{ label: "Report on ResearchGate", url: "http://dx.doi.org/10.13140/RG.2.2.22565.47843" }]
    },
    {
      slug: "radiator",
      title: "Finned cross-flow radiator",
      meta: "Thermal design · 2023",
      summary: "Designed a double-pass copper-tube radiator with sine-wave aluminum fins; fabricated components and conducted pressure and leak tests.",
      description: [
        "Designed a double-pass copper-tube cross-flow radiator with sine-wave aluminum fins, fabricated the components, and carried out pressure and leak tests."
      ],
      tools: ["Heat exchanger design", "Fabrication", "Testing"],
      links: []
    },
    {
      slug: "ev-battery",
      title: "Graphene hybrid battery and torque modulation in EVs",
      meta: "Technical case study",
      summary: "Technical case presentation on EV batteries, torque control, and thermal management.",
      description: [
        "A technical case presentation on electric-vehicle batteries, torque control, and thermal management, including graphene hybrid batteries."
      ],
      tools: ["Electric vehicles", "Batteries", "Thermal management"],
      links: [{ label: "Slides on ResearchGate", url: "http://dx.doi.org/10.13140/RG.2.2.24019.59682" }]
    }
  ],

  /* ---------- Beyond the lab: photo gallery ----------
     Every folder inside images/gallery/ becomes a tab on the Gallery page
     (images/gallery/hiking/ -> "Hiking"). Make a new folder for a new tab.
     Conference photos (images/conferences/...) appear under "Conferences".
     The home page shows up to 5 non-conference photos, mixed across folders.
     Optional: nicer tab names and tab order: */
  galleryTabs: {
    conferences: "Conferences",
    hiking: "Hiking",
    travel: "Travel",
    other: "Other"
  },

  /* ---------- CV page details ---------- */
  education: [
    { degree: "M.S. in Mechanical Engineering", school: "Washington State University Vancouver", place: "Vancouver, WA, USA", dates: "Aug 2025 – May 2027 (expected)", note: "GPA 3.93/4.00" },
    { degree: "B.Sc. in Mechanical Engineering", school: "Bangladesh University of Engineering and Technology (BUET)", place: "Dhaka, Bangladesh", dates: "Apr 2019 – Jul 2024", note: "GPA 3.57/4.00 · Dean’s List and Merit Scholarship for 2 semesters" }
  ],
  coursework: ["MEMS Engineering", "Lab-on-a-Chip", "Sensors", "Robotics", "Machine Learning and AI for Engineers", "CFD and Heat Transfer"],
  skills: [
    { area: "Simulation and CFD", items: "COMSOL Multiphysics, ANSYS, OpenFOAM" },
    { area: "Optimization and ML", items: "Bayesian optimization, Gaussian-process surrogates, uncertainty quantification, transfer learning, PyTorch (CNNs, NLP), image processing" },
    { area: "Programming", items: "Python, MATLAB, C, LaTeX" },
    { area: "Microfabrication", items: "Photolithography, spin coating, wet chemical etching, RF magnetron sputtering, thin films" },
    { area: "CAD and design", items: "SolidWorks, AutoCAD, HTRI, 3E Plus" },
    { area: "Hardware and shop", items: "Arduino, Raspberry Pi, PLC; welding, milling, lathe, drilling, grinding" }
  ],
  honors: [
    "Dean’s List, BUET (2019–2020)",
    "University Merit Scholarship, BUET (2021)",
    "3rd Place, Inter-Varsity Engineering Case Competition"
  ],
  activities: [
    "Industrial Trainee, Khulna Shipyard Ltd., Bangladesh (Oct–Nov 2023): ship production and safety practices",
    "Member, IMechE BUET Student Chapter, BUET Automobile Club, Debating Club, and Chess Club (prizes), 2019–2023"
  ],
  references: [
    { name: "Dr. Xiaolin (Linda) Chen", title: "Associate Professor", dept: "Department of Mechanical Engineering, Washington State University" },
    { name: "Dr. Md. Ashiqur Rahman", title: "Professor", dept: "Department of Mechanical Engineering, BUET" }
  ]
};
