require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { getAddressData } = require('./scraper');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Zola Scraper API',
    endpoints: {
      '/api/scrape': 'POST - Scrape data for an address'
    }
  });
});

app.post('/api/scrape', async (req, res) => {
  try {
    const { address } = req.body;
    if (!address) {
      return res.status(400).json({
        success: false,
        error: 'Address is required',
        data: null
      });
    }
    
    const result = await getAddressData(address);
    
    if (!result.success) {
      return res.status(404).json(result);
    }
    
    return res.json(result);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      data: null
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 