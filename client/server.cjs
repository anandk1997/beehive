const express = require("express");
const path = require("path");
const app = express();

// Serve static files from the 'build' directory
app.use(express.static(path.join(__dirname, "dist")));

// Handle any other routes by serving the index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Start the server on port 3316
const port = 3326;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
