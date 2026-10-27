import app from './app.js';
import { config, validateEnvironment } from './config/env.js';

validateEnvironment();

const { port } = config;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
