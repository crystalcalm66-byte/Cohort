import { Client } from "pg"

const client = new Client({
  connectionString: "postgresql://postgres:cohort_by_fafa@db.cszeiotbdqsbujkhcagd.supabase.co:5432/postgres?sslmode=verify-full",
  ssl: { rejectUnauthorized: false },
})

const SUBJECTS: Array<{
  name: string; exam_track: string; icon: string; color: string; order_index: number
  units: Array<{ name: string; order_index: number; topics: string[] }>
}> = [
  // O Level
  { name: "Mathematics", exam_track: "olevel", icon: "🔢", color: "#0D9488", order_index: 0,
    units: [
      { name: "Number", order_index: 0, topics: ["Integers & Rational Numbers", "Fractions, Decimals & Percentages", "Ratio & Proportion", "Indices & Standard Form", "HCF & LCM"] },
      { name: "Algebra", order_index: 1, topics: ["Algebraic Expressions", "Linear Equations & Inequalities", "Simultaneous Equations", "Quadratic Equations", "Functions & Graphs", "Sequences"] },
      { name: "Geometry", order_index: 2, topics: ["Angles & Lines", "Triangles & Quadrilaterals", "Circles", "Pythagoras Theorem", "Trigonometry", "Transformations"] },
      { name: "Mensuration", order_index: 3, topics: ["Area & Perimeter", "Volume & Surface Area", "Arc Length & Sector Area"] },
      { name: "Statistics & Probability", order_index: 4, topics: ["Data Collection & Representation", "Mean, Median, Mode", "Probability Basics", "Tree Diagrams"] },
      { name: "Coordinate Geometry", order_index: 5, topics: ["Graphs of Linear Equations", "Gradient & Intercepts", "Distance & Midpoint"] },
    ] },
  { name: "Physics", exam_track: "olevel", icon: "⚡", color: "#3B82F6", order_index: 1,
    units: [
      { name: "General Physics", order_index: 0, topics: ["Physical Quantities & Units", "Measurement Techniques", "Scalars & Vectors", "Mass & Weight", "Density", "Forces & Motion", "Energy, Work & Power", "Pressure"] },
      { name: "Thermal Physics", order_index: 1, topics: ["Kinetic Particle Model", "Thermal Properties", "Temperature", "Heat Transfer"] },
      { name: "Waves", order_index: 2, topics: ["Wave Properties", "Sound Waves", "Light Waves", "Reflection & Refraction", "Lenses & Optics"] },
      { name: "Electricity & Magnetism", order_index: 3, topics: ["Electric Charge & Current", "Voltage & Resistance", "Circuits", "Magnetic Fields", "Electromagnetism"] },
      { name: "Atomic Physics", order_index: 4, topics: ["Radioactivity & Decay", "Nuclear Fission & Fusion", "Atomic Structure"] },
    ] },
  { name: "Chemistry", exam_track: "olevel", icon: "🧪", color: "#8B5CF6", order_index: 2,
    units: [
      { name: "States of Matter", order_index: 0, topics: ["Particle Theory", "Diffusion", "Changes of State"] },
      { name: "Atomic Structure & Bonding", order_index: 1, topics: ["Atomic Structure", "Ionic Bonding", "Covalent Bonding", "Metallic Bonding"] },
      { name: "Stoichiometry", order_index: 2, topics: ["Moles & Molar Mass", "Empirical & Molecular Formulas", "Chemical Equations", "Gas Volumes"] },
      { name: "Chemical Reactions", order_index: 3, topics: ["Acids, Bases & Salts", "Oxidation & Reduction", "Rates of Reaction", "Energy Changes"] },
      { name: "Periodic Table", order_index: 4, topics: ["Periodic Trends", "Group I Elements", "Group VII Elements", "Transition Elements"] },
      { name: "Organic Chemistry", order_index: 5, topics: ["Alkanes & Alkenes", "Alcohols & Carboxylic Acids", "Polymers & Plastics"] },
    ] },
  { name: "Biology", exam_track: "olevel", icon: "🧬", color: "#10B981", order_index: 3,
    units: [
      { name: "Cell Biology", order_index: 0, topics: ["Cell Structure", "Cell Division (Mitosis & Meiosis)", "Cell Transport"] },
      { name: "Human Physiology", order_index: 1, topics: ["Digestive System", "Respiratory System", "Circulatory System", "Excretory System", "Nervous System"] },
      { name: "Plant Biology", order_index: 2, topics: ["Photosynthesis", "Plant Transport", "Plant Growth & Response"] },
      { name: "Genetics & Evolution", order_index: 3, topics: ["DNA & Chromosomes", "Inheritance Patterns", "Natural Selection"] },
      { name: "Ecology", order_index: 4, topics: ["Ecosystems & Food Chains", "Nutrient Cycles", "Human Impact on Environment"] },
    ] },
  { name: "Computer Science", exam_track: "olevel", icon: "💻", color: "#6366F1", order_index: 4,
    units: [
      { name: "Data Representation", order_index: 0, topics: ["Binary & Hexadecimal", "Data Storage", "Text & Image Representation"] },
      { name: "Hardware & Software", order_index: 1, topics: ["Computer Architecture", "Input/Output Devices", "Operating Systems", "Programming Languages"] },
      { name: "Networking & Internet", order_index: 2, topics: ["Network Types & Topologies", "IP Addressing", "Internet Protocols", "Cybersecurity"] },
      { name: "Programming", order_index: 3, topics: ["Algorithms & Flowcharts", "Variables & Data Types", "Selection & Iteration", "Arrays & Functions"] },
      { name: "Databases", order_index: 4, topics: ["Database Concepts", "SQL Queries", "Data Integrity"] },
    ] },
  { name: "Economics", exam_track: "olevel", icon: "📊", color: "#F59E0B", order_index: 5,
    units: [
      { name: "Basic Economic Problem", order_index: 0, topics: ["Scarcity & Choice", "Opportunity Cost", "Factors of Production"] },
      { name: "Allocation of Resources", order_index: 1, topics: ["Demand & Supply", "Market Equilibrium", "Price Elasticity"] },
      { name: "Microeconomic Decision Makers", order_index: 2, topics: ["Household Behavior", "Firm Costs & Revenue", "Market Structures"] },
      { name: "Government & Macroeconomy", order_index: 3, topics: ["Fiscal Policy", "Monetary Policy", "Inflation", "Unemployment"] },
      { name: "International Trade", order_index: 4, topics: ["Globalization", "Trade Barriers", "Exchange Rates"] },
    ] },
  { name: "Business Studies", exam_track: "olevel", icon: "🏢", color: "#EC4899", order_index: 6,
    units: [
      { name: "Business Activity", order_index: 0, topics: ["Types of Businesses", "Aims & Objectives", "Stakeholders"] },
      { name: "Marketing", order_index: 1, topics: ["Market Research", "Marketing Mix (4Ps)", "Branding & Promotion"] },
      { name: "Operations Management", order_index: 2, topics: ["Production Methods", "Economies of Scale", "Quality Management"] },
      { name: "Financial Information", order_index: 3, topics: ["Revenue & Costs", "Profit & Loss", "Balance Sheets", "Ratio Analysis"] },
      { name: "Human Resources", order_index: 4, topics: ["Recruitment & Selection", "Training & Development", "Motivation"] },
    ] },
  { name: "Islamic Studies", exam_track: "olevel", icon: "🕌", color: "#059669", order_index: 7,
    units: [
      { name: "Quran", order_index: 0, topics: ["Revelation & Compilation", "Major Themes", "Selected Surahs Study"] },
      { name: "Hadith", order_index: 1, topics: ["Hadith Compilation", "Selected Hadith Study", "Role in Islamic Law"] },
      { name: "Aqaid (Beliefs)", order_index: 2, topics: ["Tawhid", "Prophethood", "Angels & Divine Books", "Day of Judgment"] },
      { name: "Fiqh (Jurisprudence)", order_index: 3, topics: ["Pillars of Islam", "Prayer & Fasting", "Zakat & Hajj"] },
      { name: "Islamic History", order_index: 4, topics: ["Life of Prophet Muhammad ﷺ", "Rightly Guided Caliphs", "Spread of Islam"] },
    ] },
  { name: "Pakistan Studies", exam_track: "olevel", icon: "🇵🇰", color: "#14B8A6", order_index: 8,
    units: [
      { name: "History of Pakistan", order_index: 0, topics: ["Decline of Mughal Empire", "British Rule & Reform", "Aligarh Movement", "Pakistan Movement (1940-47)", "Early Years of Pakistan"] },
      { name: "Geography", order_index: 1, topics: ["Physical Features", "Climate & Weather", "Water Resources", "Agriculture & Industry"] },
      { name: "Environment & Development", order_index: 2, topics: ["Population Distribution", "Economic Development", "Natural Resources", "Environmental Issues"] },
    ] },
  { name: "Urdu", exam_track: "olevel", icon: "📝", color: "#D97706", order_index: 9,
    units: [
      { name: "Reading Comprehension", order_index: 0, topics: ["Prose Comprehension", "Poetry Comprehension", "Vocabulary Building"] },
      { name: "Writing", order_index: 1, topics: ["Essay Writing", "Letter Writing", "Summary Writing", "Dialogue Writing"] },
      { name: "Grammar", order_index: 2, topics: ["Parts of Speech", "Tenses & Conjugation", "Sentence Structure", "Punctuation"] },
      { name: "Literature", order_index: 3, topics: ["Prose & Poetry Analysis", "Authors & Poets", "Figurative Language"] },
    ] },
  { name: "English", exam_track: "olevel", icon: "📖", color: "#3B82F6", order_index: 10,
    units: [
      { name: "Reading", order_index: 0, topics: ["Comprehension Skills", "Critical Analysis", "Inference & Interpretation"] },
      { name: "Writing", order_index: 1, topics: ["Narrative Writing", "Argumentative Writing", "Report Writing", "Descriptive Writing"] },
      { name: "Grammar & Vocabulary", order_index: 2, topics: ["Sentence Structure", "Punctuation", "Word Choice & Register"] },
      { name: "Speaking & Listening", order_index: 3, topics: ["Oral Presentation", "Group Discussion", "Listening Comprehension"] },
    ] },
  { name: "Accounting", exam_track: "olevel", icon: "💰", color: "#10B981", order_index: 11,
    units: [
      { name: "Accounting Fundamentals", order_index: 0, topics: ["Accounting Concepts", "Double Entry Bookkeeping", "Trial Balance"] },
      { name: "Financial Statements", order_index: 1, topics: ["Income Statement", "Balance Sheet", "Adjustments (Depreciation, Bad Debts)"] },
      { name: "Accounting Techniques", order_index: 2, topics: ["Bank Reconciliation", "Control Accounts", "Suspense Accounts"] },
      { name: "Partnership & Limited Companies", order_index: 3, topics: ["Partnership Accounts", "Company Accounts", "Ratio Analysis"] },
    ] },
  { name: "Commerce", exam_track: "olevel", icon: "🛒", color: "#8B5CF6", order_index: 12,
    units: [
      { name: "Trade & Commerce", order_index: 0, topics: ["Home & International Trade", "Retail & Wholesale", "E-Commerce"] },
      { name: "Business Services", order_index: 1, topics: ["Banking", "Insurance", "Transportation", "Warehousing"] },
      { name: "Business Organization", order_index: 2, topics: ["Sole Trader & Partnership", "Limited Companies", "Cooperatives"] },
      { name: "Finance & Trade Documentation", order_index: 3, topics: ["Methods of Payment", "Trade Documents", "Sources of Finance"] },
    ] },
  // A Level
  { name: "Mathematics", exam_track: "alevel", icon: "🔢", color: "#0D9488", order_index: 0,
    units: [
      { name: "Pure Mathematics 1", order_index: 0, topics: ["Quadratics", "Functions & Graphs", "Coordinate Geometry", "Circular Measure", "Trigonometry", "Series & Binomial Expansion", "Differentiation", "Integration"] },
      { name: "Pure Mathematics 2", order_index: 1, topics: ["Algebra & Polynomials", "Logarithms & Exponentials", "Trigonometric Identities", "Further Differentiation", "Numerical Methods"] },
      { name: "Mechanics", order_index: 2, topics: ["Forces & Equilibrium", "Kinematics", "Newton's Laws", "Work, Energy & Power"] },
      { name: "Probability & Statistics", order_index: 3, topics: ["Probability Distributions", "Normal Distribution", "Hypothesis Testing", "Correlation & Regression"] },
    ] },
  { name: "Physics", exam_track: "alevel", icon: "⚡", color: "#3B82F6", order_index: 1,
    units: [
      { name: "Physical Quantities & Motion", order_index: 0, topics: ["SI Units & Errors", "Kinematics & Dynamics", "Circular Motion", "Gravitational Fields"] },
      { name: "Waves & Optics", order_index: 1, topics: ["Progressive Waves", "Superposition & Interference", "Diffraction & Polarization"] },
      { name: "Electricity & Magnetism", order_index: 2, topics: ["Electric Fields", "Capacitance", "Magnetic Fields", "Electromagnetic Induction", "Alternating Current"] },
      { name: "Thermal Physics", order_index: 3, topics: ["Thermodynamics", "Ideal Gases", "Internal Energy"] },
      { name: "Nuclear & Quantum Physics", order_index: 4, topics: ["Quantum Mechanics", "Nuclear Physics", "Particle Physics"] },
    ] },
  { name: "Chemistry", exam_track: "alevel", icon: "🧪", color: "#8B5CF6", order_index: 2,
    units: [
      { name: "Physical Chemistry", order_index: 0, topics: ["Atomic Structure", "Bonding & Structure", "Enthalpy Changes", "Kinetics", "Chemical Equilibria", "Acid-Base Equilibria"] },
      { name: "Inorganic Chemistry", order_index: 1, topics: ["Periodicity", "Group 2 & 7", "Transition Elements", "Lattice Energy"] },
      { name: "Organic Chemistry", order_index: 2, topics: ["Hydrocarbons", "Halogenoalkanes", "Alcohols & Phenols", "Carbonyl Compounds", "Carboxylic Acids", "Nitrogen Compounds", "Polymerization"] },
      { name: "Analytical Chemistry", order_index: 3, topics: ["Mass Spectrometry", "IR Spectroscopy", "NMR Spectroscopy", "Chromatography"] },
    ] },
  { name: "Biology", exam_track: "alevel", icon: "🧬", color: "#10B981", order_index: 3,
    units: [
      { name: "Cell Structure & Function", order_index: 0, topics: ["Cell Ultrastructure", "Biomolecules", "Enzymes", "Cell Membranes & Transport"] },
      { name: "Genetics & Molecular Biology", order_index: 1, topics: ["DNA Replication", "Transcription & Translation", "Gene Regulation", "Genetic Engineering"] },
      { name: "Human Physiology", order_index: 2, topics: ["Homeostasis", "Nervous Coordination", "Hormonal Control", "Immunity"] },
      { name: "Ecology & Evolution", order_index: 3, topics: ["Populations & Ecosystems", "Energy Flow", "Biodiversity", "Evolution by Natural Selection"] },
    ] },
  { name: "Computer Science", exam_track: "alevel", icon: "💻", color: "#6366F1", order_index: 4,
    units: [
      { name: "Theory of Computation", order_index: 0, topics: ["Finite Automata", "Turing Machines", "Computability", "Complexity"] },
      { name: "Data Structures & Algorithms", order_index: 1, topics: ["Stacks & Queues", "Trees & Graphs", "Searching & Sorting", "Recursion"] },
      { name: "Computer Systems", order_index: 2, topics: ["Processor Architecture", "Assembly Language", "Memory Management", "Operating Systems"] },
      { name: "Programming Paradigms", order_index: 3, topics: ["Object-Oriented Programming", "Functional Programming", "Logic Programming"] },
    ] },
  { name: "Economics", exam_track: "alevel", icon: "📊", color: "#F59E0B", order_index: 5,
    units: [
      { name: "Microeconomics", order_index: 0, topics: ["Utility & Demand", "Costs & Supply", "Market Structures", "Labor Markets", "Market Failure"] },
      { name: "Macroeconomics", order_index: 1, topics: ["Aggregate Demand & Supply", "Fiscal & Monetary Policy", "Inflation & Unemployment", "Economic Growth"] },
      { name: "International Economics", order_index: 2, topics: ["Comparative Advantage", "Terms of Trade", "Balance of Payments", "Exchange Rate Determination"] },
    ] },
  { name: "Business Studies", exam_track: "alevel", icon: "🏢", color: "#EC4899", order_index: 6,
    units: [
      { name: "Strategic Management", order_index: 0, topics: ["Corporate Strategy", "SWOT Analysis", "Porter's Five Forces", "Ansoff Matrix"] },
      { name: "Marketing Strategy", order_index: 1, topics: ["Segmentation & Targeting", "Brand Management", "Digital Marketing", "Global Marketing"] },
      { name: "Financial Management", order_index: 2, topics: ["Investment Appraisal", "Cost of Capital", "Dividend Policy", "Risk Management"] },
      { name: "Operations & HR Strategy", order_index: 3, topics: ["Lean Production", "Supply Chain", "Change Management", "Leadership Styles"] },
    ] },
  { name: "Islamic Studies", exam_track: "alevel", icon: "🕌", color: "#059669", order_index: 7,
    units: [
      { name: "Quranic Studies", order_index: 0, topics: ["Tafsir Methodology", "Themes & Messages", "Legal & Ethical Teachings"] },
      { name: "Hadith Sciences", order_index: 1, topics: ["Hadith Classification", "Chain of Narration", "Hadith Criticism"] },
      { name: "Islamic Jurisprudence (Usul al-Fiqh)", order_index: 2, topics: ["Sources of Law", "Ijtihad & Taqlid", "Maqasid al-Shariah"] },
      { name: "Islamic Thought & Civilization", order_index: 3, topics: ["Islamic Philosophy", "Islamic Art & Architecture", "Modern Challenges"] },
    ] },
  { name: "Pakistan Studies", exam_track: "alevel", icon: "🇵🇰", color: "#14B8A6", order_index: 8,
    units: [
      { name: "Advanced History", order_index: 0, topics: ["Colonial Legacy", "Constitutional Development", "Political Evolution"] },
      { name: "Advanced Geography", order_index: 1, topics: ["Geopolitics", "Regional Disparities", "Urban & Rural Development"] },
      { name: "Contemporary Issues", order_index: 2, topics: ["National Integration", "Economic Challenges", "Foreign Policy"] },
    ] },
  { name: "Urdu", exam_track: "alevel", icon: "📝", color: "#D97706", order_index: 9,
    units: [
      { name: "Advanced Reading", order_index: 0, topics: ["Critical Analysis", "Comparative Study", "Literary Criticism"] },
      { name: "Advanced Writing", order_index: 1, topics: ["Analytical Essays", "Research Writing", "Creative Writing"] },
      { name: "Advanced Grammar & Linguistics", order_index: 2, topics: ["Morphology", "Syntax", "Historical Linguistics"] },
    ] },
  { name: "English", exam_track: "alevel", icon: "📖", color: "#3B82F6", order_index: 10,
    units: [
      { name: "Language Analysis", order_index: 0, topics: ["Discourse Analysis", "Sociolinguistics", "Language Change"] },
      { name: "Literature", order_index: 1, topics: ["Poetry Analysis", "Prose Fiction", "Drama", "Comparative Essays"] },
      { name: "Creative & Critical Writing", order_index: 2, topics: ["Argumentative Writing", "Commentary Writing", "Imaginative Writing"] },
    ] },
  { name: "Accounting", exam_track: "alevel", icon: "💰", color: "#10B981", order_index: 11,
    units: [
      { name: "Financial Accounting", order_index: 0, topics: ["Consolidated Accounts", "Incomplete Records", "Partnership Changes", "Accounting Standards"] },
      { name: "Cost & Management Accounting", order_index: 1, topics: ["Activity Based Costing", "Standard Costing & Variance", "Budgeting", "Investment Appraisal"] },
      { name: "Analysis & Interpretation", order_index: 2, topics: ["Advanced Ratio Analysis", "Cash Flow Analysis", "Limitations of Accounting"] },
    ] },
  { name: "Commerce", exam_track: "alevel", icon: "🛒", color: "#8B5CF6", order_index: 12,
    units: [
      { name: "Advanced Trade Theory", order_index: 0, topics: ["Trade Integration", "Multinationals & FDI", "Trade Policy"] },
      { name: "Financial Markets & Institutions", order_index: 1, topics: ["Stock Markets", "Central Banking", "Financial Regulation"] },
      { name: "Global Business Environment", order_index: 2, topics: ["Globalization & Culture", "International Marketing", "Supply Chain Strategy"] },
    ] },
  // SAT
  { name: "Reading & Writing", exam_track: "sat", icon: "📚", color: "#6366F1", order_index: 0,
    units: [
      { name: "Information & Ideas", order_index: 0, topics: ["Main Idea & Purpose", "Supporting Details", "Inference & Interpretation", "Evidence-Based Reasoning", "Data Analysis from Texts"] },
      { name: "Craft & Structure", order_index: 1, topics: ["Vocabulary in Context", "Text Structure", "Purpose & Rhetoric", "Point of View & Tone"] },
      { name: "Expression of Ideas", order_index: 2, topics: ["Sentence Boundaries & Organization", "Logical Transitions", "Rhetorical Synthesis"] },
      { name: "Standard English Conventions", order_index: 3, topics: ["Subject-Verb Agreement", "Pronoun Agreement", "Verb Tenses", "Modifier Placement", "Parallel Structure", "Punctuation"] },
    ] },
  { name: "Math", exam_track: "sat", icon: "📐", color: "#0D9488", order_index: 1,
    units: [
      { name: "Algebra", order_index: 0, topics: ["Linear Equations & Inequalities", "Systems of Linear Equations", "Functions & Graphs"] },
      { name: "Advanced Math", order_index: 1, topics: ["Quadratic Functions", "Exponential Functions", "Polynomials", "Radical & Rational Equations"] },
      { name: "Problem Solving & Data Analysis", order_index: 2, topics: ["Percentages & Ratios", "Unit Conversion", "Statistics", "Probability", "Sampling & Surveys"] },
      { name: "Geometry & Trigonometry", order_index: 3, topics: ["Area & Volume", "Lines & Angles", "Triangles & Circles", "Right Triangle Trig", "Complex Numbers"] },
    ] },
]

