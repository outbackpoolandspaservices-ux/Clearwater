export const dashboardStats = [
  {
    label: "Today's jobs",
    value: "12",
    detail: "4 completed, 3 in progress",
  },
  {
    label: "Unscheduled jobs",
    value: "7",
    detail: "Needs dispatch review",
  },
  {
    label: "Pending quotes",
    value: "5",
    detail: "$8.4k awaiting approval",
  },
  {
    label: "Unpaid invoices",
    value: "9",
    detail: "$12.1k outstanding",
  },
];

export const quickActions = [
  "Create Job",
  "Add Customer",
  "Add Water Test",
  "Create Quote",
  "Create Invoice",
];

export const todayJobs = [
  {
    time: "8:00 AM",
    title: "Regular pool service",
    customer: "Flynn Drive Residence",
    technician: "Sam",
    status: "Scheduled",
  },
  {
    time: "10:30 AM",
    title: "Green pool recovery",
    customer: "Gillen Rental",
    technician: "Jordan",
    status: "In Progress",
  },
  {
    time: "1:00 PM",
    title: "Pump inspection",
    customer: "Eastside Family Pool",
    technician: "Taylor",
    status: "Ready",
  },
];

export const unscheduledJobs = [
  "Quote visit for Larapinta pool heater",
  "Water test only for Sadadeen customer",
  "Filter media change for Desert Springs Resort",
];

export const lowStockWarnings = [
  {
    item: "Liquid chlorine",
    quantity: "18 L",
    threshold: "25 L",
  },
  {
    item: "Cal hypo",
    quantity: "2 kg",
    threshold: "5 kg",
  },
];

export const waterChemistryAlerts = [
  {
    pool: "Gillen Rental",
    issue: "High phosphate reading",
    action: "Review treatment plan",
  },
  {
    pool: "Eastside Family Pool",
    issue: "pH trending high",
    action: "Check target range",
  },
];

export const technicianWorkload = [
  { name: "Sam", jobs: 5, load: "Full" },
  { name: "Jordan", jobs: 4, load: "Steady" },
  { name: "Taylor", jobs: 3, load: "Available" },
];

export const technicians = [
  { id: "tech-sam", name: "Sam", role: "Senior technician" },
  { id: "tech-jordan", name: "Jordan", role: "Service technician" },
  { id: "tech-taylor", name: "Taylor", role: "Repair technician" },
];

export const jobs = [
  {
    id: "JOB-1001",
    jobNumber: "JOB-1001",
    title: "Regular pool service",
    jobType: "Regular Pool Service",
    customerId: "cust-flynn",
    siteId: "site-flynn",
    poolId: "pool-flynn-main",
    technicianId: "tech-sam",
    waterTestIds: ["test-flynn-1"],
    quoteId: null,
    invoiceId: "INV-3101",
    customer: "Flynn Drive Residence",
    status: "Scheduled",
    priority: "Normal",
    scheduledDate: "2026-05-02",
    scheduledTime: "8:00 AM",
    estimatedDuration: "75 minutes",
    routeOrder: 1,
    actualStart: null,
    actualFinish: null,
    date: "Today",
    internalNotes: "Check skimmer basket and confirm chlorinator output.",
    customerNotes: "Customer requested SMS before arrival.",
  },
  {
    id: "JOB-1002",
    jobNumber: "JOB-1002",
    title: "Green pool recovery",
    jobType: "Green Pool Recovery",
    customerId: "cust-apartments",
    siteId: "site-gillen",
    poolId: "pool-gillen-plunge",
    technicianId: "tech-jordan",
    waterTestIds: ["test-gillen-1"],
    quoteId: "Q-2042",
    invoiceId: null,
    customer: "Gillen Rental",
    status: "In Progress",
    priority: "High",
    scheduledDate: "2026-05-02",
    scheduledTime: "10:30 AM",
    estimatedDuration: "120 minutes",
    routeOrder: 2,
    actualStart: "10:42 AM",
    actualFinish: null,
    date: "Yesterday",
    internalNotes: "Photograph water condition and note tenant access issues.",
    customerNotes: "Agent wants quote approved before treatment chemicals are added.",
  },
  {
    id: "JOB-1003",
    jobNumber: "JOB-1003",
    title: "Pump inspection",
    jobType: "Pump Inspection",
    customerId: "cust-eastside",
    siteId: "site-eastside",
    poolId: "pool-eastside-main",
    technicianId: "tech-taylor",
    waterTestIds: ["test-eastside-1"],
    quoteId: "Q-2041",
    invoiceId: null,
    customer: "Eastside Family Pool",
    status: "On The Way",
    priority: "Normal",
    scheduledDate: "2026-05-02",
    scheduledTime: "1:00 PM",
    estimatedDuration: "60 minutes",
    routeOrder: 1,
    actualStart: null,
    actualFinish: null,
    date: "Last week",
    internalNotes: "Listen for pump bearing noise and inspect union leaks.",
    customerNotes: "Customer says the pump is louder after recent dust storms.",
  },
  {
    id: "JOB-1004",
    jobNumber: "JOB-1004",
    title: "Commercial spa service",
    jobType: "Commercial Service",
    customerId: "cust-resort",
    siteId: "site-resort",
    poolId: "pool-resort-spa",
    technicianId: "tech-sam",
    waterTestIds: ["test-resort-1"],
    quoteId: null,
    invoiceId: "INV-3102",
    customer: "Desert Springs Resort",
    status: "Completed",
    priority: "High",
    scheduledDate: "2026-05-01",
    scheduledTime: "6:30 AM",
    estimatedDuration: "90 minutes",
    routeOrder: 1,
    actualStart: "6:34 AM",
    actualFinish: "7:58 AM",
    date: "Yesterday",
    internalNotes: "Check heater operation and log filter pressure.",
    customerNotes: "Facilities team prefers service before guest access opens.",
  },
  {
    id: "JOB-1005",
    jobNumber: "JOB-1005",
    title: "Filter media change",
    jobType: "Filter Media Change",
    customerId: "cust-apartments",
    siteId: "site-larapinta",
    poolId: "pool-gillen-plunge",
    technicianId: "tech-jordan",
    waterTestIds: [],
    quoteId: "Q-2043",
    invoiceId: null,
    customer: "Larapinta Townhouse",
    status: "Ready to Schedule",
    priority: "Normal",
    scheduledDate: "Unscheduled",
    scheduledTime: "Unscheduled",
    estimatedDuration: "90 minutes",
    routeOrder: null,
    actualStart: null,
    actualFinish: null,
    date: "Unscheduled",
    internalNotes: "Confirm access before scheduling. Key safe code changes monthly.",
    customerNotes: "Agent requested weekday service only.",
  },
];

export const recurringJobs = [
  {
    id: "REC-001",
    frequency: "weekly",
    customerId: "cust-resort",
    siteId: "site-resort",
    poolId: "pool-resort-spa",
    technicianId: "tech-sam",
    nextServiceDate: "2026-05-06",
    window: "6:00 AM - 8:00 AM",
    status: "Active",
  },
  {
    id: "REC-002",
    frequency: "fortnightly",
    customerId: "cust-flynn",
    siteId: "site-flynn",
    poolId: "pool-flynn-main",
    technicianId: "tech-jordan",
    nextServiceDate: "2026-05-09",
    window: "8:00 AM - 11:00 AM",
    status: "Active",
  },
  {
    id: "REC-003",
    frequency: "monthly",
    customerId: "cust-eastside",
    siteId: "site-eastside",
    poolId: "pool-eastside-main",
    technicianId: "tech-taylor",
    nextServiceDate: "2026-05-20",
    window: "Afternoon",
    status: "Active",
  },
  {
    id: "REC-004",
    frequency: "custom",
    customerId: "cust-apartments",
    siteId: "site-gillen",
    poolId: "pool-gillen-plunge",
    technicianId: "tech-jordan",
    nextServiceDate: "2026-05-13",
    window: "Tenant access dependent",
    status: "Access check",
  },
];

