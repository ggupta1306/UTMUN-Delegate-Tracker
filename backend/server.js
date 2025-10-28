const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Google Sheets API setup
// Clean up the private key to handle different formats
let privateKey = process.env.GOOGLE_PRIVATE_KEY;
if (privateKey) {
  // Remove surrounding quotes if present
  privateKey = privateKey.replace(/^["']|["']$/g, '');
  // Replace escaped newlines with actual newlines
  privateKey = privateKey.replace(/\\n/g, '\n');
  // If no newlines found, add them (key was pasted as single line)
  if (!privateKey.includes('\n')) {
    privateKey = privateKey.replace(/-----BEGIN PRIVATE KEY-----/, '-----BEGIN PRIVATE KEY-----\n');
    privateKey = privateKey.replace(/-----END PRIVATE KEY-----/, '\n-----END PRIVATE KEY-----');
  }
}

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: privateKey,
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Store the spreadsheet ID (you'll get this from the Google Sheet URL)
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

// Endpoint to submit delegate number and get results
app.post('/api/delegate', async (req, res) => {
  try {
    const { delegateNumber, inputCell, outputRange } = req.body;

    if (!delegateNumber || !inputCell || !outputRange) {
      return res.status(400).json({ 
        error: 'Missing required parameters: delegateNumber, inputCell, outputRange' 
      });
    }

    // Step 1: Write delegate number to input cell
    console.log(`Writing ${delegateNumber} to cell ${inputCell}`);
    
    // Convert to number to ensure it's treated as numeric, not text
    const delegateValue = parseInt(delegateNumber) || delegateNumber;
    
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: inputCell,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[delegateValue]],
      },
    });

    // Step 2: Wait a bit for VLOOKUPs to calculate
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 3: Read the output range
    console.log(`Reading data from ${outputRange}`);
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: outputRange,
    });

    const values = response.data.values || [];
    
    // Parse the delegate information into a structured format
    const delegateInfo = {
      // Left column (O35:O42)
      name: values[0]?.[0] || 'N/A',
      delegation: values[1]?.[0] || 'N/A',
      experienceLevel: values[2]?.[0] || 'N/A',
      financialAid: values[3]?.[0] || 'N/A',
      accessibility: values[4]?.[0] || 'N/A',
      regPeriod: values[5]?.[0] || 'N/A',
      role: values[6]?.[0] || 'N/A',
      committee: values[7]?.[0] || 'N/A',
      // Right column (Q35:Q40)
      pronouns: values[0]?.[2] || 'N/A',
      grade: values[1]?.[2] || 'N/A',
      emergencyName: values[2]?.[2] || 'N/A',
      emergencyNumber: values[3]?.[2] || 'N/A',
      emergencyEmail: values[4]?.[2] || 'N/A',
      delegateEmail: values[5]?.[2] || 'N/A'
    };
    
    res.json({ 
      success: true,
      data: delegateInfo,
      delegateNumber: delegateNumber
    });

  } catch (error) {
    console.error('Error fetching delegate data:', error);
    res.status(500).json({ error: 'Failed to fetch delegate data from Google Sheets' });
  }
});

// Endpoint to search for delegation
app.post('/api/delegation', async (req, res) => {
  try {
    const { delegationName } = req.body;

    if (!delegationName) {
      return res.status(400).json({ 
        error: 'Missing required parameter: delegationName' 
      });
    }

    // Step 1: Write delegation name to input cell Q44:V44
    console.log(`Writing ${delegationName} to cell Q44:V44`);
    
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: "'Dash Board'!Q44:V44",
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[delegationName]],
      },
    });

    // Step 2: Wait a bit for VLOOKUPs to calculate
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 3: Read the output range O45:Q49
    console.log(`Reading data from 'Dash Board'!O45:Q49`);
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "'Dash Board'!O45:Q49",
    });

    const values = response.data.values || [];
    
    // Parse the delegation information into a structured format
    const delegationInfo = {
      // Left column (O45:O49)
      primaryContact: values[0]?.[0] || 'N/A',
      role: values[1]?.[0] || 'N/A',
      email: values[2]?.[0] || 'N/A',
      delegationName: values[3]?.[0] || 'N/A',
      address: values[4]?.[0] || 'N/A',
      // Right column (Q45:Q47)
      owner: values[0]?.[1] || 'N/A',
      totalDels: values[1]?.[1] || 'N/A',
      lS: values[2]?.[1] || 'N/A'
    };
    
    res.json({ 
      success: true,
      data: delegationInfo,
      delegationName: delegationName
    });

  } catch (error) {
    console.error('Error fetching delegation data:', error);
    res.status(500).json({ error: 'Failed to fetch delegation data from Google Sheets' });
  }
});

