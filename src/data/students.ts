export interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  course: string;
  regDate: string;
  paymentPlan: string;
  amountPaid: number;
  balanceRemaining: number;
  status: "None" | "Awaiting" | "Confirmed";
}

const firstNames = ["Emma", "Michael", "Sarah", "James", "Olivia", "Daniel", "Sophia", "William", "Isabella", "Alexander", "Mia", "Ethan", "Charlotte", "Noah", "Amelia", "Liam", "Harper", "Mason", "Evelyn", "Logan", "Abigail", "Lucas", "Emily", "Jackson", "Elizabeth", "Aiden", "Sofia", "Oliver", "Ava", "Elijah", "Madison", "Benjamin", "Avery", "Henry", "Ella", "Sebastian", "Scarlett", "Jack", "Grace", "Owen", "Chloe", "Matthew", "Victoria", "Joseph", "Lily", "David", "Zoe", "Samuel", "Natalie", "Carter", "Hannah", "Wyatt", "Lillian", "Jayden", "Addison", "John", "Brooklyn", "Dylan", "Leah", "Luke", "Eleanor", "Gabriel", "Hannah", "Isaac", "Audrey", "Lincoln", "Claire", "Anthony", "Skylar", "Joshua", "Lucy", "Christopher", "Paisley", "Andrew", "Aurora", "Calvin", "Savannah", "Evan", "Penelope", "Ryan", "Stella", "Adrian", "Nora", "Nathan", "Caroline", "Jonathan", "Ellie", "Christian", "Anna", "Aaron", "Maya", "Caleb", "Kennedy", "Thomas", "Allison", "Julian", "Nevaeh", "Eli", "Ariana", "Isaiah", "Alice"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Thompson", "White", "Harris", "Sanchez", "Clark", "Lewis", "Robinson", "Walker", "Young", "Allen", "King", "Wright", "Scott", "Green", "Baker", "Adams", "Nelson", "Carter", "Mitchell", "Roberts", "Turner", "Phillips", "Campbell", "Parker", "Evans", "Edwards", "Collins", "Stewart", "Sanchez", "Morris", "Rogers", "Reed", "Cook", "Morgan", "Bell", "Murphy", "Bailey", "Cooper", "Richardson", "Cox", "Howard", "Ward", "Torres", "Peterson", "Gray", "Ramirez", "James", "Watson", "Brooks", "Kelly", "Sanders", "Price", "Bennett", "Wood", "Barnes", "Ross", "Henderson", "Coleman", "Jenkins", "Perry", "Powell", "Long", "Patterson", "Flores", "Washington", "Butler", "Simmons", "Foster", "Gonzales", "Bryant", "Alexander", "Russell", "Griffin", "Diaz", "Hayes"];

const courses = [
  "Cybersecurity",
  "Data Science",
  "AI Automation",
  "Computer Networking",
  "Ethical Hacking",
  "Graphic Design",
  "UI/UX Design",
  "3D Animation",
  "Full Stack Development",
  "Frontend Development",
  "Backend Development",
  "Web Development",
  "Digital Marketing",
  "Cloud Computing",
];

const paymentPlans = ["Fully Paid", "1st installment", "2nd installment"];

// Seeded random number generator for consistent results
let seed = 12345;
function seededRandom() {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export const mockStudents: Student[] = Array.from({ length: 100 }, (_, index) => {
  const firstName = firstNames[Math.floor(seededRandom() * firstNames.length)];
  const lastName = lastNames[Math.floor(seededRandom() * lastNames.length)];
  const course = courses[Math.floor(seededRandom() * courses.length)];
  const paymentPlan = paymentPlans[Math.floor(seededRandom() * paymentPlans.length)];
  const status = "None";
  
  const totalAmount = Math.floor(seededRandom() * 3000) + 1000;
  const paidAmount = Math.floor(seededRandom() * totalAmount);
  const balance = totalAmount - paidAmount;
  
  const year = 2023 + Math.floor(seededRandom() * 2);
  const month = Math.floor(seededRandom() * 12) + 1;
  const day = Math.floor(seededRandom() * 28) + 1;
  const regDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  
  return {
    id: index + 1,
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
    phone: `0${Math.floor(seededRandom() * 9) + 8}${Math.floor(seededRandom() * 9) + 1}${Math.floor(seededRandom() * 10)}${Math.floor(seededRandom() * 90000000) + 10000000}`,
    course,
    regDate,
    paymentPlan,
    amountPaid: paidAmount,
    balanceRemaining: balance,
    status,
  };
});