export const customers = [
  {
    id: "cust-apartments",
    name: "Alice Springs Apartments",
    phone: "08 8950 1122",
    email: "maintenance@asapartments.example",
    type: "Real estate",
    billingAddress: "12 Todd Mall, Alice Springs NT 0870",
    invoiceTerms: "14 days from invoice date",
    communicationPreference: "Email for approvals, SMS for access updates",
    internalNotes: "Property manager prefers grouped invoices by property.",
    outstandingBalance: "$3,420",
    status: "Active",
    siteIds: ["site-gillen", "site-larapinta"],
    quoteSummary: "2 pending quotes",
    invoiceSummary: "3 unpaid invoices",
  },
  {
    id: "cust-flynn",
    name: "Flynn Drive Residence",
    phone: "0400 122 744",
    email: "flynn.family@example.com",
    type: "Residential",
    billingAddress: "18 Flynn Drive, Alice Springs NT 0870",
    invoiceTerms: "Due on receipt",
    communicationPreference: "SMS reminders and email reports",
    internalNotes: "Gate is usually unlocked on service mornings.",
    outstandingBalance: "$198",
    status: "Active",
    siteIds: ["site-flynn"],
    quoteSummary: "1 quote awaiting approval",
    invoiceSummary: "1 invoice due",
  },
  {
    id: "cust-resort",
    name: "Desert Springs Resort",
    phone: "08 8951 8840",
    email: "facilities@desertsprings.example",
    type: "Commercial",
    billingAddress: "90 Palm Circuit, Alice Springs NT 0870",
    invoiceTerms: "30 days from invoice date",
    communicationPreference: "Email reports to facilities team",
    internalNotes: "Service outside peak guest hours where possible.",
    outstandingBalance: "$8,680",
    status: "Active",
    siteIds: ["site-resort"],
    quoteSummary: "1 approved quote",
    invoiceSummary: "2 unpaid invoices",
  },
  {
    id: "cust-eastside",
    name: "Eastside Family Pool",
    phone: "0412 882 019",
    email: "eastside.pool@example.com",
    type: "Residential",
    billingAddress: "4 Kurrajong Drive, East Side NT 0870",
    invoiceTerms: "7 days from invoice date",
    communicationPreference: "SMS first, email invoices",
    internalNotes: "Customer asked to monitor pH drift over summer.",
    outstandingBalance: "$240",
    status: "Watch",
    siteIds: ["site-eastside"],
    quoteSummary: "1 draft quote",
    invoiceSummary: "1 invoice due",
  },
];

export const pools = [
  {
    id: "pool-flynn-main",
    siteId: "site-flynn",
    name: "Main family pool",
    location: "Flynn Drive Residence",
    volumeLitres: 52000,
    poolType: "In-ground concrete",
    surfaceType: "Pebblecrete",
    sanitiserType: "Salt chlorinator",
    lastTestDate: "2026-04-29",
    alertStatus: "Balanced",
    targetRanges: "FC 2-4 ppm, pH 7.4-7.6, TA 80-120 ppm",
    serviceNotes: "Leaves collect near the shallow-end skimmer after windy days.",
    equipmentIds: ["eq-flynn-pump", "eq-flynn-chlorinator"],
    waterTestIds: ["test-flynn-1", "test-flynn-2"],
  },
  {
    id: "pool-gillen-plunge",
    siteId: "site-gillen",
    name: "Rental plunge pool",
    location: "Gillen Rental",
    volumeLitres: 18000,
    poolType: "Plunge pool",
    surfaceType: "Fibreglass",
    sanitiserType: "Mineral system",
    lastTestDate: "2026-04-28",
    alertStatus: "Phosphate alert",
    targetRanges: "FC 2-4 ppm, pH 7.2-7.6, salt 3500-4500 ppm",
    serviceNotes: "Tenant reports heavy dust after nearby landscaping work.",
    equipmentIds: ["eq-gillen-pump", "eq-gillen-filter"],
    waterTestIds: ["test-gillen-1"],
  },
  {
    id: "pool-resort-spa",
    siteId: "site-resort",
    name: "Commercial spa",
    location: "Desert Springs Resort",
    volumeLitres: 9500,
    poolType: "Commercial spa",
    surfaceType: "Tiled",
    sanitiserType: "Liquid chlorine",
    lastTestDate: "2026-04-30",
    alertStatus: "Monitor alkalinity",
    targetRanges: "FC 3-5 ppm, pH 7.4-7.6, TA 80-100 ppm",
    serviceNotes: "High bather load on weekends. Check filter pressure every visit.",
    equipmentIds: ["eq-resort-heater", "eq-resort-filter"],
    waterTestIds: ["test-resort-1"],
  },
  {
    id: "pool-eastside-main",
    siteId: "site-eastside",
    name: "Eastside family pool",
    location: "Eastside Family Pool",
    volumeLitres: 44000,
    poolType: "In-ground vinyl",
    surfaceType: "Vinyl liner",
    sanitiserType: "Salt chlorinator",
    lastTestDate: "2026-04-27",
    alertStatus: "pH high",
    targetRanges: "FC 2-4 ppm, pH 7.2-7.6, TA 80-120 ppm",
    serviceNotes: "Recurring high pH. Check cell output and acid demand.",
    equipmentIds: ["eq-eastside-pump"],
    waterTestIds: ["test-eastside-1"],
  },
];

