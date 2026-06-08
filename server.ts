import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Google Drive proxy audio endpoint bypassing same-origin, third-party cookies, and content-disposition restrictions
  app.get("/api/proxy-audio", async (req, res) => {
    const { id } = req.query;
    if (!id || typeof id !== "string") {
      return res.status(400).send("Falta el ID del archivo de Google Drive");
    }

    const driveUrl = `https://docs.google.com/uc?export=download&id=${id}`;

    try {
      const response = await fetch(driveUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
        }
      });

      if (!response.ok) {
        return res.status(response.status).send(`Error de Google Drive: ${response.statusText}`);
      }

      // Read output content-type (usually audio/mpeg or audio/ogg) and proxy it inline
      const contentType = response.headers.get("content-type") || "audio/mpeg";
      res.setHeader("Content-Type", contentType);
      res.setHeader("Content-Disposition", "inline");
      res.setHeader("Cache-Control", "public, max-age=86400");

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      res.send(buffer);
    } catch (error: any) {
      console.error("Error proxying Google Drive sound:", error);
      res.status(500).send(`Error de conexión proxy: ${error.message}`);
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
