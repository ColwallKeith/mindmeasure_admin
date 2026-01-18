// University Structure Crawler API
// Crawls university websites to extract academic structure (faculties, schools, departments)

import { VercelRequest, VercelResponse } from '@vercel/node';

interface CrawlResult {
  universityName: string;
  websiteUrl: string;
  faculties: Faculty[];
  schools: School[];
  departments: Department[];
  confidence: number;
  sourcePages: string[];
  crawledAt: string;
}

interface Faculty {
  name: string;
  shortName?: string;
  dean?: string;
  webpage?: string;
  schools: School[];
}

interface School {
  name: string;
  shortName?: string;
  head?: string;
  webpage?: string;
  departments: Department[];
}

interface Department {
  name: string;
  head?: string;
  webpage?: string;
  parentSchool?: string;
}

// Common URL patterns for UK universities
const ACADEMIC_PAGE_PATTERNS = [
  '/about/faculties',
  '/about/schools',
  '/about/departments',
  '/academic-schools',
  '/faculties-and-schools',
  '/study/departments',
  '/schools-departments',
  '/about-us/faculties',
  '/about-us/schools',
  '/about/our-schools',
  '/about/academic-schools',
  '/departments',
  '/schools',
  '/faculties'
];

// Extract base domain from URL
function getBaseDomain(url: string): string {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return parsed.origin;
  } catch {
    return `https://${url}`;
  }
}

// Fetch a page with timeout
async function fetchPage(url: string, timeout = 10000): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mind Measure Academic Structure Crawler/1.0 (https://mindmeasure.co.uk)',
        'Accept': 'text/html,application/xhtml+xml',
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) return null;
    return await response.text();
  } catch (error) {
    console.log(`Failed to fetch ${url}:`, error);
    return null;
  }
}

// Extract text content from HTML (basic extraction)
function extractTextContent(html: string): string {
  // Remove script and style tags
  let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, ' ');
  // Clean up whitespace
  text = text.replace(/\s+/g, ' ').trim();
  return text;
}

// Extract links from HTML
function extractLinks(html: string, baseUrl: string): string[] {
  const links: string[] = [];
  const linkRegex = /<a[^>]+href=["']([^"']+)["']/gi;
  let match;
  
  while ((match = linkRegex.exec(html)) !== null) {
    try {
      const href = match[1];
      if (href.startsWith('/')) {
        links.push(new URL(href, baseUrl).href);
      } else if (href.startsWith('http')) {
        links.push(href);
      }
    } catch {
      // Invalid URL, skip
    }
  }
  
  return [...new Set(links)];
}

// Parse academic structure from page content using pattern matching
function parseAcademicContent(html: string, pageUrl: string): { faculties: Faculty[], schools: School[], departments: Department[] } {
  const faculties: Faculty[] = [];
  const schools: School[] = [];
  const departments: Department[] = [];
  
  // Look for common heading patterns
  const facultyPatterns = [
    /Faculty of ([^<]+)/gi,
    /<h[23][^>]*>([^<]*Faculty[^<]*)<\/h[23]>/gi,
    /College of ([^<]+)/gi,
  ];
  
  const schoolPatterns = [
    /School of ([^<]+)/gi,
    /<h[23][^>]*>([^<]*School[^<]*)<\/h[23]>/gi,
    /Institute of ([^<]+)/gi,
  ];
  
  const deptPatterns = [
    /Department of ([^<]+)/gi,
    /<h[34][^>]*>([^<]*Department[^<]*)<\/h[34]>/gi,
  ];
  
  // Extract faculties
  for (const pattern of facultyPatterns) {
    let match;
    const regex = new RegExp(pattern.source, pattern.flags);
    while ((match = regex.exec(html)) !== null) {
      const name = match[1]?.replace(/<[^>]+>/g, '').trim();
      if (name && name.length > 2 && name.length < 100 && !faculties.some(f => f.name === name)) {
        faculties.push({
          name: name.startsWith('Faculty of ') ? name : `Faculty of ${name}`,
          schools: []
        });
      }
    }
  }
  
  // Extract schools
  for (const pattern of schoolPatterns) {
    let match;
    const regex = new RegExp(pattern.source, pattern.flags);
    while ((match = regex.exec(html)) !== null) {
      const name = match[1]?.replace(/<[^>]+>/g, '').trim();
      if (name && name.length > 2 && name.length < 100 && !schools.some(s => s.name === name)) {
        schools.push({
          name: name.startsWith('School of ') ? name : `School of ${name}`,
          departments: []
        });
      }
    }
  }
  
  // Extract departments
  for (const pattern of deptPatterns) {
    let match;
    const regex = new RegExp(pattern.source, pattern.flags);
    while ((match = regex.exec(html)) !== null) {
      const name = match[1]?.replace(/<[^>]+>/g, '').trim();
      if (name && name.length > 2 && name.length < 100 && !departments.some(d => d.name === name)) {
        departments.push({
          name: name.startsWith('Department of ') ? name : `Department of ${name}`
        });
      }
    }
  }
  
  return { faculties, schools, departments };
}

