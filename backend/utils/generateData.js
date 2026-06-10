const fs = require('fs');
const path = require('path');

const firstNamesMale = ["Aarav", "Vihaan", "Aditya", "Sai", "Arjun", "Rohan", "Kabir", "Aryan", "Ishaan", "Dhruv"];
const firstNamesFemale = ["Ananya", "Diya", "Aditi", "Priya", "Kavya", "Sanya", "Isha", "Neha", "Riya", "Meera"];
const lastNames = ["Sharma", "Patel", "Singh", "Gupta", "Kumar", "Desai", "Verma", "Jain", "Reddy", "Rao"];
const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune", "Kolkata"];
const degrees = ["B.Tech", "MBA", "M.Sc", "B.Com", "B.A", "M.Tech"];
const colleges = ["IIT", "NIT", "Delhi University", "BITS", "Symbiosis"];
const designations = ["Software Engineer", "Product Manager", "Data Analyst", "Consultant", "Marketing Manager", "Entrepreneur"];
const companies = ["Google", "Microsoft", "TCS", "Infosys", "Startup", "Amazon", "Deloitte"];

const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateProfile = (id, gender) => {
  const firstName = gender === 'Male' ? randomChoice(firstNamesMale) : randomChoice(firstNamesFemale);
  return {
    id: id.toString(),
    firstName,
    lastName: randomChoice(lastNames),
    gender,
    dateOfBirth: new Date(randomInt(1985, 2000), randomInt(0, 11), randomInt(1, 28)).toISOString().split('T')[0],
    country: "India",
    city: randomChoice(cities),
    height: randomInt(150, 190), // in cm
    email: `${firstName.toLowerCase()}.${randomInt(100,999)}@example.com`,
    phoneNumber: `+919${randomInt(100000000, 999999999)}`,
    undergraduateCollege: randomChoice(colleges),
    degree: randomChoice(degrees),
    income: randomInt(5, 50) * 100000, // in INR
    currentCompany: randomChoice(companies),
    designation: randomChoice(designations),
    maritalStatus: randomChoice(["Never Married", "Divorced", "Widowed"]),
    languagesKnown: ["English", "Hindi", randomChoice(["Marathi", "Tamil", "Telugu", "Gujarati", "Bengali"])],
    siblings: randomInt(0, 3),
    caste: randomChoice(["Brahmin", "Kshatriya", "Vaishya", "Any"]),
    religion: "Hindu", // Simplified for MVP
    wantKids: randomChoice(["Yes", "No", "Maybe"]),
    openToRelocate: randomChoice(["Yes", "No", "Maybe"]),
    openToPets: randomChoice(["Yes", "No", "Maybe"]),
    assignedMatchmakerId: 1 // For demo purposes, all assigned to admin
  };
};

const profiles = [];
// Generate 50 males and 50 females
for (let i = 1; i <= 50; i++) profiles.push(generateProfile(i, 'Male'));
for (let i = 51; i <= 100; i++) profiles.push(generateProfile(i, 'Female'));

fs.writeFileSync(path.join(__dirname, '../data/profiles.json'), JSON.stringify(profiles, null, 2));
console.log('Successfully generated 100 mock profiles in data/profiles.json');
