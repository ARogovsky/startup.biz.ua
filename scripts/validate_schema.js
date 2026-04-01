const https = require('https');
const fs = require('fs');
const path = require('path');

// Load environment variables manually since we don't have dotenv
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
}

const AIRTABLE_PAT = process.env.AIRTABLE_PAT;
const BASE_ID = 'appq7XTTpNAcIyX4C';

// Define expected schema
const SCHEMA = {
    VACANCIES: {
        id: 'tbl0pu4l404KAA4wK',
        name: 'Vacancies',
        fields: ['Slug', 'Vacancy', 'Date', 'Type', 'Salary', 'Company', 'Location', 'Logo', 'Content', 'Featured']
    },
    COMPANIES: {
        id: 'tblvGcoYMmokSRB28',
        name: 'Companies',
        fields: ['Name', 'Location', 'Featured', 'Logo']
    },
    CATEGORIES: {
        id: 'tblrYr8IplG9wBcD5',
        name: 'Categories',
        fields: ['Title', 'Slug', 'Opens']
    },
    STUDENTS: {
        id: 'tblRZjbSbikXQl2QZ',
        name: 'Students',
        fields: ['Name']
    }
};

if (!AIRTABLE_PAT) {
    console.error("❌ Missing AIRTABLE_PAT environment variable. Please check .env.local");
    process.exit(1);
}

const headers = {
    'Authorization': `Bearer ${AIRTABLE_PAT}`,
    'Content-Type': 'application/json'
};

function request(path) {
    return new Promise((resolve, reject) => {
        const req = https.request({
            hostname: 'api.airtable.com',
            path: `/v0/${BASE_ID}/${path}`,
            headers,
            method: 'GET'
        }, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(json);
                    } else {
                        reject({ status: res.statusCode, ...json });
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });
        req.on('error', reject);
        req.end();
    });
}

async function validateTable(tableConfig) {
    console.log(`\n🔍 Checking table: ${tableConfig.name} (${tableConfig.id})...`);
    try {
        // Fetch one record to check fields
        const data = await request(`${tableConfig.id}?maxRecords=1`);

        if (!data.records || data.records.length === 0) {
            console.warn(`⚠️  Table ${tableConfig.name} is accessible but empty. Cannot validate fields.`);
            return true;
        }

        const record = data.records[0];
        const existingFields = Object.keys(record.fields);
        const missingFields = tableConfig.fields.filter(f => !existingFields.includes(f));

        if (missingFields.length > 0) {
            // Note: Airtable API doesn't return empty fields. 
            // So if a field is missing in the response, it MIGHT exist but be empty in this specific record.
            // A more robust check would be metadata API, but that requires different permissions.
            // For now, we verify what we can see.
            // We'll warn instead of fail for potentially empty optional fields, but critical ones usually have data.
            console.warn(`⚠️  The following fields were not found in the sample record (they might be empty): ${missingFields.join(', ')}`);
        } else {
            console.log(`✅  All expected fields found in sample record.`);
        }
        return true;

    } catch (err) {
        if (err.status === 404) {
            console.error(`❌  Table ${tableConfig.name} not found (404)! Check Table ID.`);
        } else if (err.status === 403) {
            console.error(`❌  Access denied to table ${tableConfig.name} (403). Check permissions.`);
        } else {
            console.error(`❌  Error accessing table ${tableConfig.name}:`, err);
        }
        return false;
    }
}

async function run() {
    console.log("🚀 Starting Airtable Schema Validation...");

    let allValid = true;
    for (const key in SCHEMA) {
        const valid = await validateTable(SCHEMA[key]);
        if (!valid) allValid = false;
    }

    if (allValid) {
        console.log("\n✅ Integration tests passed. Schema appears accessible.");
    } else {
        console.error("\n❌ Integration tests failed. Please review errors above.");
        process.exit(1);
    }
}

run();
