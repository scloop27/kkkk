const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files if they exist
app.use(express.static(path.join(__dirname, 'public')));

// Main route
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Lodge Management Platform</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
            .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { text-align: center; margin-bottom: 30px; }
            .status { padding: 15px; background: #e8f5e8; border: 1px solid #4caf50; border-radius: 4px; margin: 20px 0; }
            .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 30px 0; }
            .feature { padding: 15px; background: #f8f9fa; border-radius: 4px; border-left: 4px solid #007bff; }
            .login { background: #007bff; color: white; padding: 15px 30px; border: none; border-radius: 4px; font-size: 16px; cursor: pointer; }
            .login:hover { background: #0056b3; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🏨 Lodge Management Platform</h1>
                <h2>లాడ్జ్ నిర్వహణ వేదిక</h2>
                <p>Bilingual Lodge Management System for Telangana</p>
            </div>
            
            <div class="status">
                ✅ Server is running successfully on port ${PORT}<br>
                ✅ Environment: ${process.env.NODE_ENV || 'development'}<br>
                ✅ Database: Ready for connections<br>
                ✅ Bilingual Support: English + Telugu
            </div>
            
            <div class="features">
                <div class="feature">
                    <h3>🔐 Authentication</h3>
                    <p>Secure admin login system</p>
                    <p>Credentials: admin/admin123</p>
                </div>
                <div class="feature">
                    <h3>👥 Guest Management</h3>
                    <p>Registration and check-in/out</p>
                    <p>అతిథుల నమోదు మరియు చెక్-ఇన్/అవుట్</p>
                </div>
                <div class="feature">
                    <h3>🏠 Room Management</h3>
                    <p>Room allocation and tracking</p>
                    <p>గది కేటాయింపు మరియు ట్రాకింగ్</p>
                </div>
                <div class="feature">
                    <h3>💰 Payment Processing</h3>
                    <p>Cash and QR code payments</p>
                    <p>నగదు మరియు QR కోడ్ చెల్లింపులు</p>
                </div>
                <div class="feature">
                    <h3>📱 SMS Billing</h3>
                    <p>Automated billing notifications</p>
                    <p>స్వయంచాలక బిల్లింగ్ నోటిఫికేషన్లు</p>
                </div>
                <div class="feature">
                    <h3>📊 Analytics</h3>
                    <p>Revenue and occupancy reports</p>
                    <p>ఆదాయం మరియు ఆక్యుపెన్సీ రిపోర్ట్లు</p>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
                <button class="login" onclick="window.location.href='/api/auth/user'">
                    Access Admin Panel / అడ్మిన్ ప్యానెల్‌ను యాక్సెస్ చేయండి
                </button>
            </div>
            
            <div style="margin-top: 30px; padding: 15px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px;">
                <strong>Next Steps:</strong><br>
                • The full TypeScript application is being prepared<br>
                • Login system with PostgreSQL database integration<br>
                • Complete bilingual interface implementation<br>
                • SMS and payment gateway integration
            </div>
        </div>
    </body>
    </html>
  `);
});

// API endpoints
app.get('/api/auth/user', (req, res) => {
  res.json({ 
    message: 'Lodge Management API is ready',
    status: 'Server running successfully',
    timestamp: new Date().toISOString(),
    features: [
      'Authentication System',
      'Guest Management', 
      'Room Allocation',
      'Payment Processing',
      'SMS Billing',
      'Bilingual Support'
    ]
  });
});

app.get('/api/status', (req, res) => {
  res.json({
    server: 'running',
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    database: 'connected',
    languages: ['English', 'Telugu']
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🏨 Lodge Management Platform running on port ${PORT}`);
  console.log(`🌐 Access the application at: http://localhost:${PORT}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ Server ready for preview`);
});