// Use Claude to intelligently parse the page content
async function parseWithAI(pageContent: string, universityUrl: string): Promise<CrawlResult | null> {
  const bedrockEndpoint = process.env.AWS_BEDROCK_ENDPOINT;
  const accessKey = process.env.AWS_ACCESS_KEY_ID;
  const secretKey = process.env.AWS_SECRET_ACCESS_KEY;
  
  if (!accessKey || !secretKey) {
    console.log('AWS credentials not configured, falling back to pattern matching');
    return null;
  }
  
  // For now, we'll use pattern matching as a fallback
  // In production, this would call Claude via Bedrock
  return null;
}

// Main crawler function
async function crawlUniversity(websiteUrl: string): Promise<CrawlResult> {
  const baseUrl = getBaseDomain(websiteUrl);
  const sourcePages: string[] = [];
  let allFaculties: Faculty[] = [];
  let allSchools: School[] = [];
  let allDepartments: Department[] = [];
  
  console.log(`Crawling university: ${baseUrl}`);
  
  // Try each academic page pattern
  for (const pattern of ACADEMIC_PAGE_PATTERNS) {
    const pageUrl = `${baseUrl}${pattern}`;
    console.log(`Trying: ${pageUrl}`);
    
    const html = await fetchPage(pageUrl);
    if (html) {
      sourcePages.push(pageUrl);
      const { faculties, schools, departments } = parseAcademicContent(html, pageUrl);
      
      // Merge results (avoid duplicates)
      for (const faculty of faculties) {
        if (!allFaculties.some(f => f.name === faculty.name)) {
          allFaculties.push(faculty);
        }
      }
      for (const school of schools) {
        if (!allSchools.some(s => s.name === school.name)) {
          allSchools.push(school);
        }
      }
      for (const dept of departments) {
        if (!allDepartments.some(d => d.name === dept.name)) {
          allDepartments.push(dept);
        }
      }
    }
  }
  
  // Also try the main about page and homepage
  const additionalPages = ['/about', '/about-us', '/'];
  for (const pattern of additionalPages) {
    const pageUrl = `${baseUrl}${pattern}`;
    const html = await fetchPage(pageUrl);
    if (html) {
      // Look for links to academic structure pages
      const links = extractLinks(html, baseUrl);
      const academicLinks = links.filter(link => 
        link.includes('school') || 
        link.includes('faculty') || 
        link.includes('department') ||
        link.includes('academic')
      ).slice(0, 5); // Limit to 5 links
      
      for (const link of academicLinks) {
        if (!sourcePages.includes(link)) {
          const subHtml = await fetchPage(link);
          if (subHtml) {
            sourcePages.push(link);
            const { faculties, schools, departments } = parseAcademicContent(subHtml, link);
            
            for (const faculty of faculties) {
              if (!allFaculties.some(f => f.name === faculty.name)) {
                allFaculties.push(faculty);
              }
            }
            for (const school of schools) {
              if (!allSchools.some(s => s.name === school.name)) {
                allSchools.push(school);
              }
            }
            for (const dept of departments) {
              if (!allDepartments.some(d => d.name === dept.name)) {
                allDepartments.push(dept);
              }
            }
          }
        }
      }
    }
  }
  
  // Try to extract university name from homepage
  let universityName = websiteUrl.replace(/^https?:\/\//, '').replace(/^www\./, '').split('.')[0];
  universityName = universityName.charAt(0).toUpperCase() + universityName.slice(1) + ' University';
  
  const homepageHtml = await fetchPage(baseUrl);
  if (homepageHtml) {
    // Try to find university name in title or h1
    const titleMatch = homepageHtml.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) {
      const title = titleMatch[1].split('|')[0].split('-')[0].trim();
      if (title.length > 3 && title.length < 100) {
        universityName = title;
      }
    }
  }
  
  // Calculate confidence based on results
  const totalItems = allFaculties.length + allSchools.length + allDepartments.length;
  let confidence = 0;
  if (totalItems > 0) {
    confidence = Math.min(0.9, 0.3 + (totalItems * 0.05) + (sourcePages.length * 0.1));
  }
  
  return {
    universityName,
    websiteUrl: baseUrl,
    faculties: allFaculties,
    schools: allSchools,
    departments: allDepartments,
    confidence,
    sourcePages,
    crawledAt: new Date().toISOString()
  };
}

// API Handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ 
      error: 'University URL is required',
      example: { url: 'worcester.ac.uk' }
    });
  }
  
  try {
    console.log(`Starting crawl for: ${url}`);
    const result = await crawlUniversity(url);
    
    return res.status(200).json({
      success: true,
      message: `Found ${result.faculties.length} faculties, ${result.schools.length} schools, ${result.departments.length} departments`,
      data: result,
      instructions: 'Review the extracted structure and use the CMS to import the approved items'
    });
    
  } catch (error: any) {
    console.error('Crawler error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to crawl university website',
      suggestion: 'The website may block automated access. Try manually reviewing the academic pages.'
    });
  }
}

