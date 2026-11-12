export type Chapter = { id:string; subject:'Physics'|'Chemistry'|'Mathematics'; unit:number; name:string; focus:string };
export const chapterCatalog: Chapter[] = [
{ id:'phy-01',subject:'Physics',unit:1,name:'Units and Measurements',focus:'SI units, dimensions, significant figures, errors and dimensional analysis.' },
{ id:'phy-02',subject:'Physics',unit:2,name:'Kinematics',focus:'Motion in one and two dimensions, graphs, relative velocity, projectile and circular motion.' },
{ id:'phy-03',subject:'Physics',unit:3,name:'Laws of Motion',focus:'Newton laws, momentum, impulse, friction, equilibrium and circular dynamics.' },
{ id:'phy-04',subject:'Physics',unit:4,name:'Work, Energy and Power',focus:'Work-energy theorem, potential energy, conservation, power and collisions.' },
{ id:'phy-05',subject:'Physics',unit:5,name:'Rotational Motion',focus:'Centre of mass, torque, angular momentum, moment of inertia and rigid-body equilibrium.' },
{ id:'phy-06',subject:'Physics',unit:6,name:'Gravitation',focus:'Universal gravitation, field and potential, satellites, escape and orbital velocity.' },
{ id:'phy-07',subject:'Physics',unit:7,name:'Properties of Solids and Liquids',focus:'Elasticity, fluid pressure and flow, viscosity, surface tension and thermal properties.' },
{ id:'phy-08',subject:'Physics',unit:8,name:'Thermodynamics',focus:'Thermal equilibrium, heat, work, internal energy, first and second laws.' },
{ id:'phy-09',subject:'Physics',unit:9,name:'Kinetic Theory of Gases',focus:'Ideal gas equation, kinetic interpretation, degrees of freedom and specific heats.' },
{ id:'phy-10',subject:'Physics',unit:10,name:'Oscillations and Waves',focus:'SHM, springs, pendulums, wave motion, superposition, standing waves and sound.' },
{ id:'phy-11',subject:'Physics',unit:11,name:'Electrostatics',focus:'Charge, Coulomb law, electric field, Gauss law, potential and capacitance.' },
{ id:'phy-12',subject:'Physics',unit:12,name:'Current Electricity',focus:'Current, drift velocity, resistance, cells, Kirchhoff laws and electrical instruments.' },
{ id:'phy-13',subject:'Physics',unit:13,name:'Magnetic Effects of Current and Magnetism',focus:'Biot-Savart and Ampere laws, Lorentz force, magnetic materials and torque.' },
{ id:'phy-14',subject:'Physics',unit:14,name:'Electromagnetic Induction and Alternating Currents',focus:'Faraday and Lenz laws, inductance, AC circuits, reactance, impedance and transformers.' },
{ id:'phy-15',subject:'Physics',unit:15,name:'Electromagnetic Waves',focus:'Displacement current, electromagnetic spectrum and properties of EM waves.' },
{ id:'phy-16',subject:'Physics',unit:16,name:'Optics',focus:'Reflection, refraction, lenses, optical instruments, interference, diffraction and polarisation.' },
{ id:'phy-17',subject:'Physics',unit:17,name:'Dual Nature of Matter and Radiation',focus:'Photoelectric effect, photons, de Broglie wavelength and matter waves.' },
{ id:'phy-18',subject:'Physics',unit:18,name:'Atoms and Nuclei',focus:'Atomic models, spectra, nuclear size, radioactivity, binding energy and fission/fusion.' },
{ id:'phy-19',subject:'Physics',unit:19,name:'Electronic Devices',focus:'Semiconductors, diodes, rectifiers, LEDs, photodiodes, solar cells and logic gates.' },
{ id:'phy-20',subject:'Physics',unit:20,name:'Experimental Skills',focus:'Measurement, instruments, graphs, experimental observations and error analysis.' },
{ id:'chem-01',subject:'Chemistry',unit:1,name:'Some Basic Concepts in Chemistry',focus:'Mole concept, stoichiometry, concentration terms and chemical calculations.' },
{ id:'chem-02',subject:'Chemistry',unit:2,name:'Atomic Structure',focus:'Atomic models, quantum numbers, orbitals, electronic configuration and spectra.' },
{ id:'chem-03',subject:'Chemistry',unit:3,name:'Chemical Bonding and Molecular Structure',focus:'Ionic and covalent bonding, VSEPR, hybridisation, MOT and intermolecular forces.' },
{ id:'chem-04',subject:'Chemistry',unit:4,name:'Chemical Thermodynamics',focus:'Thermodynamic terms, enthalpy, entropy, Gibbs energy and spontaneity.' },
{ id:'chem-05',subject:'Chemistry',unit:5,name:'Solutions',focus:'Concentration, solubility, vapour pressure, Raoult law and colligative properties.' },
{ id:'chem-06',subject:'Chemistry',unit:6,name:'Equilibrium',focus:'Chemical and ionic equilibrium, equilibrium constants, acids, bases, buffers and solubility.' },
{ id:'chem-07',subject:'Chemistry',unit:7,name:'Redox Reactions and Electrochemistry',focus:'Oxidation numbers, redox balancing, cells, electrode potentials, Nernst equation and conductivity.' },
{ id:'chem-08',subject:'Chemistry',unit:8,name:'Chemical Kinetics',focus:'Rate laws, order, molecularity, integrated equations, half-life and Arrhenius equation.' },
{ id:'chem-09',subject:'Chemistry',unit:9,name:'Classification of Elements and Periodicity',focus:'Periodic table, electronic configuration and periodic trends.' },
{ id:'chem-10',subject:'Chemistry',unit:10,name:'p-Block Elements',focus:'Specified p-block groups, trends, structures, properties and important compounds.' },
{ id:'chem-11',subject:'Chemistry',unit:11,name:'d- and f-Block Elements',focus:'Transition elements, oxidation states, colour, magnetism, lanthanoids and actinoids.' },
{ id:'chem-12',subject:'Chemistry',unit:12,name:'Coordination Compounds',focus:'Nomenclature, bonding, isomerism, coordination number and applications.' },
{ id:'chem-13',subject:'Chemistry',unit:13,name:'Purification and Characterisation of Organic Compounds',focus:'Purification methods and qualitative/quantitative elemental analysis.' },
{ id:'chem-14',subject:'Chemistry',unit:14,name:'Some Basic Principles of Organic Chemistry',focus:'Nomenclature, isomerism, electronic effects, intermediates and reaction mechanisms.' },
{ id:'chem-15',subject:'Chemistry',unit:15,name:'Hydrocarbons',focus:'Alkanes, alkenes, alkynes, aromatic hydrocarbons and their reactions.' },
{ id:'chem-16',subject:'Chemistry',unit:16,name:'Organic Compounds Containing Halogens',focus:'Haloalkanes and haloarenes, substitution, elimination and environmental aspects.' },
{ id:'chem-17',subject:'Chemistry',unit:17,name:'Organic Compounds Containing Oxygen',focus:'Alcohols, phenols, ethers, aldehydes, ketones and carboxylic acids.' },
{ id:'chem-18',subject:'Chemistry',unit:18,name:'Organic Compounds Containing Nitrogen',focus:'Amines, diazonium salts and related reactions.' },
{ id:'chem-19',subject:'Chemistry',unit:19,name:'Biomolecules',focus:'Carbohydrates, proteins, vitamins, nucleic acids and their functions.' },
{ id:'chem-20',subject:'Chemistry',unit:20,name:'Principles Related to Practical Chemistry',focus:'Salt analysis, functional-group tests, preparations, titrations and laboratory principles.' },
{ id:'math-01',subject:'Mathematics',unit:1,name:'Sets, Relations and Functions',focus:'Sets, operations, relations, equivalence, functions, domain, range and composition.' },
{ id:'math-02',subject:'Mathematics',unit:2,name:'Complex Numbers and Quadratic Equations',focus:'Complex algebra, Argand plane, modulus, arguments, roots and quadratic equations.' },
{ id:'math-03',subject:'Mathematics',unit:3,name:'Matrices and Determinants',focus:'Matrix operations, inverse, determinants, properties and linear equations.' },
{ id:'math-04',subject:'Mathematics',unit:4,name:'Permutations and Combinations',focus:'Counting principles, arrangements, selections and restricted counting.' },
{ id:'math-05',subject:'Mathematics',unit:5,name:'Binomial Theorem',focus:'General term, middle terms, coefficients and binomial expansions.' },
{ id:'math-06',subject:'Mathematics',unit:6,name:'Sequences and Series',focus:'AP, GP, special sums, arithmetic-geometric progressions and series.' },
{ id:'math-07',subject:'Mathematics',unit:7,name:'Limits, Continuity and Differentiability',focus:'Limits, continuity, derivatives, chain rule, implicit and logarithmic differentiation.' },
{ id:'math-08',subject:'Mathematics',unit:8,name:'Integral Calculus',focus:'Indefinite and definite integrals, properties, substitution, parts and partial fractions.' },
{ id:'math-09',subject:'Mathematics',unit:9,name:'Differential Equations',focus:'Order, degree, formation and solution of first-order differential equations.' },
{ id:'math-10',subject:'Mathematics',unit:10,name:'Coordinate Geometry',focus:'Straight lines, circles, conic sections, distances, slopes and loci.' },
{ id:'math-11',subject:'Mathematics',unit:11,name:'Three Dimensional Geometry',focus:'Coordinates in space, direction ratios/cosines, lines, planes and angles.' },
{ id:'math-12',subject:'Mathematics',unit:12,name:'Vector Algebra',focus:'Vector operations, products, components, projections and geometric applications.' },
{ id:'math-13',subject:'Mathematics',unit:13,name:'Statistics and Probability',focus:'Dispersion, variance, standard deviation, probability, conditional probability and Bayes theorem.' },
{ id:'math-14',subject:'Mathematics',unit:14,name:'Trigonometry',focus:'Identities, equations, inverse trigonometric functions and properties.' }
 ];

