import { NextResponse } from 'next/server';

// Sample data to use as fallback
const FALLBACK_DATA = {
  data: {
    user: {
      pinnedItems: {
        nodes: [
          {
            id: '1',
            name: 'portfolio',
            description: 'My personal portfolio website built with Next.js and TypeScript',
            url: 'https://github.com/06navdeep06/portfolio',
            primaryLanguage: { name: 'TypeScript', color: '#3178C6' },
            stargazerCount: 5,
            forkCount: 2
          },
          {
            id: '2',
            name: 'react-todo-app',
            description: 'A modern todo application built with React and local storage',
            url: 'https://github.com/06navdeep06/react-todo-app',
            primaryLanguage: { name: 'JavaScript', color: '#F7DF1E' },
            stargazerCount: 3,
            forkCount: 1
          },
          {
            id: '3',
            name: 'node-api-server',
            description: 'RESTful API server built with Node.js and Express',
            url: 'https://github.com/06navdeep06/node-api-server',
            primaryLanguage: { name: 'JavaScript', color: '#F7DF1E' },
            stargazerCount: 2,
            forkCount: 0
          },
          {
            id: '4',
            name: 'skill-chart',
            description: 'Interactive skill chart visualization',
            url: 'https://github.com/06navdeep06/skill-chart',
            primaryLanguage: { name: 'TypeScript', color: '#3178C6' },
            stargazerCount: 4,
            forkCount: 1
          },
          {
            id: '5',
            name: 'ai-project',
            description: 'Machine learning project with Python',
            url: 'https://github.com/06navdeep06/ai-project',
            primaryLanguage: { name: 'Python', color: '#3572A5' },
            stargazerCount: 8,
            forkCount: 3
          },
          {
            id: '6',
            name: 'mobile-app',
            description: 'Cross-platform mobile application',
            url: 'https://github.com/06navdeep06/mobile-app',
            primaryLanguage: { name: 'Dart', color: '#00B4AB' },
            stargazerCount: 6,
            forkCount: 2
          }
        ]
      }
    }
  }
};

export async function GET() {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const USERNAME = '06navdeep06';
  
  console.log('GitHub API Request - Environment:', {
    NODE_ENV: process.env.NODE_ENV,
    GITHUB_TOKEN: GITHUB_TOKEN ? 'Set' : 'Not Set',
    Username: USERNAME
  });
  
  // If in development or no token, return fallback data
  if (process.env.NODE_ENV !== 'production' || !GITHUB_TOKEN) {
    const reason = !GITHUB_TOKEN ? 'GITHUB_TOKEN not found' : 'Development mode';
    console.warn(`${reason}, using fallback data`);
    return NextResponse.json(FALLBACK_DATA);
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
              pinnedItems(first: 6, types: [REPOSITORY]) {
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
      return NextResponse.json({
        data: {
          user: {
            pinnedItems: {
              nodes: [
                {
                  id: '1',
                  name: 'portfolio',
                  description: 'My personal portfolio website built with Next.js and TypeScript',
                  url: 'https://github.com/06navdeep06/portfolio',
                  primaryLanguage: { name: 'TypeScript', color: '#3178C6' },
                  stargazerCount: 5,
                  forkCount: 2
                },
                {
                  id: '2',
                  name: 'react-todo-app',
                  description: 'A modern todo application built with React and local storage',
                  url: 'https://github.com/06navdeep06/react-todo-app',
                  primaryLanguage: { name: 'JavaScript', color: '#F7DF1E' },
                  stargazerCount: 3,
                  forkCount: 1
                },
                {
                  id: '3',
                  name: 'node-api-server',
                  description: 'RESTful API server built with Node.js and Express',
                  url: 'https://github.com/06navdeep06/node-api-server',
                  primaryLanguage: { name: 'JavaScript', color: '#F7DF1E' },
                  stargazerCount: 2,
                  forkCount: 0
                }
              ]
            }
          }
        }
      });
    }

    const data = await response.json();
    
    if (data.errors) {
      console.error('GitHub GraphQL errors:', data.errors);
      throw new Error('GraphQL errors in response');
    }
    
    console.log('Successfully fetched repositories:', {
      count: data?.data?.user?.pinnedItems?.nodes?.length || 0
    });
    
    return NextResponse.json(data);
  } catch (error) {
    console.warn('Error fetching repositories, using fallback data:', error);
    return NextResponse.json({
      data: {
        user: {
          pinnedItems: {
            nodes: [
              {
                id: '1',
                name: 'portfolio',
                description: 'My personal portfolio website built with Next.js and TypeScript',
                url: 'https://github.com/06navdeep06/portfolio',
                primaryLanguage: { name: 'TypeScript', color: '#3178C6' },
                stargazerCount: 5,
                forkCount: 2
              },
              {
                id: '2',
                name: 'react-todo-app',
                description: 'A modern todo application built with React and local storage',
                url: 'https://github.com/06navdeep06/react-todo-app',
                primaryLanguage: { name: 'JavaScript', color: '#F7DF1E' },
                stargazerCount: 3,
                forkCount: 1
              }
            ]
          }
        }
      }
    });
  }
}
