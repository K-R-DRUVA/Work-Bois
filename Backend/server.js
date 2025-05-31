const express = require('express');
const multer = require('multer');
const unzipper = require('unzipper');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const app = express();
const PORT = 3000;

app.use(cors({
  origin: 'http://localhost:5173', // Vite's default port
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use('/plots', express.static(path.join(__dirname, 'uploads')));

// Configure multer to accept ZIP uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + '_' + file.originalname)
});
const upload = multer({ storage });

// Endpoint: Upload a zip file of CSVs
app.post('/upload', upload.single('folderZip'), async (req, res) => {
  const zipPath = req.file.path;

  const extractPath = path.join('uploads', path.parse(zipPath).name);

  try {
    await fs.createReadStream(zipPath)
      .pipe(unzipper.Extract({ path: extractPath }))
      .promise();

    res.status(200).json({
      message: 'Upload successful',
      extractPath: extractPath
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to extract ZIP', details: err });
  }
});

// Endpoint: Process extracted CSVs with Python
app.post('/analyze', express.json(), (req, res) => {
  const folderPath = req.body.folderPath;
  const pythonPath = path.join(__dirname, 'Analysis', 'analysis.py');

  if (!fs.existsSync(folderPath)) {
    return res.status(400).json({ error: 'Provided folder does not exist.' });
  }

  const pyProcess = spawn('python', [pythonPath, folderPath]);

  let output = '';
  let errorOutput = '';

  pyProcess.stdout.on('data', data => {
    output += data.toString(); // Should ONLY be the final JSON
  });

  pyProcess.stderr.on('data', data => {
    errorOutput += data.toString(); // Log or send this if things go wrong
    console.error('[Python STDERR]', data.toString());
  });

  pyProcess.on('close', code => {
    if (code !== 0) {
      return res.status(500).json({
        error: `Python process exited with code ${code}`,
        stderr: errorOutput
      });
    }

    try {
      const result = JSON.parse(output);
      res.json(result);
    } catch (e) {
      res.status(500).json({
        error: 'Failed to parse JSON output from Python script.',
        rawOutput: output,
        stderr: errorOutput
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