// Topic-level breakdown aligned to the official JEE Main 2027 Paper 1 syllabus.
export const chapterDetails = {
  "phy-01": [
    "SI and derived units",
    "Least count and significant figures",
    "Errors in measurement",
    "Dimensions and dimensional analysis"
  ],
  "phy-02": [
    "Frame of reference",
    "1D motion and graphs",
    "Relative velocity",
    "Projectile motion",
    "Uniform circular motion"
  ],
  "phy-03": [
    "Newton's laws",
    "Momentum and impulse",
    "Conservation of momentum",
    "Equilibrium of forces",
    "Static and kinetic friction",
    "Circular motion dynamics"
  ],
  "phy-04": [
    "Work by constant and variable forces",
    "Work-energy theorem",
    "Potential energy and power",
    "Conservation of mechanical energy",
    "Vertical circular motion",
    "Elastic and inelastic collisions"
  ],
  "phy-05": [
    "Centre of mass",
    "Torque and angular momentum",
    "Conservation of angular momentum",
    "Moment of inertia and radius of gyration",
    "Parallel and perpendicular axes",
    "Rigid body equilibrium and rotation"
  ],
  "phy-06": [
    "Universal gravitation",
    "Variation of g",
    "Kepler laws",
    "Gravitational field and potential",
    "Escape and orbital velocity",
    "Satellite energy and time period"
  ],
  "phy-07": [
    "Elasticity and elastic moduli",
    "Fluid pressure and Pascal law",
    "Viscosity and Stokes law",
    "Bernoulli principle and fluid flow",
    "Surface tension and capillarity",
    "Thermal expansion and calorimetry",
    "Heat transfer"
  ],
  "phy-08": [
    "Thermal equilibrium and zeroth law",
    "Heat, work and internal energy",
    "First law",
    "Isothermal and adiabatic processes",
    "Second law",
    "Reversible and irreversible processes"
  ],
  "phy-09": [
    "Ideal gas equation",
    "Kinetic theory assumptions",
    "Pressure and temperature interpretation",
    "RMS speed",
    "Degrees of freedom",
    "Equipartition and specific heat",
    "Mean free path"
  ],
  "phy-10": [
    "Periodic motion and SHM",
    "Spring oscillator and energy",
    "Simple pendulum",
    "Progressive waves",
    "Superposition and reflection",
    "Standing waves and organ pipes",
    "Harmonics and beats"
  ],
  "phy-11": [
    "Coulomb law and superposition",
    "Continuous charge distribution",
    "Electric field and dipole",
    "Electric flux and Gauss law",
    "Electric potential and potential energy",
    "Conductors and dielectrics",
    "Capacitance and combinations",
    "Energy stored in capacitors"
  ],
  "phy-12": [
    "Current and drift velocity",
    "Ohm law and I-V curves",
    "Resistance and resistivity",
    "Cells and internal resistance",
    "Kirchhoff laws",
    "Wheatstone and metre bridge"
  ],
  "phy-13": [
    "Biot-Savart law",
    "Ampere law",
    "Lorentz force",
    "Force between current-carrying conductors",
    "Torque on current loop",
    "Moving coil galvanometer",
    "Magnetic dipole and bar magnet",
    "Magnetic materials"
  ],
  "phy-14": [
    "Faraday and Lenz laws",
    "Eddy currents",
    "Self and mutual inductance",
    "AC peak and RMS values",
    "Reactance and impedance",
    "Series LCR resonance",
    "AC power",
    "Generator and transformer"
  ],
  "phy-15": [
    "Displacement current",
    "EM wave properties",
    "Electromagnetic spectrum",
    "Applications of EM waves"
  ],
  "phy-16": [
    "Spherical mirrors",
    "Refraction and lenses",
    "Lens maker formula",
    "Total internal reflection",
    "Prism",
    "Microscope and telescope",
    "Huygens principle",
    "Young double-slit experiment",
    "Interference and diffraction",
    "Polarisation and Brewster law"
  ],
  "phy-17": [
    "Photoelectric effect",
    "Einstein equation",
    "Photon model",
    "Matter waves and de Broglie relation"
  ],
  "phy-18": [
    "Rutherford model",
    "Bohr model and hydrogen spectrum",
    "Nuclear composition and size",
    "Mass defect and binding energy",
    "Fission and fusion"
  ],
  "phy-19": [
    "Semiconductors",
    "p-n junction diode",
    "Rectification",
    "LED, photodiode and solar cell",
    "Zener diode and regulation",
    "Logic gates"
  ],
  "phy-20": [
    "Vernier calipers and screw gauge",
    "Simple pendulum",
    "Principle of moments",
    "Young modulus",
    "Surface tension and viscosity experiments",
    "Resonance tube",
    "Calorimetry",
    "Metre bridge and Ohm law",
    "Galvanometer",
    "Optics experiments",
    "Diode and Zener characteristics",
    "Component identification"
  ],
  "chem-01": [
    "Laws of chemical combination",
    "Atomic and molecular masses",
    "Mole concept",
    "Percentage composition",
    "Empirical and molecular formula",
    "Stoichiometry"
  ],
  "chem-02": [
    "Electromagnetic radiation",
    "Bohr model",
    "Photoelectric effect",
    "de Broglie relation",
    "Uncertainty principle",
    "Quantum numbers and orbitals",
    "Electronic configuration and filling rules"
  ],
  "chem-03": [
    "Ionic and covalent bonding",
    "Lattice enthalpy and Fajans rule",
    "Dipole moment",
    "VSEPR theory",
    "Valence bond theory and hybridisation",
    "Resonance",
    "Molecular orbital theory",
    "Bond order and hydrogen bonding"
  ],
  "chem-04": [
    "Thermodynamic systems and state functions",
    "First law",
    "Enthalpy and Hess law",
    "Entropy",
    "Spontaneity",
    "Gibbs energy and equilibrium"
  ],
  "chem-05": [
    "Concentration terms",
    "Raoult law",
    "Ideal and non-ideal solutions",
    "Vapour pressure",
    "Colligative properties",
    "van't Hoff factor"
  ],
  "chem-06": [
    "Dynamic and physical equilibrium",
    "Kp and Kc",
    "Le Chatelier principle",
    "Acid-base theories",
    "pH and ionisation",
    "Common ion effect",
    "Salt hydrolysis",
    "Solubility product and buffers"
  ],
  "chem-07": [
    "Redox concepts and balancing",
    "Conductance and molar conductivity",
    "Kohlrausch law",
    "Galvanic and electrolytic cells",
    "Electrode potential and cell emf",
    "Nernst equation",
    "Batteries and fuel cells"
  ],
  "chem-08": [
    "Rate of reaction",
    "Order and molecularity",
    "Rate law",
    "Zero and first order equations",
    "Half-life",
    "Arrhenius equation",
    "Activation energy and collision theory"
  ],
  "chem-09": [
    "Modern periodic law",
    "Periodic table blocks",
    "Atomic and ionic radii",
    "Ionisation enthalpy",
    "Electron gain enthalpy",
    "Valency and oxidation states"
  ],
  "chem-10": [
    "Groups 13 to 18",
    "Electronic configurations",
    "Periodic trends",
    "Physical and chemical properties",
    "Anomalous behaviour of first elements"
  ],
  "chem-11": [
    "Transition element properties",
    "Oxidation states and colour",
    "Magnetic and catalytic behaviour",
    "Complex formation",
    "KMnO4 and K2Cr2O7",
    "Lanthanoids and contraction",
    "Actinoids"
  ],
  "chem-12": [
    "Werner theory",
    "Ligands and coordination number",
    "Denticity and chelation",
    "Nomenclature",
    "Isomerism",
    "VBT and CFT basics",
    "Colour and magnetic properties",
    "Applications"
  ],
  "chem-13": [
    "Crystallisation and sublimation",
    "Distillation and extraction",
    "Chromatography",
    "Qualitative elemental analysis",
    "Quantitative analysis",
    "Empirical formula calculations"
  ],
  "chem-14": [
    "Tetravalency and hybridisation",
    "Functional groups and homologous series",
    "Structural and stereoisomerism",
    "IUPAC nomenclature",
    "Bond fission and intermediates",
    "Electrophiles and nucleophiles",
    "Inductive, electromeric, resonance and hyperconjugation",
    "Organic reaction types"
  ],
  "chem-15": [
    "Alkanes and conformations",
    "Alkane halogenation",
    "Alkenes and geometrical isomerism",
    "Electrophilic addition",
    "Markovnikov and peroxide effects",
    "Ozonolysis and polymerisation",
    "Alkynes",
    "Benzene and aromaticity",
    "Electrophilic aromatic substitution",
    "Friedel-Crafts reactions"
  ],
  "chem-16": [
    "Preparation and properties",
    "C-X bond",
    "Nucleophilic substitution",
    "Environmental effects and uses"
  ],
  "chem-17": [
    "Alcohols and dehydration",
    "Phenols and acidity",
    "Ethers",
    "Aldehydes and ketones",
    "Nucleophilic addition",
    "Grignard reagent",
    "Oxidation and reduction",
    "Aldol, Cannizzaro and haloform",
    "Carboxylic acids"
  ],
  "chem-18": [
    "Amines: preparation and properties",
    "Nomenclature and classification",
    "Basicity",
    "Identification tests",
    "Diazonium salts"
  ],
  "chem-19": [
    "Carbohydrates",
    "Glucose and fructose",
    "Sucrose, lactose and maltose",
    "Amino acids and proteins",
    "Protein structures and enzymes",
    "Vitamins",
    "DNA and RNA",
    "Hormones"
  ],
  "chem-20": [
    "Detection of extra elements",
    "Functional group tests",
    "Inorganic and organic preparations",
    "Titrimetric exercises",
    "Qualitative salt analysis",
    "Enthalpy experiments",
    "Colloids and kinetics practicals"
  ],
  "math-01": [
    "Sets and operations",
    "Power set",
    "Relations and equivalence",
    "Types of functions",
    "One-one, into and onto",
    "Composition of functions"
  ],
  "math-02": [
    "Complex number algebra",
    "Argand plane",
    "Modulus and argument",
    "Quadratic equations",
    "Roots and coefficients",
    "Nature of roots"
  ],
  "math-03": [
    "Matrix types and operations",
    "Determinants of order 2 and 3",
    "Determinant properties",
    "Adjoint and inverse",
    "Consistency and linear systems"
  ],
  "math-04": [
    "Fundamental counting principle",
    "Permutations",
    "Combinations",
    "Selection and arrangement problems"
  ],
  "math-05": [
    "Binomial theorem",
    "General term",
    "Middle term",
    "Coefficient applications"
  ],
  "math-06": [
    "Sequences and series",
    "Arithmetic progression",
    "Geometric progression",
    "Arithmetic and geometric means",
    "AM-GM relation"
  ],
  "math-07": [
    "Functions and graphs",
    "Limits",
    "Continuity",
    "Differentiability",
    "Derivative rules",
    "Implicit and composite differentiation",
    "Second derivatives",
    "Rate of change",
    "Monotonicity",
    "Maxima and minima"
  ],
  "math-08": [
    "Antiderivatives",
    "Standard integrals",
    "Substitution",
    "Integration by parts",
    "Partial fractions",
    "Definite integrals",
    "Fundamental theorem",
    "Area under curves"
  ],
  "math-09": [
    "Order and degree",
    "Formation of equations",
    "Separation of variables",
    "Homogeneous equations",
    "First-order linear equations"
  ],
  "math-10": [
    "Cartesian coordinates and locus",
    "Distance and section formula",
    "Straight lines and angles",
    "Concurrency and distances",
    "Triangle centres",
    "Circle",
    "Parabola",
    "Ellipse",
    "Hyperbola"
  ],
  "math-11": [
    "3D coordinates",
    "Distance and section formula",
    "Direction ratios and cosines",
    "Line in space",
    "Skew lines",
    "Shortest distance"
  ],
  "math-12": [
    "Scalars and vectors",
    "Vector addition and components",
    "Scalar product",
    "Vector product"
  ],
  "math-13": [
    "Mean, median and mode",
    "Measures of dispersion",
    "Variance and standard deviation",
    "Probability theorems",
    "Bayes theorem",
    "Random variables and distributions"
  ],
  "math-14": [
    "Trigonometric functions",
    "Identities and equations",
    "Inverse trigonometric functions",
    "Properties of inverse trigonometric functions"
  ]
} as const;
