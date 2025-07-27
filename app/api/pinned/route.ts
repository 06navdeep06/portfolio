import { NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
  console.error('GITHUB_TOKEN is not set in environment variables');
}

export async function GET() {
  if (!GITHUB_TOKEN) {
    return NextResponse.json(
      { error: 'GitHub token not configured' },
      { status: 500 }
    );
  }

  const query = `
    query {
      user(login: "06navdeep06") {
        pinnedItems(first: 6, types: REPOSITORY) {
          nodes {
            ... on Repository {
              name
              description
              url
              stargazerCount
              languages(first: 3, orderBy: {field: SIZE, direction: DESC}) {
                nodes {
                  name
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `bearer ${GITHUB_TOKEN}`,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`GitHub API responded with status: ${response.status}`);
    }

    const { data, errors } = await response.json();

    if (errors) {
      console.error('GitHub GraphQL errors:', errors);
      return NextResponse.json(
        { error: 'Failed to fetch pinned repositories' },
        { status: 500 }
      );
    }

    const repos = data.user.pinnedItems.nodes.map((repo: any) => ({
      name: repo.name,
      description: repo.description,
      url: repo.url,
      stargazerCount: repo.stargazerCount,
      languages: repo.languages.nodes.map((lang: any) => lang.name)
    }));

    return NextResponse.json(repos);
  } catch (error) {
    console.error('Error fetching pinned repositories:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
