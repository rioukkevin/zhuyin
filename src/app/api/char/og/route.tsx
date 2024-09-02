/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";

const getTextContrastedColor = (color: string): string => {
  const hex = color.replace(/^#/, "");

  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? "#0d0d0d" : "#f0f0f0";
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // ?char=<char>
    const hasChar = searchParams.has("char");
    const char: string = hasChar
      ? searchParams.get("char")?.slice(0, 100) ?? ""
      : "My default title";

    // ?color=<title>
    const hasColor = searchParams.has("color");
    const color: string = `#${
      hasColor ? searchParams.get("color")?.slice(0, 100) ?? "" : "FFFFFF"
    }`;

    const textColor = getTextContrastedColor(color);

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: color,
          }}
        >
          <p
            style={{
              zIndex: "2",
              fontSize: 40,
              fontWeight: 700,
              textAlign: "center",
              color: textColor,
            }}
          >
            {char}
          </p>
        </div>
      ),
      {
        width: 70,
        height: 70,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
