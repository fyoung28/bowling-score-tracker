import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import config from '../config';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { user } = useAuth();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    average: 0,
    highest: 0,
    lowest: 0,
    totalGames: 0
  });

  useEffect(() => {
    const fetchScores = async () => {
      try {
        if (!user) return;

        const token = localStorage.getItem('token');
        const response = await axios.get(`${config.apiUrl}/api/scores/user/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const sortedScores = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setScores(sortedScores);

        // Calculate statistics
        if (sortedScores.length > 0) {
          const totalScore = sortedScores.reduce((sum, score) => sum + score.totalScore, 0);
          const highestScore = Math.max(...sortedScores.map(score => score.totalScore));
          const lowestScore = Math.min(...sortedScores.map(score => score.totalScore));

          setStats({
            average: Math.round(totalScore / sortedScores.length),
            highest: highestScore,
            lowest: lowestScore,
            totalGames: sortedScores.length
          });
        }
      } catch (error) {
        console.error('Error fetching scores:', error);
        setError('Failed to load scores');
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, [user]);

  const chartData = {
    labels: scores.map(score => new Date(score.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Score',
        data: scores.map(score => score.totalScore),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Score History'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Score'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Average Score
            </Typography>
            <Typography component="p" variant="h4">
              {stats.average}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Highest Score
            </Typography>
            <Typography component="p" variant="h4">
              {stats.highest}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Lowest Score
            </Typography>
            <Typography component="p" variant="h4">
              {stats.lowest}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Total Games
            </Typography>
            <Typography component="p" variant="h4">
              {stats.totalGames}
            </Typography>
          </Paper>
        </Grid>

        {/* Score History Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Score History
            </Typography>
            {scores.length > 0 ? (
              <Box sx={{ height: 400 }}>
                <Line data={chartData} options={chartOptions} />
              </Box>
            ) : (
              <Typography variant="body1" align="center" sx={{ py: 4 }}>
                No scores recorded yet. Start by entering your first score!
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
