
import { getProjects } from '../src/lib/projects';

console.log('Verifying Project Logic...');

try {
    const projects = getProjects();
    console.log(`Found ${projects.length} projects.`);

    const quadrantCounts: Record<string, number> = {
        'Quick Wins': 0,
        'Big Bets': 0,
        'Fillers': 0,
        'Time Sinks': 0,
    };

    projects.forEach(p => {
        console.log(`\nProject: ${p.title} (${p.id})`);
        console.log(`  Raw Scores - Value: ${p.scores.strategic_value}, Complexity: ${p.scores.complexity}`);
        console.log(`  Normalized - Impact: ${p.normalized_scores.impact}, Effort: ${p.normalized_scores.effort}`);
        console.log(`  Quadrant: ${p.quadrant}`);

        if (quadrantCounts[p.quadrant] !== undefined) {
             quadrantCounts[p.quadrant]++;
        } else {
            console.error(`  ERROR: Invalid Quadrant ${p.quadrant}`);
        }

        // Verification Logic
        const impact = p.scores.strategic_value * 10;
        const effort = p.scores.complexity * 10;
        let expectedQuadrant = '';

        if (impact >= 50) {
            if (effort < 50) expectedQuadrant = 'Quick Wins';
            else expectedQuadrant = 'Big Bets';
        } else {
            if (effort < 50) expectedQuadrant = 'Fillers';
            else expectedQuadrant = 'Time Sinks';
        }

        if (p.quadrant !== expectedQuadrant) {
             console.error(`  FAIL: Expected ${expectedQuadrant}, got ${p.quadrant}`);
        } else {
             console.log(`  PASS: Quadrant assignment correct.`);
        }
    });

    console.log('\nQuadrant Distribution:', quadrantCounts);

    if (projects.length === 0) {
        console.error('FAIL: No projects found.');
        process.exit(1);
    }
    
    console.log('\nVerification Complete.');

} catch (error) {
    console.error('Error running verification:', error);
    process.exit(1);
}