export const sites = [
  {
    id: "site-flynn",
    customerId: "cust-flynn",
    name: "Flynn Drive Residence",
    address: "18 Flynn Drive",
    suburb: "Alice Springs",
    ownerOrAgent: "Flynn Family",
    accessNotes: "Side gate on left of carport",
    accessWarning: "Gate latch sticks in hot weather",
    gateCode: "No code",
    petWarning: "Friendly dog may be in yard",
    tenantDetails: "Owner occupied",
    ownerAgentDetails: "Primary contact: Mia Flynn",
    status: "Active",
    poolIds: ["pool-flynn-main"],
  },
  {
    id: "site-gillen",
    customerId: "cust-apartments",
    name: "Gillen Rental",
    address: "7 Tmara Mara Circuit",
    suburb: "Gillen",
    ownerOrAgent: "Alice Springs Apartments",
    accessNotes: "Use rear laneway gate",
    accessWarning: "Confirm tenant access before arrival",
    gateCode: "4421",
    petWarning: "No pets listed",
    tenantDetails: "Tenant: R. Smith",
    ownerAgentDetails: "Agent: Alice Springs Apartments",
    status: "Access Check",
    poolIds: ["pool-gillen-plunge"],
  },
  {
    id: "site-larapinta",
    customerId: "cust-apartments",
    name: "Larapinta Townhouse",
    address: "22 Albrecht Drive",
    suburb: "Larapinta",
    ownerOrAgent: "Alice Springs Apartments",
    accessNotes: "Key safe beside meter box",
    accessWarning: "Key safe code changes monthly",
    gateCode: "Key safe 9037",
    petWarning: "Dog warning on file",
    tenantDetails: "Tenant details held by agent",
    ownerAgentDetails: "Agent: Alice Springs Apartments",
    status: "Active",
    poolIds: [],
  },
  {
    id: "site-resort",
    customerId: "cust-resort",
    name: "Desert Springs Resort",
    address: "90 Palm Circuit",
    suburb: "Desert Springs",
    ownerOrAgent: "Desert Springs Resort",
    accessNotes: "Check in with facilities office",
    accessWarning: "Guest areas require hi-vis before 9 AM",
    gateCode: "Facilities access card",
    petWarning: "No pets",
    tenantDetails: "Commercial site",
    ownerAgentDetails: "Facilities manager: Dan Morris",
    status: "Active",
    poolIds: ["pool-resort-spa"],
  },
  {
    id: "site-eastside",
    customerId: "cust-eastside",
    name: "Eastside Family Pool",
    address: "4 Kurrajong Drive",
    suburb: "East Side",
    ownerOrAgent: "Eastside Family Pool",
    accessNotes: "Side gate near bins",
    accessWarning: "Call if vehicle blocks access",
    gateCode: "No code",
    petWarning: "No pets listed",
    tenantDetails: "Owner occupied",
    ownerAgentDetails: "Primary contact: Alex",
    status: "Watch",
    poolIds: ["pool-eastside-main"],
  },
];

export const equipment = [
  {
    id: "eq-flynn-pump",
    poolId: "pool-flynn-main",
    type: "Pump",
    brand: "AstralPool",
    model: "Viron P320",
    condition: "Good",
  },
  {
    id: "eq-flynn-chlorinator",
    poolId: "pool-flynn-main",
    type: "Chlorinator",
    brand: "Zodiac",
    model: "TRi",
    condition: "Monitor cell age",
  },
  {
    id: "eq-gillen-pump",
    poolId: "pool-gillen-plunge",
    type: "Pump",
    brand: "Davey",
    model: "PowerMaster",
    condition: "Noisy bearing",
  },
  {
    id: "eq-gillen-filter",
    poolId: "pool-gillen-plunge",
    type: "Filter",
    brand: "Waterco",
    model: "Opal",
    condition: "Service due",
  },
  {
    id: "eq-resort-heater",
    poolId: "pool-resort-spa",
    type: "Heater",
    brand: "Rheem",
    model: "Commercial gas",
    condition: "Good",
  },
  {
    id: "eq-resort-filter",
    poolId: "pool-resort-spa",
    type: "Filter",
    brand: "AstralPool",
    model: "CA cartridge",
    condition: "Cleaned recently",
  },
  {
    id: "eq-eastside-pump",
    poolId: "pool-eastside-main",
    type: "Pump",
    brand: "Onga",
    model: "Pantera",
    condition: "Good",
  },
];

export const waterTests = [
  {
    id: "test-flynn-1",
    customerId: "cust-flynn",
    siteId: "site-flynn",
    poolId: "pool-flynn-main",
    jobId: "JOB-1001",
    technicianId: "tech-sam",
    date: "2026-04-29",
    time: "8:42 AM",
    freeChlorine: "3.2 ppm",
    totalChlorine: "3.4 ppm",
    ph: "7.6",
    alkalinity: "90 ppm",
    calciumHardness: "240 ppm",
    cyanuricAcid: "45 ppm",
    salt: "4,200 ppm",
    phosphate: "150 ppb",
    waterTemperature: "27 C",
    summary: "Balanced",
    alertStatus: "Balanced",
    alerts: [],
    source: "Manual entry",
    notes: "Water clear. Chlorinator output looks stable.",
    chemicalsAdded: ["Salt Pool Protector"],
    recommendationIds: ["rec-flynn-salt-protector"],
  },
  {
    id: "test-flynn-2",
    customerId: "cust-flynn",
    siteId: "site-flynn",
    poolId: "pool-flynn-main",
    jobId: null,
    technicianId: "tech-jordan",
    date: "2026-04-15",
    time: "9:10 AM",
    freeChlorine: "2.8 ppm",
    totalChlorine: "3.0 ppm",
    ph: "7.4",
    alkalinity: "85 ppm",
    calciumHardness: "230 ppm",
    cyanuricAcid: "42 ppm",
    salt: "4,050 ppm",
    phosphate: "120 ppb",
    waterTemperature: "26 C",
    summary: "Balanced",
    alertStatus: "Balanced",
    alerts: [],
    source: "Manual entry",
    notes: "Routine service test. No corrective dosing required.",
    chemicalsAdded: [],
    recommendationIds: [],
  },
  {
    id: "test-gillen-1",
    customerId: "cust-apartments",
    siteId: "site-gillen",
    poolId: "pool-gillen-plunge",
    jobId: "JOB-1002",
    technicianId: "tech-jordan",
    date: "2026-04-28",
    time: "10:55 AM",
    freeChlorine: "1.1 ppm",
    totalChlorine: "1.4 ppm",
    ph: "7.8",
    alkalinity: "120 ppm",
    calciumHardness: "260 ppm",
    cyanuricAcid: "55 ppm",
    salt: "3,600 ppm",
    phosphate: "850 ppb",
    waterTemperature: "28 C",
    summary: "High phosphate risk",
    alertStatus: "High phosphate",
    alerts: ["low chlorine", "high pH", "high phosphate"],
    source: "Manual entry",
    notes: "Green tint returning. Heavy dust reported by tenant.",
    chemicalsAdded: ["Burn Out Extreme"],
    recommendationIds: ["rec-gillen-chlorine", "rec-gillen-phosphate", "rec-gillen-ph"],
  },
  {
    id: "test-resort-1",
    customerId: "cust-resort",
    siteId: "site-resort",
    poolId: "pool-resort-spa",
    jobId: "JOB-1004",
    technicianId: "tech-sam",
    date: "2026-04-30",
    time: "6:52 AM",
    freeChlorine: "4.1 ppm",
    totalChlorine: "4.4 ppm",
    ph: "7.5",
    alkalinity: "70 ppm",
    calciumHardness: "360 ppm",
    cyanuricAcid: "35 ppm",
    salt: "N/A",
    phosphate: "220 ppb",
    waterTemperature: "34 C",
    summary: "Monitor alkalinity",
    alertStatus: "Low alkalinity",
    alerts: ["low alkalinity"],
    source: "Manual entry",
    notes: "High bather load. Keep alkalinity under review.",
    chemicalsAdded: ["Balance Pak 100"],
    recommendationIds: ["rec-resort-alkalinity"],
  },
  {
    id: "test-eastside-1",
    customerId: "cust-eastside",
    siteId: "site-eastside",
    poolId: "pool-eastside-main",
    jobId: "JOB-1003",
    technicianId: "tech-taylor",
    date: "2026-04-27",
    time: "1:18 PM",
    freeChlorine: "3.0 ppm",
    totalChlorine: "3.1 ppm",
    ph: "8.0",
    alkalinity: "105 ppm",
    calciumHardness: "420 ppm",
    cyanuricAcid: "85 ppm",
    salt: "5,100 ppm",
    phosphate: "330 ppb",
    waterTemperature: "29 C",
    summary: "pH high",
    alertStatus: "High pH",
    alerts: ["high pH", "high cyanuric acid", "salt issue", "high calcium hardness"],
    source: "Manual entry",
    notes: "Recurring high pH. Review salt cell output and CYA dilution options.",
    chemicalsAdded: ["Lo 'N Slo"],
    recommendationIds: ["rec-eastside-ph", "rec-eastside-scale"],
  },
];

