import { NextResponse } from 'next/server';

// Type definitions for GitHub API response
type Repository = {
  id: string;
  name: string;
  description: string | null;
  url: string;
  primaryLanguage: {
    name: string;
    color: string;
  } | null;
  stargazerCount: number;
  forkCount: number;
};

type GitHubResponse = {
  data?: {
    user?: {
      pinnedItems?: {
        nodes?: Repository[];
      };
    };
  };
};

// We don't use fallback data anymore - only return real data or empty array

export async function GET() {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const USERNAME = '06navdeep06';
  
  // Check for required environment variables
  if (!GITHUB_TOKEN) {
    console.error('GitHub token is not configured');
    return NextResponse.json(
      { error: 'GitHub token is not configured' },
      { status: 500 }
    );
  }

  try {
    console.log('Fetching pinned repositories from GitHub API...');
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'User-Agent': 'portfolio-app'
      },
      body: JSON.stringify({
        query: `
          query {
            user(login: "${USERNAME}") {
              pinnedItems(first: 6, types: REPOSITORY) {
                totalCount
                nodes {
                  ... on Repository {
                    id
                    name
                    description
                    url
                    primaryLanguage {
                      name
                      color
                    }
                    stargazerCount
                    forkCount
                  }
                }
              }
            }
          }
        `
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('GitHub API request failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`GitHub API request failed with status ${response.status}`);
    }

    const data: GitHubResponse = await response.json();
    
    // Log the response for debugging
    console.log('GitHub API Response:', JSON.stringify({
      hasData: !!data?.data,
      hasUser: !!data?.data?.user,
      hasPinnedItems: !!data?.data?.user?.pinnedItems,
      repoCount: data?.data?.user?.pinnedItems?.nodes?.length || 0,
      firstRepo: data?.data?.user?.pinnedItems?.nodes?.[0] || null
    }, null, 2));
    
    // Return the repositories or empty array if none found
    const repos = data?.data?.user?.pinnedItems?.nodes || [];
    console.log(`Found ${repos.length} pinned repositories`);
    
    // Return a simplified response that matches our frontend expectations
    return NextResponse.json({ 
      data: { 
        user: { 
          pinnedItems: { 
            nodes: repos 
          } 
        } 
      },
      success: true,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error);
    
    // Return empty array on error
    console.error('Error fetching pinned repositories:', error);
    return NextResponse.json(
      { 
        data: { 
          user: { 
            pinnedItems: { 
              nodes: [] 
            } 
          } 
        },
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
