// app/weatherapi/route.js

export async function POST(req) {
  try {
    const { lat, lon } = await req.json();

    if (!lat || !lon) {
      return new Response(JSON.stringify({ error: "Missing latitude or longitude" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const apiKey = process.env.WEATHER_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key missing from environment" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  

    const response = await fetch(apiUrl);
  
    if (!response.ok) {
      const errText = await response.text();
      console.error("Weather API response not ok:", errText);
      return new Response(JSON.stringify({ error: "OpenWeatherMap API error", details: errText }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
   

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error", message: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}