export const bioGuardProducts = [
  {
    id: "cal-chlor-hypo",
    name: "Cal Chlor Hypo",
    brand: "BioGuard Australia",
    category: "Sanitiser",
    purpose: "Raise free chlorine and support routine sanitation",
    unitType: "kg",
    productStrength: "Calcium hypochlorite sanitiser",
    applicationMethod:
      "Broadcast over the pool surface or pre-dissolve if the label directs. Run the pump and retest before swimming.",
    dosingNotes:
      "Use pool volume, current chlorine, and target chlorine to calculate the dose.",
    handlingNote: "Keep dry and store away from acids and other chemicals.",
    relatedWaterIssues: ["Low chlorine", "Algae risk", "Green water"],
    status: "Active",
  },
  {
    id: "burn-out-extreme",
    name: "Burn Out Extreme",
    brand: "BioGuard Australia",
    category: "Oxidiser",
    purpose: "Shock treatment for low chlorine and heavy organic load",
    unitType: "kg",
    productStrength: "Concentrated oxidiser",
    applicationMethod:
      "Broadcast over the pool surface with the pump running. Brush affected areas and retest after circulation.",
    dosingNotes:
      "Use as a mock shock option where extra oxidation is required.",
    handlingNote: "Add with the pump running and avoid swimming until water is safe.",
    relatedWaterIssues: ["Low chlorine", "Cloudy water", "Algae risk"],
    status: "Active",
  },
  {
    id: "lo-n-slo",
    name: "Lo 'N Slo",
    brand: "BioGuard Australia",
    category: "pH reducer",
    purpose: "Lower high pH and help control scale risk",
    unitType: "kg",
    productStrength: "Dry acid pH reducer",
    applicationMethod:
      "Pre-dissolve in a clean bucket if appropriate, then add slowly around the pool edge with circulation running.",
    dosingNotes:
      "Dose in stages and retest before adding more, especially in small pools and spas.",
    handlingNote: "Handle carefully and avoid adding near metal fixtures.",
    relatedWaterIssues: ["High pH", "Scaling risk", "High alkalinity"],
    status: "Active",
  },
  {
    id: "balance-pak-100",
    name: "Balance Pak 100",
    brand: "BioGuard Australia",
    category: "Alkalinity increaser",
    purpose: "Raise total alkalinity",
    unitType: "kg",
    productStrength: "Alkalinity increaser",
    applicationMethod:
      "Broadcast slowly over the pool surface with the pump running. Retest after circulation.",
    dosingNotes:
      "Increase alkalinity gradually to avoid overshooting the target range.",
    handlingNote: "Broadcast slowly with the pump running.",
    relatedWaterIssues: ["Low alkalinity", "pH bounce"],
    status: "Active",
  },
  {
    id: "balance-pak-200",
    name: "Balance Pak 200",
    brand: "BioGuard Australia",
    category: "pH increaser",
    purpose: "Raise low pH",
    unitType: "kg",
    productStrength: "pH increaser",
    applicationMethod:
      "Add gradually around the pool edge with the pump running, then retest before further adjustment.",
    dosingNotes:
      "Use staged adjustments when pH is low or swimmer comfort is affected.",
    handlingNote: "Add gradually and retest before adding more.",
    relatedWaterIssues: ["Low pH", "Corrosion risk"],
    status: "Active",
  },
  {
    id: "pool-tonic",
    name: "Pool Tonic",
    brand: "BioGuard Australia",
    category: "Water enhancer",
    purpose: "Support sparkle and water feel after service",
    unitType: "L",
    productStrength: "Water enhancer blend",
    applicationMethod:
      "Add around the pool edge with the pump running. Maintain normal circulation.",
    dosingNotes:
      "Use as a finishing treatment when water is balanced but needs polish.",
    handlingNote: "Follow label directions and keep circulation running.",
    relatedWaterIssues: ["Cloudy water", "Dull water"],
    status: "Active",
  },
  {
    id: "pool-complete",
    name: "Pool Complete",
    brand: "BioGuard Australia",
    category: "Water clarifier",
    purpose: "Clarify water and support filter performance",
    unitType: "L",
    productStrength: "Clarifier and enhancer",
    applicationMethod:
      "Add around the pool edge with clean filtration and normal circulation.",
    dosingNotes:
      "Use where water clarity needs support after chemistry is corrected.",
    handlingNote: "Use with clean filtration and normal circulation.",
    relatedWaterIssues: ["Cloudy water", "Fine debris", "Dull water"],
    status: "Active",
  },
  {
    id: "phos-kill",
    name: "Phos Kill",
    brand: "BioGuard Australia",
    category: "Phosphate remover",
    purpose: "Reduce phosphate load",
    unitType: "L",
    productStrength: "Phosphate remover",
    applicationMethod:
      "Add around the pool edge with pump running. Monitor filter pressure and clean the filter if needed.",
    dosingNotes:
      "Dose based on phosphate reading and pool volume, then retest after treatment.",
    handlingNote: "Clean filter after treatment if pressure rises.",
    relatedWaterIssues: ["High phosphate", "Algae risk", "Recurring chlorine loss"],
    status: "Active",
  },
  {
    id: "chem-out",
    name: "Chem Out",
    brand: "BioGuard Australia",
    category: "Chlorine reducer",
    purpose: "Reduce excessive chlorine levels",
    unitType: "kg",
    productStrength: "Chlorine reducer",
    applicationMethod:
      "Add carefully with the pump running, then retest before allowing swimming.",
    dosingNotes:
      "Use only when chlorine is above the safe operating range.",
    handlingNote: "Use only when chlorine is too high and retest before swimming.",
    relatedWaterIssues: ["High chlorine", "Swimmer comfort"],
    status: "Active",
  },
  {
    id: "stain-scale-remover",
    name: "Stain & Scale Remover",
    brand: "BioGuard Australia",
    category: "Stain and scale control",
    purpose: "Reduce stain and scale risk",
    unitType: "L",
    productStrength: "Stain and scale control",
    applicationMethod:
      "Add around the pool edge with the pump running. Brush areas where scale risk is visible.",
    dosingNotes:
      "Use as a mock treatment option for high calcium hardness or scaling risk.",
    handlingNote: "Avoid overdosing and check equipment manufacturer guidance.",
    relatedWaterIssues: ["High calcium hardness", "Scaling risk", "Staining risk"],
    status: "Active",
  },
  {
    id: "algi-destroyer",
    name: "Algi Destroyer",
    brand: "BioGuard Australia",
    category: "Algaecide",
    purpose: "Treat visible algae and algae risk",
    unitType: "L",
    productStrength: "Algaecide",
    applicationMethod:
      "Brush affected areas, add around the pool edge, and run the pump after application.",
    dosingNotes:
      "Use alongside filtration, brushing, and chlorine correction where appropriate.",
    handlingNote: "Brush affected areas and run the pump after application.",
    relatedWaterIssues: ["Algae risk", "Green water"],
    status: "Active",
  },
  {
    id: "msa-extreme",
    name: "MSA Extreme",
    brand: "BioGuard Australia",
    category: "Algae treatment",
    purpose: "Treat more stubborn algae conditions",
    unitType: "L",
    productStrength: "Specialty algae treatment",
    applicationMethod:
      "Apply according to label directions with circulation running and follow-up brushing.",
    dosingNotes:
      "Use as a mock advanced algae treatment option after technician review.",
    handlingNote: "Use according to label and keep swimmers out until safe.",
    relatedWaterIssues: ["Algae risk", "Green water", "Recurring algae"],
    status: "Active",
  },
  {
    id: "salt-pool-protector",
    name: "Salt Pool Protector",
    brand: "BioGuard Australia",
    category: "Salt pool care",
    purpose: "Protect salt pools and support salt system performance",
    unitType: "L",
    productStrength: "Salt pool maintenance treatment",
    applicationMethod:
      "Add slowly around the pool edge with the pump running. Keep circulation on after treatment.",
    dosingNotes:
      "Use as a maintenance product for salt pools based on pool volume.",
    handlingNote: "Use with salt systems as part of routine protection.",
    relatedWaterIssues: ["Salt system support", "Scale prevention", "Routine care"],
    status: "Active",
  },
];

