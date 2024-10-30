import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  const spaceId = process.env.SPACE_ID;
  const accessToken = process.env.ACCESS_TOKEN;

  if (!spaceId || !accessToken) {
    return NextResponse.json(
      { error: 'Missing environment variables' },
      { status: 500 }
    );
  }

  try {
    const response = await axios.get(
      `https://cdn.contentful.com/spaces/${spaceId}/entries?access_token=${accessToken}`
    );
    return NextResponse.json(response.data.items);
  } catch (error) {
    console.error('Error fetching data from Contentful:', error);
    return NextResponse.json(
      { error: 'Error fetching data from Contentful' },
      { status: 500 }
    );
  }
}
