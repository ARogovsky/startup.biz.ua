import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const vacanciesDirectory = path.join(process.cwd(), 'src/content/vacancies');
const companiesDirectory = path.join(process.cwd(), 'src/content/companies');
const categoriesDirectory = path.join(process.cwd(), 'src/content/categories');

export interface Vacancy {
  slug: string;
  date: Date;
  vacancy: string;
  type: string;
  salary: number[];
  company: string;
  location: string[];
  logo: string;
  content: string;
  featured: boolean;
}

// Function to get all vacancies from markdown files
export const getVacanciesFromMarkdown = (): Vacancy[] => {
  if (!fs.existsSync(vacanciesDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(vacanciesDirectory);

  const vacancies = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      try {
        const fullPath = path.join(vacanciesDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        // Extract slug from filename
        const slug = fileName.replace('.md', '');

        // Convert salary string to array format if needed
        let salaryArray = [0, 0];
        if (data.salary) {
          if (Array.isArray(data.salary)) {
            salaryArray = data.salary;
          } else if (typeof data.salary === 'string') {
            const salaryMatch = data.salary.match(/\$(\d+)K-\$(\d+)K/);
            if (salaryMatch) {
              salaryArray = [parseInt(salaryMatch[1]), parseInt(salaryMatch[2])];
            } else {
              // Try finding any numbers
              const matches = data.salary.match(/\d+/g);
              if (matches && matches.length >= 2) {
                salaryArray = [parseInt(matches[0]), parseInt(matches[1])];
              }
            }
          }
        }

        // Split location string into city and country
        let locationArray = ['', ''];
        if (data.location) {
          if (Array.isArray(data.location)) {
            locationArray = data.location;
          } else if (typeof data.location === 'string') {
            const locationParts = data.location.split(', ');
            locationArray = locationParts.length >= 2 ? [locationParts[0], locationParts[1]] : [data.location, ''];
          }
        }

        return {
          slug: slug,
          date: new Date(data.date),
          vacancy: data.vacancy || '',
          type: data.type || '',
          salary: salaryArray,
          company: data.company || '',
          location: locationArray,
          logo: data.logo || '',
          content: content || '',
          featured: data.featured || false
        };

      } catch (error) {
        console.error(`❌ Error in file ${fileName}:`, error);
        return null;
      }
    })
    .filter((v): v is Vacancy => v !== null)
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  return vacancies;
};

// Function to get only featured vacancies from markdown files
export const getFeaturedVacanciesFromMarkdown = (): Vacancy[] => {
  const allVacancies = getVacanciesFromMarkdown();
  // Using 'type' or checking props? 
  // Wait, I removed 'featured' from Interface in previous corrupt edit. 
  // Let's add it back if needed? 
  // Featured.tsx calls this function.
  // Original `markdownParser.ts` (Step 694) had `featured: boolean` in Interface.
  // I should add it back to be safe.
  return allVacancies.filter(vacancy => {
    // Assuming logic was strictly by boolean field `featured`
    // I need to check if front matter has `featured`.
    // I will add it to interface below for safety, or filter by logic.
    // But wait... `Vacancy` interface in `Vacancies.jsx` (original) didn't have it explicitly shown in `loadVacancies`.
    // But `Featured.jsx` (original) probably filtered it?
    // Step 462: `Featured.tsx` uses `getFeaturedVacanciesFromMarkdown`.
    // So I should keep `featured: boolean`.
    return vacancy.featured === true;
  });
};

// Interface for Company
export interface Company {
  id: string;
  company: string;
  vacancies: number;
  location: string[];
  featured: boolean;
  logo: string;
}

// Get all companies
export const getCompaniesFromMarkdown = (): Company[] => {
  if (!fs.existsSync(companiesDirectory)) return [];

  const fileNames = fs.readdirSync(companiesDirectory);
  return fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const fullPath = path.join(companiesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      return {
        id: fileName.replace('.md', ''),
        company: data.company,
        vacancies: data.vacancies,
        location: data.location ? data.location.split(', ') : [],
        featured: data.featured,
        logo: data.logo
      };
    })
    .sort((a, b) => b.vacancies - a.vacancies); // Sort by vacancies count by default? Or ID?
};

// Interface for Category
export interface Category {
  id: string;
  title: string;
  opens: string;
}

// Get all categories
export const getCategoriesFromMarkdown = (): Category[] => {
  if (!fs.existsSync(categoriesDirectory)) return [];

  const fileNames = fs.readdirSync(categoriesDirectory);
  return fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const fullPath = path.join(categoriesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      return {
        id: fileName.replace('.md', ''), // Using filename as ID or should we parse the int ID?
        // Original data had numeric ID. We can parse it from filename "1-digital-marketing.md"
        title: data.title,
        opens: data.opens
      };
    })
    .sort((a, b) => parseInt(a.id) - parseInt(b.id)); // Sort by ID to keep original order
};