export const chemicalRecommendations = [
  {
    id: "rec-flynn-salt-protector",
    testId: "test-flynn-1",
    issue: "Routine salt pool protection",
    productId: "salt-pool-protector",
    suggestedDose: "Add 500 mL for 52,000 L as a mock maintenance example",
    applicationMethod:
      "Add slowly around the pool edge with the pump running. Keep circulation on for at least 2 hours.",
    safetyNote: "Follow the product label and avoid mixing with other chemicals.",
    alternativeProduct: "Pool Complete placeholder",
  },
  {
    id: "rec-gillen-chlorine",
    testId: "test-gillen-1",
    issue: "Low chlorine",
    productId: "burn-out-extreme",
    suggestedDose: "Add 450 g for 18,000 L as a mock shock treatment example",
    applicationMethod:
      "Broadcast over the pool surface with the pump running. Brush walls and floor, then retest after circulation.",
    safetyNote: "Keep swimmers out until chlorine returns to a safe range.",
    alternativeProduct: "Cal Chlor Hypo placeholder",
  },
  {
    id: "rec-gillen-phosphate",
    testId: "test-gillen-1",
    issue: "High phosphate",
    productId: "phos-kill",
    suggestedDose: "Add 180 mL for 18,000 L as a mock phosphate treatment example",
    applicationMethod:
      "Add around the pool edge with the pump running. Check filter pressure and clean filter if needed.",
    safetyNote: "Do not add directly to the skimmer unless the product label allows it.",
    alternativeProduct: "Pool Tonic placeholder",
  },
  {
    id: "rec-gillen-ph",
    testId: "test-gillen-1",
    issue: "High pH",
    productId: "lo-n-slo",
    suggestedDose: "Add 250 g for 18,000 L as a mock pH correction example",
    applicationMethod:
      "Pre-dissolve in a clean bucket if appropriate, then add slowly around the pool edge with the pump running.",
    safetyNote: "Avoid splashing and retest before adding more acid product.",
    alternativeProduct: "No alternative selected",
  },
  {
    id: "rec-resort-alkalinity",
    testId: "test-resort-1",
    issue: "Low alkalinity",
    productId: "balance-pak-100",
    suggestedDose: "Add 750 g for 9,500 L as a mock alkalinity adjustment example",
    applicationMethod:
      "Broadcast slowly over the pool surface. Run pump and retest after circulation.",
    safetyNote: "Add in stages for small spas to avoid overshooting the target.",
    alternativeProduct: "Balance Pak 200 placeholder if pH also needs support",
  },
  {
    id: "rec-eastside-ph",
    testId: "test-eastside-1",
    issue: "High pH",
    productId: "lo-n-slo",
    suggestedDose: "Add 600 g for 44,000 L as a mock pH correction example",
    applicationMethod:
      "Add slowly around the pool edge with the pump running. Retest after the recommended circulation period.",
    safetyNote: "Do not mix with chlorine products. Store safely after use.",
    alternativeProduct: "No alternative selected",
  },
  {
    id: "rec-eastside-scale",
    testId: "test-eastside-1",
    issue: "High calcium hardness / scaling risk",
    productId: "stain-scale-remover",
    suggestedDose: "Add 440 mL for 44,000 L as a mock scale-control example",
    applicationMethod:
      "Add around the pool edge and run pump for several hours. Brush visible scale-prone areas.",
    safetyNote: "Check product label for surface and equipment compatibility.",
    alternativeProduct: "Salt Pool Protector placeholder",
  },
];

export const vanStock = [
  {
    id: "stock-sam-cal",
    productId: "cal-chlor-hypo",
    technicianId: "tech-sam",
    vanName: "Sam's service van",
    quantityOnHand: 6,
    unit: "kg",
    unitCost: "$8.20",
    sellingPrice: "$14.50",
    lowStockThreshold: 5,
    stockStatus: "Normal",
    supplier: "BioGuard distributor placeholder",
  },
  {
    id: "stock-sam-salt",
    productId: "salt-pool-protector",
    technicianId: "tech-sam",
    vanName: "Sam's service van",
    quantityOnHand: 1,
    unit: "L",
    unitCost: "$18.00",
    sellingPrice: "$30.00",
    lowStockThreshold: 2,
    stockStatus: "Low stock",
    supplier: "BioGuard distributor placeholder",
  },
  {
    id: "stock-jordan-burnout",
    productId: "burn-out-extreme",
    technicianId: "tech-jordan",
    vanName: "Jordan's service van",
    quantityOnHand: 3,
    unit: "kg",
    unitCost: "$12.50",
    sellingPrice: "$22.00",
    lowStockThreshold: 2,
    stockStatus: "Normal",
    supplier: "BioGuard distributor placeholder",
  },
  {
    id: "stock-jordan-phos",
    productId: "phos-kill",
    technicianId: "tech-jordan",
    vanName: "Jordan's service van",
    quantityOnHand: 0.5,
    unit: "L",
    unitCost: "$24.00",
    sellingPrice: "$42.00",
    lowStockThreshold: 1,
    stockStatus: "Low stock",
    supplier: "BioGuard distributor placeholder",
  },
  {
    id: "stock-taylor-lo-n-slo",
    productId: "lo-n-slo",
    technicianId: "tech-taylor",
    vanName: "Taylor's repair van",
    quantityOnHand: 4,
    unit: "kg",
    unitCost: "$7.60",
    sellingPrice: "$13.50",
    lowStockThreshold: 2,
    stockStatus: "Normal",
    supplier: "BioGuard distributor placeholder",
  },
  {
    id: "stock-taylor-stain-scale",
    productId: "stain-scale-remover",
    technicianId: "tech-taylor",
    vanName: "Taylor's repair van",
    quantityOnHand: 1,
    unit: "L",
    unitCost: "$19.50",
    sellingPrice: "$35.00",
    lowStockThreshold: 1,
    stockStatus: "Watch",
    supplier: "BioGuard distributor placeholder",
  },
];