// Endpoint to get dashboard data
app.get('/api/dashboard', async (req, res) => {
  try {
    // Fetch all the stats
      const statsResponse = await sheets.spreadsheets.values.batchGet({
        spreadsheetId: SPREADSHEET_ID,
        ranges: [
          "'Dash Board'!I5", // Fixed: Total Registration
          "'Dash Board'!I6",
          "'Dash Board'!M5",
          "'Dash Board'!M6",
          "'Dash Board'!N1",
          "'Dash Board'!K1", // Goal (1250)
        ]
      });

    const earlyResponse = await sheets.spreadsheets.values.batchGet({
      spreadsheetId: SPREADSHEET_ID,
      ranges: [
        "'Dash Board'!D8:D9", 
        "'Dash Board'!E8:E9",
        "'Dash Board'!K8:K9", // High number and date
        "'Reg Details'!E3:E27" // Actual sparkline data
      ]
    });

    const regularResponse = await sheets.spreadsheets.values.batchGet({
      spreadsheetId: SPREADSHEET_ID,
      ranges: [
        "'Dash Board'!D11:D12", 
        "'Dash Board'!E11:E12",
        "'Dash Board'!E12:F12", // Date range for Regular
        "'Dash Board'!K11:K12", // High number and date
        "'Reg Details'!E27:E113" // Actual sparkline data
      ]
    });

    const lateResponse = await sheets.spreadsheets.values.batchGet({
      spreadsheetId: SPREADSHEET_ID,
      ranges: [
        "'Dash Board'!D14:D15", 
        "'Dash Board'!E14:E15",
        "'Dash Board'!E15:F15", // Date range for Late
        "'Reg Details'!E113:E166" // Actual sparkline data
      ]
    });

    // Get the Large to Small Delegation sparkline
    const delegationResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "'School'!AB4:AB5"
    });

    // Extract values
    const totalReg = Number(statsResponse.data.valueRanges[0]?.values?.[0]?.[0]) || 0;
    const goal = Number(statsResponse.data.valueRanges[5]?.values?.[0]?.[0]) || 1250;
    
    const stats = {
      totalRegistrations: totalReg,
      goal: goal,
      progressPercentage: goal > 0 ? ((totalReg / goal) * 100).toFixed(1) : 0,
      todaysRegistration: statsResponse.data.valueRanges[1]?.values?.[0]?.[0] || '0',
      delegatesToImport: statsResponse.data.valueRanges[2]?.values?.[0]?.[0] || '0',
      delegatesToSlot: statsResponse.data.valueRanges[3]?.values?.[0]?.[0] || '0',
      remainingCapacity: statsResponse.data.valueRanges[4]?.values?.[0]?.[0] || '0',
    };
    
    // Calculate milestones
    const milestonePercentages = [20, 40, 50, 60, 80, 90, 100];
    const milestones = milestonePercentages.map(percent => {
      const threshold = Math.floor(goal * percent / 100);
      const achieved = totalReg >= threshold;
      return {
        percent,
        threshold,
        achieved,
        name: percent === 100 ? 'Full Capacity' : `${percent}% of Goal`
      };
    });
    stats.milestones = milestones;

    const early = {
      percentage: earlyResponse.data.valueRanges[0]?.values?.[0]?.[0] || '0%',
      number: earlyResponse.data.valueRanges[0]?.values?.[1]?.[0] || '0',
      label: earlyResponse.data.valueRanges[1]?.values?.[0]?.[0] || '',
      dateRange: earlyResponse.data.valueRanges[1]?.values?.[1]?.[0] || '',
      highNumber: earlyResponse.data.valueRanges[2]?.values?.[0]?.[0] || '0',
      highDate: earlyResponse.data.valueRanges[2]?.values?.[1]?.[0] || '',
      sparklineData: earlyResponse.data.valueRanges[3]?.values?.map(row => Number(row[0]) || 0) || []
    };

    const regular = {
      percentage: regularResponse.data.valueRanges[0]?.values?.[0]?.[0] || '0%',
      number: regularResponse.data.valueRanges[0]?.values?.[1]?.[0] || '0',
      label: regularResponse.data.valueRanges[1]?.values?.[0]?.[0] || '',
      dateRange: regularResponse.data.valueRanges[2]?.values?.[0]?.join(' ') || '', // Join E12 and F12
      highNumber: regularResponse.data.valueRanges[3]?.values?.[0]?.[0] || '0',
      highDate: regularResponse.data.valueRanges[3]?.values?.[1]?.[0] || '',
      sparklineData: regularResponse.data.valueRanges[4]?.values?.map(row => Number(row[0]) || 0) || []
    };

    const late = {
      percentage: lateResponse.data.valueRanges[0]?.values?.[0]?.[0] || '0%',
      number: lateResponse.data.valueRanges[0]?.values?.[1]?.[0] || '0',
      label: lateResponse.data.valueRanges[1]?.values?.[0]?.[0] || '',
      dateRange: lateResponse.data.valueRanges[2]?.values?.[0]?.join(' ') || '', // Join E15 and F15
      sparklineData: lateResponse.data.valueRanges[3]?.values?.map(row => Number(row[0]) || 0) || []
    };

    // Extract delegation data
    const delegationData = delegationResponse.data.values?.map(row => Number(row[0]) || 0) || [];

    // Fetch quick stats (committee assignments for most popular committee)
    let quickStats = {
      averageDelegationSize: 0,
      mostPopularCommittee: 'N/A',
      financialAidPercentage: 'N/A',
      experienceLevelBreakdown: { beginner: 0, intermediate: 0, advanced: 0 }
    };
    
    // Calculate registration velocity
    let velocity = {
      avgPerDay: 0,
      trend: 'neutral',
      projectedDate: 'N/A'
    };

    try {
      // Get registration details for velocity calculation
      const regDetailsResponse = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: "'Reg Details'!D3:F100", // D=Date, E=Daily count, F=Cumulative
      });
      
      const regData = regDetailsResponse.data.values || [];
      if (regData.length > 0) {
        // Get last 7 days of daily counts (column E, index 1)
        const recentDaily = regData
          .filter(row => row[1]) // Has daily count in column E
          .slice(-7)
          .map(row => Number(row[1]) || 0);
        
        if (recentDaily.length > 0) {
          const avgPerDay = recentDaily.reduce((sum, val) => sum + val, 0) / recentDaily.length;
          velocity.avgPerDay = avgPerDay.toFixed(1);
          
          // Calculate trend (comparing last 3 days to previous 3 days)
          if (recentDaily.length >= 6) {
            const recentAvg = recentDaily.slice(-3).reduce((sum, val) => sum + val, 0) / 3;
            const previousAvg = recentDaily.slice(-6, -3).reduce((sum, val) => sum + val, 0) / 3;
            velocity.trend = recentAvg > previousAvg ? 'up' : recentAvg < previousAvg ? 'down' : 'neutral';
          }
          
          // Project completion date
          if (avgPerDay > 0) {
            const remaining = goal - totalReg;
            const daysNeeded = Math.ceil(remaining / avgPerDay);
            const today = new Date();
            const projectedDate = new Date(today.setDate(today.getDate() + daysNeeded));
            velocity.projectedDate = projectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          }
        }
      }
    } catch (err) {
      console.error('Error calculating velocity:', err);
    }

    try {
      // Get committee data to find most popular
      const committeeResponse = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: "'Dash Board'!A33:F63",
      });

      const committeeValues = committeeResponse.data.values || [];
      console.log('Committee values:', committeeValues.slice(0, 5)); // Debug first 5 rows
      
      const committees = committeeValues
        .filter(row => row[1] && row[1] !== 'COM')
        .map(row => ({
          name: row[1] || '',
          total: parseInt(row[5]) || 0
        }));
      
      console.log('Filtered committees:', committees.length, committees.slice(0, 3)); // Debug

      if (committees.length > 0 && committees.filter(c => c.total > 0).length > 0) {
        const mostPopular = committees.reduce((max, c) => c.total > max.total ? c : max);
        console.log('Most popular:', mostPopular); // Debug
        quickStats.mostPopularCommittee = mostPopular.name;
        
        // Calculate average delegation size (total delegates / number of schools)
        const totalDelegates = committees.reduce((sum, c) => sum + c.total, 0);
        quickStats.averageDelegationSize = (totalDelegates / committees.length).toFixed(1);
        
        // Calculate experience breakdown from the committee data
        const beginn = committeeValues.reduce((sum, row) => sum + (parseInt(row[2]) || 0), 0);
        const inter = committeeValues.reduce((sum, row) => sum + (parseInt(row[3]) || 0), 0);
        const adv = committeeValues.reduce((sum, row) => sum + (parseInt(row[4]) || 0), 0);
        
        quickStats.experienceLevelBreakdown = {
          beginner: beginn,
          intermediate: inter,
          advanced: adv
        };
      }
    } catch (err) {
      console.error('Error fetching quick stats:', err);
    }

    res.json({
      success: true,
      stats,
      registrations: { early, regular, late },
      delegationSparkline: delegationData,
      quickStats,
      velocity
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Endpoint to get committee assignments
app.get('/api/committees', async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "'Dash Board'!A33:F63", // Committee data (include column F for total)
    });

    const values = response.data.values || [];
    const committees = values
      .filter(row => row[1] && row[1] !== 'COM') // Skip header and empty rows
      .map(row => ({
        name: row[1] || '',
        beginner: parseInt(row[2]) || 0,
        intermediate: parseInt(row[3]) || 0,
        advanced: parseInt(row[4]) || 0,
        total: parseInt(row[5]) || 0
      }));

    res.json({ success: true, data: committees });

  } catch (error) {
    console.error('Error fetching committee data:', error);
    res.status(500).json({ error: 'Failed to fetch committee data' });
  }
});

