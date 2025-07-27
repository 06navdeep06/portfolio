import { NextResponse } from 'next/server';

export async function GET() {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  
  // If no GitHub token is provided, return fallback data
  if (!GITHUB_TOKEN) {
    console.warn('GITHUB_TOKEN not found, using fallback data');
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

  try {
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
            user(login: "06navdeep06") {
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
      console.warn('GitHub API request failed, using fallback data');
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