export const stockUsage = [
  {
    id: "usage-flynn-salt",
    jobId: "JOB-1001",
    invoiceId: "invoice-3101",
    waterTestId: "test-flynn-1",
    productId: "salt-pool-protector",
    technicianId: "tech-sam",
    quantityUsed: "1 L",
    cost: "$18.00",
    chargeAmount: "$30.00",
    margin: "$12.00 planned",
    usageDate: "2026-05-02",
  },
  {
    id: "usage-resort-balance",
    jobId: "JOB-1004",
    invoiceId: "invoice-3102",
    waterTestId: "test-resort-1",
    productId: "balance-pak-100",
    technicianId: "tech-sam",
    quantityUsed: "1 kg",
    cost: "$14.00",
    chargeAmount: "$80.00",
    margin: "$66.00 planned",
    usageDate: "2026-05-01",
  },
  {
    id: "usage-gillen-burnout",
    jobId: "JOB-1002",
    invoiceId: "invoice-3103",
    waterTestId: "test-gillen-1",
    productId: "burn-out-extreme",
    technicianId: "tech-jordan",
    quantityUsed: "0.5 kg",
    cost: "$6.25",
    chargeAmount: "$32.00",
    margin: "$25.75 planned",
    usageDate: "2026-05-02",
  },
  {
    id: "usage-gillen-phos",
    jobId: "JOB-1002",
    invoiceId: "invoice-3103",
    waterTestId: "test-gillen-1",
    productId: "phos-kill",
    technicianId: "tech-jordan",
    quantityUsed: "250 mL",
    cost: "$6.00",
    chargeAmount: "$22.00",
    margin: "$16.00 planned",
    usageDate: "2026-05-02",
  },
  {
    id: "usage-eastside-lo-n-slo",
    jobId: "JOB-1003",
    invoiceId: "invoice-3104",
    waterTestId: "test-eastside-1",
    productId: "lo-n-slo",
    technicianId: "tech-taylor",
    quantityUsed: "600 g",
    cost: "$4.56",
    chargeAmount: "$18.00",
    margin: "$13.44 planned",
    usageDate: "2026-05-02",
  },
];

export const jobProfitability = [
  {
    jobId: "JOB-1001",
    labourTime: "1.25 hrs",
    travelTime: "18 min",
    chemicalCost: "$18.00",
    partsCost: "$0.00",
    invoiceValue: "$198.00",
    estimatedMargin: "$97.50 planned",
  },
  {
    jobId: "JOB-1004",
    labourTime: "1.5 hrs",
    travelTime: "24 min",
    chemicalCost: "$14.00",
    partsCost: "$0.00",
    invoiceValue: "$352.00",
    estimatedMargin: "$188.00 planned",
  },
  {
    jobId: "JOB-1002",
    labourTime: "2.0 hrs",
    travelTime: "22 min",
    chemicalCost: "$12.25",
    partsCost: "$0.00",
    invoiceValue: "$462.00",
    estimatedMargin: "$119.75 planned",
  },
  {
    jobId: "JOB-1003",
    labourTime: "1.0 hr",
    travelTime: "16 min",
    chemicalCost: "$4.56",
    partsCost: "$38.18",
    invoiceValue: "$240.00",
    estimatedMargin: "$84.26 planned",
  },
];

export const dispatchHours = ["8:00", "9:30", "11:00", "12:30", "2:00", "3:30"];
export const dispatchTechnicians = ["Sam", "Jordan", "Taylor"];

export const routePlans = [
  {
    id: "route-sam-2026-05-02",
    technicianId: "tech-sam",
    routeDate: "2026-05-02",
    startingLocation: "Outback Pool & Spa Services depot, Alice Springs",
    routeStatus: "Ready to optimise",
    optimisationStatus: "Mock current route",
    totalDayDuration: "4 hrs 35 min",
    currentDistance: "42 km",
    currentTravelTime: "1 hr 8 min",
    optimisedDistance: "34 km",
    optimisedTravelTime: "52 min",
    estimatedTimeSaved: "16 min",
    estimatedFuelReduction: "8 km travel reduction placeholder",
    stops: [
      {
        id: "stop-sam-1",
        jobId: "JOB-1001",
        stopOrder: 1,
        estimatedTravelTime: "18 min",
        estimatedServiceDuration: "75 min",
        mapsUrl: "Maps placeholder",
      },
      {
        id: "stop-sam-2",
        jobId: "JOB-1004",
        stopOrder: 2,
        estimatedTravelTime: "24 min",
        estimatedServiceDuration: "90 min",
        mapsUrl: "Maps placeholder",
      },
    ],
  },
  {
    id: "route-jordan-2026-05-02",
    technicianId: "tech-jordan",
    routeDate: "2026-05-02",
    startingLocation: "Outback Pool & Spa Services depot, Alice Springs",
    routeStatus: "Needs review",
    optimisationStatus: "Optimisation suggested",
    totalDayDuration: "3 hrs 45 min",
    currentDistance: "31 km",
    currentTravelTime: "54 min",
    optimisedDistance: "25 km",
    optimisedTravelTime: "41 min",
    estimatedTimeSaved: "13 min",
    estimatedFuelReduction: "6 km travel reduction placeholder",
    stops: [
      {
        id: "stop-jordan-1",
        jobId: "JOB-1002",
        stopOrder: 1,
        estimatedTravelTime: "22 min",
        estimatedServiceDuration: "120 min",
        mapsUrl: "Maps placeholder",
      },
      {
        id: "stop-jordan-2",
        jobId: "JOB-1005",
        stopOrder: 2,
        estimatedTravelTime: "19 min",
        estimatedServiceDuration: "90 min",
        mapsUrl: "Maps placeholder",
      },
    ],
  },
  {
    id: "route-taylor-2026-05-02",
    technicianId: "tech-taylor",
    routeDate: "2026-05-02",
    startingLocation: "East Side parts pickup placeholder",
    routeStatus: "Sent to technician",
    optimisationStatus: "Mock optimised",
    totalDayDuration: "1 hr 35 min",
    currentDistance: "16 km",
    currentTravelTime: "28 min",
    optimisedDistance: "14 km",
    optimisedTravelTime: "23 min",
    estimatedTimeSaved: "5 min",
    estimatedFuelReduction: "2 km travel reduction placeholder",
    stops: [
      {
        id: "stop-taylor-1",
        jobId: "JOB-1003",
        stopOrder: 1,
        estimatedTravelTime: "23 min",
        estimatedServiceDuration: "60 min",
        mapsUrl: "Maps placeholder",
      },
    ],
  },
];

export const waterReadings = [
  { label: "Free chlorine", value: "3.2 ppm", state: "In range" },
  { label: "pH", value: "7.6", state: "In range" },
  { label: "Alkalinity", value: "90 ppm", state: "Monitor" },
  { label: "Salt", value: "4,200 ppm", state: "In range" },
];