// Endpoint to get responsibility summary
app.get('/api/responsibility', async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "'Dash Board'!N51:Q54", // Responsibility summary (fixed range)
    });

    const values = response.data.values || [];
    const summary = values
      .filter(row => row[0] && row[0] !== 'Responsibility') // Skip header
      .map(row => ({
        person: row[0] || '',
        earlyDelegates: parseInt(row[1]) || 0,
        aDelegates: parseInt(row[2]) || 0,
        delegations: parseInt(row[3]) || 0
      }));

    res.json({ success: true, data: summary });

  } catch (error) {
    console.error('Error fetching responsibility data:', error);
    res.status(500).json({ error: 'Failed to fetch responsibility data' });
  }
});

// Endpoint to get 7-day running signup data
app.get('/api/7day-signup', async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "'Reg Details'!K25:M33", // Date, Current Week, Previous Week
    });

    const values = response.data.values || [];
    const data = values.map(row => ({
      date: row[0] || '',
      currentWeek: Number(row[1]) || 0,
      previousWeek: Number(row[2]) || 0
    }));

    res.json({ success: true, data: data });

  } catch (error) {
    console.error('Error fetching 7-day signup data:', error);
    res.status(500).json({ error: 'Failed to fetch 7-day signup data' });
  }
});

// Endpoint to get registration trends for charts
app.get('/api/registration-trends', async (req, res) => {
  try {
    // Get last 100 registration entries
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "'Reg Details'!E2:G100", // Date, #/Day, SUM
    });

    const values = response.data.values || [];
    const trends = values
      .filter(row => row[0] && !isNaN(row[1]))
      .map(row => ({
        date: row[0],
        dailyCount: Number(row[1]) || 0,
        total: Number(row[2]) || 0
      }));

    res.json({ success: true, data: trends });

  } catch (error) {
    console.error('Error fetching registration trends:', error);
    res.status(500).json({ error: 'Failed to fetch registration trends' });
  }
});

// Endpoint to get year-over-year registration comparison
app.get('/api/year-comparison', async (req, res) => {
  try {
    // Fetch year comparison data from Reg Details
    const [datesResponse, currentYearResponse, previousYearResponse] = await Promise.all([
      sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: "'Reg Details'!D3:D550", // Dates
      }),
      sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: "'Reg Details'!E3:E550", // 2025-2026
      }),
      sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: "'Reg Details'!H3:H166", // 2024-2025
      })
    ]);

    const dates = datesResponse.data.values || [];
    const currentYear = currentYearResponse.data.values || [];
    const previousYear = previousYearResponse.data.values || [];

    // Combine the data, handling different lengths
    const data = dates.map((row, index) => ({
      date: row[0] || '',
      currentYear: Number(currentYear[index]?.[0]) || 0,
      previousYear: Number(previousYear[index]?.[0]) || 0
    }));

    res.json({ success: true, data: data });

  } catch (error) {
    console.error('Error fetching year comparison data:', error);
    res.status(500).json({ error: 'Failed to fetch year comparison data' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

