import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
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
      const error = await response.json();
      console.error('GitHub API Error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch repositories' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