export const quotes = [
  {
    id: "quote-2041",
    number: "Q-2041",
    title: "Pump replacement",
    customerId: "cust-eastside",
    siteId: "site-eastside",
    poolId: "pool-eastside-main",
    jobId: "JOB-1003",
    reportId: null,
    quoteDate: "2026-04-27",
    expiryDate: "2026-05-11",
    status: "Draft",
    approvalStatus: "Not sent",
    totalAmount: "$1,485.00",
    subtotal: "$1,350.00",
    gst: "$135.00",
    lineItems: [
      {
        type: "Labour",
        description: "Pump diagnosis and replacement labour",
        quantity: "2.0 hrs",
        amount: "$330.00",
      },
      {
        type: "Parts",
        description: "Replacement pool pump allowance",
        quantity: "1",
        amount: "$980.00",
      },
      {
        type: "Chemicals",
        description: "Post-install water balance allowance",
        quantity: "1",
        amount: "$40.00",
      },
    ],
    terms:
      "Quote is valid until the expiry date. Parts availability and final site conditions may affect scheduling.",
  },
  {
    id: "quote-2042",
    number: "Q-2042",
    title: "Green pool recovery",
    customerId: "cust-apartments",
    siteId: "site-gillen",
    poolId: "pool-gillen-plunge",
    jobId: "JOB-1002",
    reportId: "report-inspection-gillen",
    quoteDate: "2026-05-02",
    expiryDate: "2026-05-16",
    status: "Sent",
    approvalStatus: "Awaiting approval",
    totalAmount: "$682.00",
    subtotal: "$620.00",
    gst: "$62.00",
    lineItems: [
      {
        type: "Labour",
        description: "Green pool recovery visit and brushing",
        quantity: "2.5 hrs",
        amount: "$412.50",
      },
      {
        type: "Chemicals",
        description: "BioGuard shock and phosphate treatment allowance",
        quantity: "1",
        amount: "$157.50",
      },
      {
        type: "Parts",
        description: "Filter clean consumables",
        quantity: "1",
        amount: "$50.00",
      },
    ],
    terms:
      "Treatment results depend on water condition, access, weather, filtration, and approval timing.",
  },
  {
    id: "quote-2043",
    number: "Q-2043",
    title: "Filter media change",
    customerId: "cust-apartments",
    siteId: "site-larapinta",
    poolId: "pool-gillen-plunge",
    jobId: "JOB-1005",
    reportId: null,
    quoteDate: "2026-04-30",
    expiryDate: "2026-05-14",
    status: "Approved",
    approvalStatus: "Approved online",
    totalAmount: "$935.00",
    subtotal: "$850.00",
    gst: "$85.00",
    lineItems: [
      {
        type: "Labour",
        description: "Filter media removal and replacement",
        quantity: "3.0 hrs",
        amount: "$495.00",
      },
      {
        type: "Parts",
        description: "Filter media and disposal allowance",
        quantity: "1",
        amount: "$330.00",
      },
      {
        type: "Chemicals",
        description: "Startup clarifier allowance",
        quantity: "1",
        amount: "$25.00",
      },
    ],
    terms:
      "Approved quote can be converted to a scheduled job or invoice placeholder in a later workflow.",
  },
  {
    id: "quote-2044",
    number: "Q-2044",
    title: "Salt chlorinator output review",
    customerId: "cust-flynn",
    siteId: "site-flynn",
    poolId: "pool-flynn-main",
    jobId: "JOB-1001",
    reportId: "report-service-1001",
    quoteDate: "2026-05-02",
    expiryDate: "2026-05-16",
    status: "Sent",
    approvalStatus: "Awaiting approval",
    totalAmount: "$418.00",
    subtotal: "$380.00",
    gst: "$38.00",
    lineItems: [
      {
        type: "Labour",
        description: "Inspect chlorinator output and clean salt cell",
        quantity: "1.5 hrs",
        amount: "$247.50",
      },
      {
        type: "Parts",
        description: "Cell cleaning consumables and minor fittings allowance",
        quantity: "1",
        amount: "$82.50",
      },
      {
        type: "Chemicals",
        description: "Salt Pool Protector maintenance treatment",
        quantity: "1",
        amount: "$50.00",
      },
    ],
    terms:
      "Approval allows the technician to schedule the chlorinator output review at the next suitable service window.",
  },
];

export const invoices = [
  {
    id: "invoice-3101",
    number: "INV-3101",
    customerId: "cust-flynn",
    siteId: "site-flynn",
    poolId: "pool-flynn-main",
    jobId: "JOB-1001",
    reportId: null,
    invoiceDate: "2026-05-02",
    dueDate: "2026-05-02",
    totalAmount: "$198.00",
    subtotal: "$180.00",
    gst: "$18.00",
    paymentStatus: "Unpaid",
    xeroSyncStatus: "Ready to sync",
    status: "Sent",
    lineItems: [
      {
        type: "Labour",
        description: "Regular pool service",
        quantity: "1",
        amount: "$150.00",
      },
      {
        type: "Chemicals",
        description: "Salt Pool Protector maintenance dose",
        quantity: "1",
        amount: "$30.00",
      },
    ],
  },
  {
    id: "invoice-3102",
    number: "INV-3102",
    customerId: "cust-resort",
    siteId: "site-resort",
    poolId: "pool-resort-spa",
    jobId: "JOB-1004",
    reportId: "report-service-1004",
    invoiceDate: "2026-05-01",
    dueDate: "2026-05-31",
    totalAmount: "$352.00",
    subtotal: "$320.00",
    gst: "$32.00",
    paymentStatus: "Paid",
    xeroSyncStatus: "Synced",
    status: "Paid",
    lineItems: [
      {
        type: "Labour",
        description: "Commercial spa service",
        quantity: "1",
        amount: "$240.00",
      },
      {
        type: "Chemicals",
        description: "Balance Pak 100 alkalinity adjustment",
        quantity: "1",
        amount: "$80.00",
      },
    ],
  },
  {
    id: "invoice-3103",
    number: "INV-3103",
    customerId: "cust-apartments",
    siteId: "site-gillen",
    poolId: "pool-gillen-plunge",
    jobId: "JOB-1002",
    reportId: "report-inspection-gillen",
    invoiceDate: "2026-04-18",
    dueDate: "2026-05-02",
    totalAmount: "$462.00",
    subtotal: "$420.00",
    gst: "$42.00",
    paymentStatus: "Overdue",
    xeroSyncStatus: "Sync failed",
    status: "Overdue",
    lineItems: [
      {
        type: "Labour",
        description: "Inspection and water recovery assessment",
        quantity: "2.0 hrs",
        amount: "$330.00",
      },
      {
        type: "Chemicals",
        description: "Initial shock treatment allowance",
        quantity: "1",
        amount: "$90.00",
      },
    ],
  },
  {
    id: "invoice-3104",
    number: "INV-3104",
    customerId: "cust-eastside",
    siteId: "site-eastside",
    poolId: "pool-eastside-main",
    jobId: "JOB-1003",
    reportId: null,
    invoiceDate: "2026-05-02",
    dueDate: "2026-05-09",
    totalAmount: "$240.00",
    subtotal: "$218.18",
    gst: "$21.82",
    paymentStatus: "Partially paid",
    xeroSyncStatus: "Not synced",
    status: "Partially paid",
    lineItems: [
      {
        type: "Labour",
        description: "Pump inspection",
        quantity: "1",
        amount: "$180.00",
      },
      {
        type: "Parts",
        description: "Minor fittings allowance",
        quantity: "1",
        amount: "$38.18",
      },
    ],
  },
];

export const payments = [
  {
    id: "payment-9001",
    invoiceId: "invoice-3102",
    date: "2026-05-01",
    amount: "$352.00",
    method: "Bank transfer",
    status: "Paid",
    reference: "DSR-3102",
  },
  {
    id: "payment-9002",
    invoiceId: "invoice-3104",
    date: "2026-05-02",
    amount: "$100.00",
    method: "Card placeholder",
    status: "Received",
    reference: "PART-3104",
  },
];

export const reportTypes = [
  "Service reports",
  "Pool inspection reports",
  "Revenue reports",
  "Stock and chemical usage",
];