async function seed() {
  await client.connect()
  console.log("Seeding syllabus via direct SQL connection...")

  for (const subject of SUBJECTS) {
    const subjRes = await client.query(
      `INSERT INTO subjects (name, exam_track, icon, color, order_index) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [subject.name, subject.exam_track, subject.icon, subject.color, subject.order_index]
    )
    const subjectId = subjRes.rows[0].id
    console.log(`  ${subject.exam_track}: ${subject.name}`)

    for (const unit of subject.units) {
      const unitRes = await client.query(
        `INSERT INTO units (subject_id, name, order_index) VALUES ($1, $2, $3) RETURNING id`,
        [subjectId, unit.name, unit.order_index]
      )
      const unitId = unitRes.rows[0].id

      for (let i = 0; i < unit.topics.length; i++) {
        await client.query(
          `INSERT INTO topics (unit_id, name, order_index) VALUES ($1, $2, $3)`,
          [unitId, unit.topics[i], i]
        )
      }
    }
  }

  // Verify
  const result = await client.query("SELECT exam_track, COUNT(*) as cnt FROM subjects GROUP BY exam_track ORDER BY exam_track")
  console.log("\nSeeding complete! Summary:")
  for (const row of result.rows) {
    console.log(`  ${row.exam_track}: ${row.cnt} subjects`)
  }

  await client.end()
}

seed().catch((e) => { console.error(e); process.exit(1) })
