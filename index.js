const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { exec } = require("child_process");

const app = express();
const upload = multer({ dest: "uploads/" });

app.post("/convert", upload.single("audio"), (req, res) => {
  const inputPath = req.file.path;
  const outputPath = \`\${inputPath}.mp3\`;

  const cmd = \`ffmpeg -i \${inputPath} -y \${outputPath}\`;

  exec(cmd, (err) => {
    if (err) {
      console.error("Erro na conversão:", err);
      return res.status(500).send("Erro ao converter o arquivo.");
    }

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Disposition", "attachment; filename=converted.mp3");

    const stream = fs.createReadStream(outputPath);
    stream.pipe(res);

    stream.on("close", () => {
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(\`Servidor rodando na porta \${PORT}\`));
