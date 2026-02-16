import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { z } from 'zod';

const projectsDirectory = path.join(process.cwd(), '_content/projects');

// Zod Schema for Project Frontmatter
const ProjectSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  owner: z.string(),
  department: z.string(),
  phase: z.string(),
  status: z.enum(['Backlog', 'Queued', 'Active', 'Paused', 'Complete', 'At Risk', 'On Hold']),
  dates: z.object({
    planned_start: z.string(),
    planned_end: z.string(),
    actual_start: z.string().optional(),
  }),
  scores: z.object({
    strategic_value: z.number(),
    complexity: z.number(),
  }),
  financials: z.object({
    estimated_cost: z.number(), 
    projected_roi: z.number(),
  }).optional(),
  tags: z.array(z.string()).optional(),
  related_projects: z.array(z.string()).optional(),
});

export type Project = z.infer<typeof ProjectSchema> & {
    content: string;
    normalized_scores: {
        impact: number;
        effort: number;
    };
    quadrant: 'Quick Wins' | 'Big Bets' | 'Fillers' | 'Time Sinks';
};

export function getProjects(): Project[] {
  // 1. Get file names under /_content/projects
  if (!fs.existsSync(projectsDirectory)) {
      return [];
  }
  const fileNames = fs.readdirSync(projectsDirectory);
  const allProjectsData = fileNames.filter(fileName => fileName.endsWith('.md')).map((fileName) => {
    // 2. Read markdown file as string
    const fullPath = path.join(projectsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // 3. Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // 4. Validate with Zod
    const parsedData = ProjectSchema.safeParse(matterResult.data);
    
    if (!parsedData.success) {
        console.error(`Validation error in ${fileName}:`, parsedData.error);
        return null;
    }

    const data = parsedData.data;

    // 5. Transformation Logic
    // Normalize scores (0-10 -> 0-100)
    // Impact = strategic_value * 10
    // Effort = complexity * 10
    const impact = data.scores.strategic_value * 10;
    const effort = data.scores.complexity * 10;

    // Assign Quadrant
    // Quick Wins: High Impact (>= 50), Low Effort (< 50)
    // Big Bets: High Impact (>= 50), High Effort (>= 50)
    // Fillers: Low Impact (< 50), Low Effort (< 50)
    // Time Sinks: Low Impact (< 50), High Effort (>= 50)
    let quadrant: Project['quadrant'];
    if (impact >= 50) {
        if (effort < 50) {
            quadrant = 'Quick Wins';
        } else {
            quadrant = 'Big Bets';
        }
    } else {
        if (effort < 50) {
            quadrant = 'Fillers';
        } else {
            quadrant = 'Time Sinks';
        }
    }

    return {
      ...data,
      content: matterResult.content,
      normalized_scores: {
          impact,
          effort,
      },
      quadrant,
    };
  });

  // Filter out any nulls from validation errors
  return allProjectsData.filter((p): p is Project => p !== null);
}
