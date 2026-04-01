const AIRTABLE_PAT = process.env.AIRTABLE_PAT;
const BASE_ID = 'appq7XTTpNAcIyX4C';

const TABLE_IDS = {
    VACANCIES: 'tbl0pu4l404KAA4wK',
    COMPANIES: 'tblvGcoYMmokSRB28',
    CATEGORIES: 'tblrYr8IplG9wBcD5',
    STUDENTS: 'tblRZjbSbikXQl2QZ'
};

if (!AIRTABLE_PAT) {
    console.error("Missing AIRTABLE_PAT environment variable");
}

const headers = {
    'Authorization': `Bearer ${AIRTABLE_PAT}`,
    'Content-Type': 'application/json'
};


interface AirtableRecord {
    id: string;
    fields: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface Vacancy {
    id: string;
    slug: string;
    date: Date;
    vacancy: string; // title
    type: string;
    salary: number[];
    company: string;
    location: string[];
    logo: string;
    content: string;
    featured: boolean;
    companyId?: string;
}

export interface Company {
    id: string;
    company: string;
    vacancies: number;
    location: string[];
    featured: boolean;
    logo: string;
}

export interface Category {
    id: string;
    title: string;
    slug: string;
    opens: string;
}

export interface Student {
    id: string;
    name: string;
}


async function fetchAllRecords(tableId: string): Promise<AirtableRecord[]> {
    const records: AirtableRecord[] = [];
    let offset: string | undefined = undefined;

    do {
        const url = `https://api.airtable.com/v0/${BASE_ID}/${tableId}`;
        const params = new URLSearchParams();
        if (offset) params.set('offset', offset!);

        const res = await fetch(`${url}?${params.toString()}`, { headers, next: { revalidate: 60 } });
        if (!res.ok) {
            console.error(`Airtable fetch failed: ${res.statusText}`);
            return [];
        }
        const data = await res.json();
        records.push(...data.records);
        offset = data.offset;
    } while (offset);

    return records;
}

function parseSalary(salaryStr: string | undefined): number[] {
    if (!salaryStr) return [0, 0];
    // Expected format: "$200-$500" or similar
    // Using simple regex to extract numbers
    const matches = salaryStr.match(/\d+/g);
    if (!matches) return [0, 0];
    if (matches.length >= 2) {
        return [parseInt(matches[0]), parseInt(matches[1])];
    }
    const val = parseInt(matches[0]);
    return [val, val];
}

function parseLocation(locStr: string | undefined): string[] {
    if (!locStr) return ["", ""];
    if (locStr.includes(',')) {
        return locStr.split(',').map(s => s.trim());
    }
    return [locStr, ""];
}

export async function getVacancies(): Promise<Vacancy[]> {
    const records = await fetchAllRecords(TABLE_IDS.VACANCIES);
    const rawCompanies = await fetchAllRecords(TABLE_IDS.COMPANIES);
    const companyMap = new Map(rawCompanies.map(c => [c.id, c.fields.Name]));

    return records.map(r => {
        const f = r.fields;
        const companyId = f.Company && Array.isArray(f.Company) && f.Company[0] ? f.Company[0] : null;

        return {
            id: r.id,
            slug: f.Slug || '',
            date: f.Date ? new Date(f.Date) : new Date(),
            vacancy: f.Vacancy || '',
            type: f.Type || '',
            salary: parseSalary(f.Salary),
            company: companyId ? companyMap.get(companyId) || 'Unknown' : 'Unknown',
            location: parseLocation(f.Location),
            logo: f.Logo || '',
            content: f.Content || '',
            featured: f.Featured || false,
            companyId: companyId || undefined
        };
    });
}

export async function getVacancy(slug: string): Promise<Vacancy | null> {
    const records = await fetchAllRecords(TABLE_IDS.VACANCIES);
    const vacancyRecord = records.find(r => r.fields.Slug === slug || r.id === slug); // Fallback to ID if needed

    if (!vacancyRecord) return null;

    const rawCompanies = await fetchAllRecords(TABLE_IDS.COMPANIES);
    const companyMap = new Map(rawCompanies.map(c => [c.id, c.fields.Name]));

    const f = vacancyRecord.fields;
    const companyId = f.Company && Array.isArray(f.Company) && f.Company[0] ? f.Company[0] : null;

    return {
        id: vacancyRecord.id,
        slug: f.Slug || '',
        date: f.Date ? new Date(f.Date) : new Date(),
        vacancy: f.Vacancy || '',
        type: f.Type || '',
        salary: parseSalary(f.Salary),
        company: companyId ? companyMap.get(companyId) || 'Unknown' : 'Unknown',
        location: parseLocation(f.Location),
        logo: f.Logo || '',
        content: f.Content || '',
        featured: f.Featured || false,
        companyId: companyId || undefined
    };
}

export async function getVacancySlugs(): Promise<string[]> {
    const records = await fetchAllRecords(TABLE_IDS.VACANCIES);
    return records.map(r => r.fields.Slug || r.id);
}

export async function getCompanies(): Promise<Company[]> {
    const records = await fetchAllRecords(TABLE_IDS.COMPANIES);
    const vacancyRecords = await fetchAllRecords(TABLE_IDS.VACANCIES);

    const counts = new Map<string, number>();
    vacancyRecords.forEach(v => {
        const cIds = v.fields.Company;
        if (cIds && Array.isArray(cIds)) {
            cIds.forEach((id: string) => {
                counts.set(id, (counts.get(id) || 0) + 1);
            });
        }
    });

    return records.map(r => ({
        id: r.id,
        company: r.fields.Name || '',
        // slug: r.fields.Slug || '', // Company interface didn't have slug in markdownParser, but Airtable has it. Keeping it logic internal or strict? 
        // markdownParser Company interface: id, company, vacancies, location, featured, logo.
        // It uses ID as filename (slug). So ID is slug effectively.
        // Airtable ID is recXXX. We should probably use Slug as user-facing ID if components rely on it for links? 
        // markdownParser: id = fileName (slug).
        // Let's verify usage of ID. `Companies.tsx`: map(e => key={e.id}).
        // If we change ID to recXXX, keys change. It's fine.
        location: parseLocation(r.fields.Location),
        logo: r.fields.Logo || '',
        featured: r.fields.Featured || false,
        vacancies: counts.get(r.id) || 0
    }));
}

export async function getCategories(): Promise<Category[]> {
    const records = await fetchAllRecords(TABLE_IDS.CATEGORIES);
    return records.map(record => ({
        id: record.id,
        title: record.fields.Title as string,
        slug: record.fields.Slug as string,
        opens: record.fields.Opens as string
    }));
}

export async function getStudents(): Promise<Student[]> {
    const records = await fetchAllRecords(TABLE_IDS.STUDENTS);
    return records.map(record => ({
        id: record.id,
        name: record.fields.Name as string,
    }));
}