export const reports = [
  {
    id: "report-service-1001",
    reportNumber: "SR-1001",
    reportType: "Service Report",
    customerId: "cust-flynn",
    siteId: "site-flynn",
    poolId: "pool-flynn-main",
    jobId: "JOB-1001",
    technicianId: "tech-sam",
    waterTestId: "test-flynn-1",
    equipmentIds: ["eq-flynn-pump", "eq-flynn-chlorinator"],
    reportDate: "2026-05-02",
    status: "Ready",
    sentStatus: "Sent to customer",
    workCompleted:
      "Completed regular pool service, tested water, emptied baskets, brushed steps, and checked visible equipment operation.",
    equipmentObservations:
      "Pump is operating normally. Salt chlorinator output should be reviewed at the next visit due to recent lower chlorine trend.",
    recommendations:
      "Approve the linked chlorinator output quote and continue routine salt pool maintenance.",
    summaryOfFindings:
      "Pool is clear and suitable for normal use. Chlorine is in range, with a recommendation to monitor chlorinator output.",
    customerSummary:
      "Your regular pool service has been completed. Water is clear and the pool is ready to enjoy.",
    nextService: "Next fortnightly service is scheduled for 2026-05-09.",
    photoSummary: "Before, after, and equipment photos placeholder",
  },
  {
    id: "report-service-1004",
    reportNumber: "SR-1004",
    reportType: "Service Report",
    customerId: "cust-resort",
    siteId: "site-resort",
    poolId: "pool-resort-spa",
    jobId: "JOB-1004",
    technicianId: "tech-sam",
    waterTestId: "test-resort-1",
    equipmentIds: ["eq-resort-heater", "eq-resort-filter"],
    reportDate: "2026-05-01",
    status: "Ready",
    sentStatus: "Not sent",
    workCompleted:
      "Completed commercial spa service, tested water, inspected heater operation, cleaned baskets, and logged filter pressure.",
    equipmentObservations:
      "Heater operating normally. Cartridge filter was cleaned recently and pressure remains within normal range.",
    recommendations:
      "Monitor alkalinity over the next two services due to high bather load.",
    summaryOfFindings:
      "Spa is operational and safe for normal use. Alkalinity is slightly low and should be adjusted in stages.",
    customerSummary:
      "Your commercial spa service has been completed. Water is clear and equipment is operating normally.",
    nextService: "Next weekly commercial spa service is scheduled for 2026-05-06.",
    photoSummary: "Before and after photos placeholder",
  },
  {
    id: "report-inspection-gillen",
    reportNumber: "IR-2042",
    reportType: "Pool Inspection Report",
    customerId: "cust-apartments",
    siteId: "site-gillen",
    poolId: "pool-gillen-plunge",
    jobId: "JOB-1002",
    technicianId: "tech-jordan",
    waterTestId: "test-gillen-1",
    equipmentIds: ["eq-gillen-pump", "eq-gillen-filter"],
    reportDate: "2026-05-02",
    status: "Draft",
    sentStatus: "Not sent",
    workCompleted:
      "Inspection completed for green pool recovery quote. Water condition, access, pump noise, and filter condition were reviewed.",
    equipmentObservations:
      "Pump bearing is noisy and filter service is due. Recommend review before extended recovery treatment.",
    recommendations:
      "Treat phosphates, raise chlorine, correct pH, brush surfaces, and schedule follow-up inspection after treatment.",
    summaryOfFindings:
      "Pool shows water quality issues consistent with dust load and low sanitiser. Equipment should be monitored during recovery.",
    customerSummary:
      "The pool requires treatment before it can return to normal service condition. A quote is linked for approval.",
    nextService: "Follow-up visit placeholder after quote approval.",
    photoSummary: "Green pool, equipment label, and access photos placeholder",
  },
];

export const inspectionSections = [
  "Scope of Inspection",
  "Pool Information",
  "Water Chemistry",
  "Equipment Inspection",
  "Pump",
  "Filter",
  "Chlorinator / Sanitiser",
  "Heater",
  "Other Equipment",
  "Structural & Safety Assessment",
  "Pool Shell / Structure",
  "Pool Interior Surface",
  "Skimmer and Surrounds",
  "General Safety Compliance",
  "Summary of Findings",
  "Photo Evidence",
];

export const settingsSections = [
  "Business profile",
  "Users and roles",
  "Message templates",
  "Integrations",
  "Chemical rules",
  "Customer portal",
];

export function getCustomerById(id: string) {
  return customers.find((customer) => customer.id === id);
}

export function getSiteById(id: string) {
  return sites.find((site) => site.id === id);
}

export function getPoolById(id: string) {
  return pools.find((pool) => pool.id === id);
}

export function getTechnicianById(id: string) {
  return technicians.find((technician) => technician.id === id);
}

export function getJobById(id: string) {
  return jobs.find((job) => job.id === id);
}

export function getSitesForCustomer(customerId: string) {
  return sites.filter((site) => site.customerId === customerId);
}

export function getPoolsForSite(siteId: string) {
  return pools.filter((pool) => pool.siteId === siteId);
}

export function getEquipmentForPool(poolId: string) {
  return equipment.filter((item) => item.poolId === poolId);
}

export function getWaterTestsForPool(poolId: string) {
  return waterTests.filter((test) => test.poolId === poolId);
}

export function getWaterTestsByIds(ids: string[]) {
  return waterTests.filter((test) => ids.includes(test.id));
}

export function getWaterTestById(id: string) {
  return waterTests.find((test) => test.id === id);
}

export function getChemicalRecommendationsForTest(testId: string) {
  return chemicalRecommendations.filter(
    (recommendation) => recommendation.testId === testId,
  );
}

export function getBioGuardProductById(id: string) {
  return bioGuardProducts.find((product) => product.id === id);
}

export function getStockEntriesForProduct(productId: string) {
  return vanStock.filter((stock) => stock.productId === productId);
}

export function getStockUsageForProduct(productId: string) {
  return stockUsage.filter((usage) => usage.productId === productId);
}

export function getStockUsageForJob(jobId: string) {
  return stockUsage.filter((usage) => usage.jobId === jobId);
}

export function getStockUsageForInvoice(invoiceId: string) {
  return stockUsage.filter((usage) => usage.invoiceId === invoiceId);
}

export function getJobProfitabilityByJobId(jobId: string) {
  return jobProfitability.find((item) => item.jobId === jobId);
}

export function getReportById(id: string) {
  return reports.find((report) => report.id === id);
}

export function getQuoteById(id: string) {
  return quotes.find((quote) => quote.id === id || quote.number === id);
}

export function getInvoiceById(id: string) {
  return invoices.find((invoice) => invoice.id === id || invoice.number === id);
}

export function getPaymentsForInvoice(invoiceId: string) {
  return payments.filter((payment) => payment.invoiceId === invoiceId);
}

export function getJobsForCustomer(customerId: string) {
  return jobs.filter((job) => job.customerId === customerId);
}

export function getJobsForSite(siteId: string) {
  return jobs.filter((job) => job.siteId === siteId);
}

export function getJobsForTechnician(technicianId: string) {
  return jobs.filter((job) => job.technicianId === technicianId);
}

export function getRoutePlansForDate(routeDate: string) {
  return routePlans.filter((route) => route.routeDate === routeDate);
}

export function getRoutePlanForTechnician(
  technicianId: string,
  routeDate: string,
) {
  return routePlans.find(
    (route) =>
      route.technicianId === technicianId && route.routeDate === routeDate,
  );
}
