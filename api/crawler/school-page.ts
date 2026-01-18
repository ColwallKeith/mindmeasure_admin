// School Page Crawler API
// Crawls a specific school webpage to extract courses and head of school info

import { VercelRequest, VercelResponse } from '@vercel/node';

interface SchoolPageResult {
  schoolName: string;
  pageUrl: string;
  headOfSchool: {
    name: string | null;
    title: string | null;
    email: string | null;
    phone: string | null;
  };
  courses: Course[];
  confidence: number;
  crawledAt: string;
}

interface Course {
  name: string;
  type: 'undergraduate' | 'postgraduate' | 'foundation' | 'unknown';
  qualification: string | null; // BA, BSc, MA, etc.
}

// Fetch a page with timeout
async function fetchPage(url: string, timeout = 15000): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MindMeasure/1.0; +https://mindmeasure.co.uk)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-GB,en;q=0.9',
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

// Extract courses from page content
function extractCourses(html: string): Course[] {
  const courses: Course[] = [];
  const seenNames = new Set<string>();
  
  // Common UK degree patterns
  const degreePatterns = [
    // Full degree names like "BA (Hons) Drama"
    /\b(BA|BSc|BEng|BMus|BEd|LLB|MA|MSc|MEng|MBA|MRes|PhD|PGDip|PGCE|FdA|FdSc)\s*\(?(?:Hons?)?\)?\s+([A-Z][A-Za-z\s&,]+?)(?=\s*(?:\||<|$|\n|–|-))/gi,
    // Degree with "in" - e.g., "BSc in Psychology"
    /\b(BA|BSc|BEng|BMus|MA|MSc|PhD)\s+(?:in\s+)?([A-Z][A-Za-z\s&]+?)(?=\s*(?:\||<|$|\n|–|-))/gi,
    // Course titles in links/headings
    /<a[^>]+>([^<]*(?:Studies|Science|Arts|Design|Education|Business|Law|Psychology|Drama|Music|Film|History|English|Computing|Sport|Health|Nursing)[^<]*)<\/a>/gi,
    // List items that look like courses
    /<li[^>]*>\s*(?:<[^>]+>)*\s*([A-Z][A-Za-z\s&]+?(?:Studies|Science|Arts|Design|Education|Business|Management|Psychology))\s*(?:<|$)/gi,
  ];
  
  // Subject area patterns (for schools that list subjects rather than full degrees)
  const subjectPatterns = [
    /(?:^|\n|<li[^>]*>|<p[^>]*>|<h[2-4][^>]*>)\s*(?:<[^>]+>)*\s*(Drama|Theatre|Dance|Music|Film|Fine Art|Graphic Design|Illustration|Animation|Photography|Media|English|History|Philosophy|Sociology|Psychology|Criminology|Law|Business|Marketing|Accounting|Finance|Economics|Computing|Software|Data Science|Biology|Chemistry|Physics|Mathematics|Nursing|Midwifery|Physiotherapy|Occupational Therapy|Social Work|Education|Primary Education|Sport|Exercise Science|Geography|Environmental)/gi,
  ];
  
  // Extract full degree courses
  for (const pattern of degreePatterns) {
    let match;
    const regex = new RegExp(pattern.source, pattern.flags);
    while ((match = regex.exec(html)) !== null) {
      const qualification = match[1]?.toUpperCase();
      let name = match[2]?.replace(/<[^>]+>/g, '').trim();
      
      // Clean up the name
      if (name) {
        name = name.replace(/\s+/g, ' ').trim();
        name = name.replace(/[,;]$/, '').trim();
        
        // Skip if too short or too long
        if (name.length < 3 || name.length > 60) continue;
        
        // Skip common non-course words
        if (/^(the|and|or|with|for|our|all|more|view|find|search|apply|contact)$/i.test(name)) continue;
        
        const fullName = qualification ? `${qualification} ${name}` : name;
        
        if (!seenNames.has(fullName.toLowerCase())) {
          seenNames.add(fullName.toLowerCase());
          
          let type: Course['type'] = 'unknown';
          if (/^(BA|BSc|BEng|BMus|BEd|LLB|FdA|FdSc)/i.test(qualification || '')) {
            type = 'undergraduate';
          } else if (/^(MA|MSc|MEng|MBA|MRes|PhD|PGDip|PGCE)/i.test(qualification || '')) {
            type = 'postgraduate';
          } else if (/^Fd/i.test(qualification || '')) {
            type = 'foundation';
          }
          
          courses.push({
            name: fullName,
            type,
            qualification: qualification || null
          });
        }
      }
    }
  }
  
  // Extract subject areas (if we didn't find many full courses)
  if (courses.length < 3) {
    for (const pattern of subjectPatterns) {
      let match;
      const regex = new RegExp(pattern.source, pattern.flags);
      while ((match = regex.exec(html)) !== null) {
        const name = match[1]?.replace(/<[^>]+>/g, '').trim();
        
        if (name && name.length >= 3 && name.length <= 50) {
          if (!seenNames.has(name.toLowerCase())) {
            seenNames.add(name.toLowerCase());
            courses.push({
              name,
              type: 'unknown',
              qualification: null
            });
          }
        }
      }
    }
  }
  
  return courses;
}

