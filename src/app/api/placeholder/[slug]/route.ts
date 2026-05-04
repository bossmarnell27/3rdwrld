import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const [w, h] = (slug.replace(".svg", "").split("x").map(Number));
  const width = w || 800;
  const height = h || 600;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <rect width="100%" height="100%" fill="#111"/>
    <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle"
      fill="#333" font-family="Helvetica Neue, Arial" font-size="14"
      letter-spacing="3">3RDWRLD</text>
  </svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000",
    },
  });
}
