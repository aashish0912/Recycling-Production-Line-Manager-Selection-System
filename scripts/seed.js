import { faker } from '@faker-js/faker';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const NUM_CANDIDATES = 40;

const skillsList = [
    "Lean Manufacturing", "Six Sigma", "Waste Management",
    "ISO 14001", "Team Leadership", "Safety Protocols",
    "Supply Chain Optimization", "Predictive Maintenance"
];

const feedbackTemplates = [
    "Demonstrated excellent situational awareness during the crisis simulation. Proposed a viable 3-step containment plan.",
    "Strong knowledge of ISO 14001 but lacked specific examples of previous implementation. Good leadership potential.",
    "Clearly prioritized safety over speed, which aligns with our core values. Communication could be slightly more assertive.",
    "Impressive track record in waste reduction. Suggested a novel approach to plastic sorting that could save 15%.",
    "Response to the safety incident was immediate and thorough. However, failed to notify the plant manager in the first 15 minutes.",
    "Great motivator. The team responded well to their proposed incentive structure for shift workers.",
    "Technically proficient in predictive maintenance but struggled to articulate a clear conflict resolution strategy.",
    "Showed deep empathy for the injured worker case study. Would likely build strong team loyalty.",
    "Very process-oriented. Creating a sustainability roadmap was their strongest point.",
    "Hesitated during the emergency stop procedure simulation. Needs more training on high-pressure decision making.",
    "Outstanding grasp of circular economy principles. Clearly passionate about our mission.",
    "Proposed a very efficient shift rotation that minimizes fatigue. Shows good operational strategic thinking."
];

function generateData() {
    const candidates = [];
    const evaluations = [];
    const rankings = [];
    const sqlStatements = [];

    // Header for SQL
    sqlStatements.push(`USE recycling_hr_db;`);
    sqlStatements.push(`DELETE FROM rankings; DELETE FROM evaluations; DELETE FROM candidates;`);

    for (let i = 1; i <= NUM_CANDIDATES; i++) {
        // 1. Candidate
        const candidate = {
            id: i,
            name: faker.person.fullName(),
            email: faker.internet.email(),
            years_experience: faker.number.int({ min: 3, max: 20 }),
            skills: faker.helpers.arrayElements(skillsList, { min: 2, max: 5 }).join(', '),
            avatar: faker.image.avatar()
        };
        candidates.push(candidate);

        sqlStatements.push(
            `INSERT INTO candidates (id, name, email, years_experience, skills) VALUES (${candidate.id}, "${candidate.name}", "${candidate.email}", ${candidate.years_experience}, "${candidate.skills}");`
        );

        // 2. Evaluation
        const crisis = faker.number.int({ min: 5, max: 10 });
        const sustainability = faker.number.int({ min: 4, max: 10 });
        const motivation = faker.number.int({ min: 6, max: 10 });

        // Pick 2 random sentences for authentic feel
        const feedback = faker.helpers.arrayElements(feedbackTemplates, 2).join(' ');

        const evaluation = {
            id: i,
            candidate_id: i,
            crisis_mgmt_score: crisis,
            sustainability_score: sustainability,
            team_motivation_score: motivation,
            feedback_text: feedback
        };
        evaluations.push(evaluation);

        sqlStatements.push(
            `INSERT INTO evaluations (id, candidate_id, crisis_mgmt_score, sustainability_score, team_motivation_score, feedback_text) VALUES (${evaluation.id}, ${evaluation.candidate_id}, ${crisis}, ${sustainability}, ${motivation}, "${evaluation.feedback_text}");`
        );

        // 3. Derived Ranking (matches SQL Logic)
        const total = crisis + sustainability + motivation;
        const avg = parseFloat((total / 3).toFixed(2));

        rankings.push({
            candidate_id: i,
            total_score: total,
            average_score: avg,
            candidate_name: candidate.name, // denormalized for frontend convenience
            skills: candidate.skills
        });
    }

    // Output SQL
    const sqlPath = path.join(__dirname, '../database/dummy_data.sql');
    fs.writeFileSync(sqlPath, sqlStatements.join('\n'));
    console.log(`✅ Generated SQL data at ${sqlPath}`);

    // Output JSON for Frontend
    // We combine them into a single structure easy for React to consume
    const frontendData = candidates.map(c => {
        const ev = evaluations.find(e => e.candidate_id === c.id);
        const rk = rankings.find(r => r.candidate_id === c.id);
        return {
            ...c,
            ...ev,
            total_score: rk.total_score,
            average_score: rk.average_score
        };
    });

    const jsonPath = path.join(__dirname, '../src/data/candidates.json');

    // Ensure src/data exists
    const dataDir = path.join(__dirname, '../src/data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(jsonPath, JSON.stringify(frontendData, null, 2));
    console.log(`✅ Generated JSON data at ${jsonPath}`);
}

generateData();