// Extract head of school information
function extractHeadOfSchool(html: string): SchoolPageResult['headOfSchool'] {
  let name: string | null = null;
  let title: string | null = null;
  let email: string | null = null;
  let phone: string | null = null;
  
  // Look for leadership/staff section patterns
  const leadershipPatterns = [
    // "Head of School: Prof. Name" or "Dean: Dr. Name"
    /(?:Head of School|Head of Department|Dean|Director|School Lead(?:er)?|Principal)[:\s]+(?:<[^>]+>)*\s*((?:Prof(?:essor)?\.?|Dr\.?|Mr\.?|Ms\.?|Mrs\.?)\s*[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/gi,
    // Name with title in staff listings
    /(?:Prof(?:essor)?|Dr|Professor)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)(?:[^<]*(?:Head of School|Head of Department|Dean|Director))/gi,
    // Common structure: title then role
    /<(?:h[2-4]|strong|b)[^>]*>\s*((?:Prof(?:essor)?\.?|Dr\.?)\s*[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\s*<\/(?:h[2-4]|strong|b)>\s*(?:<[^>]+>)*\s*(?:Head of School|Dean|Director)/gi,
  ];
  
  // Email patterns
  const emailPatterns = [
    // Direct email in content
    /(?:email|e-mail|contact)[:\s]+(?:<[^>]+>)*\s*<a[^>]+href=["']mailto:([^"']+)["']/gi,
    // Any email near leadership content
    /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.ac\.uk)/gi,
  ];
  
  // Phone patterns (UK format)
  const phonePatterns = [
    /(?:tel(?:ephone)?|phone|call)[:\s]+(?:<[^>]+>)*\s*((?:\+44|0)[\s\d]{10,14})/gi,
    /((?:\+44|0)\s*\d{4}\s*\d{6})/g,
    /(01onal\d{3}\s*\d{6})/g,
  ];
  
  // Extract name
  for (const pattern of leadershipPatterns) {
    const regex = new RegExp(pattern.source, pattern.flags);
    const match = regex.exec(html);
    if (match && match[1]) {
      name = match[1].replace(/<[^>]+>/g, '').trim();
      // Extract title separately
      if (name.startsWith('Prof')) {
        title = 'Professor';
        name = name.replace(/^Prof(?:essor)?\.?\s*/i, '');
      } else if (name.startsWith('Dr')) {
        title = 'Dr';
        name = name.replace(/^Dr\.?\s*/i, '');
      }
      break;
    }
  }
  
  // Extract email (look near leadership section if possible)
  for (const pattern of emailPatterns) {
    const regex = new RegExp(pattern.source, pattern.flags);
    const match = regex.exec(html);
    if (match && match[1]) {
      // Validate it looks like a real email
      const potentialEmail = match[1].toLowerCase();
      if (potentialEmail.includes('@') && potentialEmail.endsWith('.ac.uk')) {
        // Prefer emails that might be personal (not generic like info@)
        if (!potentialEmail.startsWith('info@') && !potentialEmail.startsWith('admissions@')) {
          email = potentialEmail;
          break;
        } else if (!email) {
          email = potentialEmail;
        }
      }
    }
  }
  
  // Extract phone
  for (const pattern of phonePatterns) {
    const regex = new RegExp(pattern.source, pattern.flags);
    const match = regex.exec(html);
    if (match && match[1]) {
      phone = match[1].replace(/\s+/g, ' ').trim();
      break;
    }
  }
  
  return { name, title, email, phone };
}

// Try to find related pages (staff page, courses page)
function findRelatedPages(html: string, baseUrl: string): string[] {
  const relatedPages: string[] = [];
  
  // Look for links to staff, courses, about pages
  const linkPatterns = [
    /href=["']([^"']*(?:staff|team|people|about)[^"']*)["']/gi,
    /href=["']([^"']*(?:course|programme|study|undergraduate|postgraduate)[^"']*)["']/gi,
  ];
  
  for (const pattern of linkPatterns) {
    let match;
    const regex = new RegExp(pattern.source, pattern.flags);
    while ((match = regex.exec(html)) !== null && relatedPages.length < 5) {
      try {
        const href = match[1];
        if (href.startsWith('/')) {
          relatedPages.push(new URL(href, baseUrl).href);
        } else if (href.startsWith('http') && href.includes(new URL(baseUrl).hostname)) {
          relatedPages.push(href);
        }
      } catch {
        // Invalid URL, skip
      }
    }
  }
  
  return [...new Set(relatedPages)];
}

// Main crawler function
async function crawlSchoolPage(pageUrl: string, schoolName: string): Promise<SchoolPageResult> {
  console.log(`Crawling school page: ${pageUrl}`);
  
  let allCourses: Course[] = [];
  let headOfSchool: SchoolPageResult['headOfSchool'] = { name: null, title: null, email: null, phone: null };
  
  // Fetch main page
  const mainHtml = await fetchPage(pageUrl);
  
  if (mainHtml) {
    // Extract from main page
    allCourses = extractCourses(mainHtml);
    headOfSchool = extractHeadOfSchool(mainHtml);
    
    // If we didn't find enough data, try related pages
    if (allCourses.length < 3 || !headOfSchool.name) {
      const relatedPages = findRelatedPages(mainHtml, pageUrl);
      
      for (const relatedUrl of relatedPages.slice(0, 3)) {
        console.log(`Checking related page: ${relatedUrl}`);
        const relatedHtml = await fetchPage(relatedUrl);
        
        if (relatedHtml) {
          // Get more courses
          if (allCourses.length < 10) {
            const moreCourses = extractCourses(relatedHtml);
            for (const course of moreCourses) {
              if (!allCourses.some(c => c.name.toLowerCase() === course.name.toLowerCase())) {
                allCourses.push(course);
              }
            }
          }
          
          // Get head of school if not found
          if (!headOfSchool.name) {
            const moreHead = extractHeadOfSchool(relatedHtml);
            if (moreHead.name) {
              headOfSchool = moreHead;
            }
          }
        }
      }
    }
  }
  
  // Calculate confidence
  let confidence = 0.3;
  if (allCourses.length > 0) confidence += 0.2;
  if (allCourses.length > 5) confidence += 0.1;
  if (headOfSchool.name) confidence += 0.2;
  if (headOfSchool.email) confidence += 0.1;
  if (headOfSchool.phone) confidence += 0.1;
  
  return {
    schoolName,
    pageUrl,
    headOfSchool,
    courses: allCourses,
    confidence: Math.min(confidence, 0.95),
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
  
  const { url, schoolName } = req.body;
  
  if (!url) {
    return res.status(400).json({ 
      error: 'School page URL is required',
      example: { url: 'https://www.worcester.ac.uk/about/academic-schools/school-of-arts/', schoolName: 'School of Arts' }
    });
  }
  
  try {
    console.log(`Starting school page crawl for: ${url}`);
    const result = await crawlSchoolPage(url, schoolName || 'Unknown School');
    
    return res.status(200).json({
      success: true,
      message: `Found ${result.courses.length} courses${result.headOfSchool.name ? ` and Head of School: ${result.headOfSchool.name}` : ''}`,
      data: result
    });
    
  } catch (error: any) {
    console.error('School page crawler error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to crawl school page'
    });
  }
}

