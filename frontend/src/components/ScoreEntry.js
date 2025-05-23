import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Box,
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ScoreEntry = () => {
  const { user } = useAuth();
  const [frames, setFrames] = useState(Array(10).fill({ roll1: '', roll2: '', roll3: '' }));
  const [currentFrame, setCurrentFrame] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [error, setError] = useState('');

  const isStrike = (frame) => frame.roll1 === '10';
  const isSpare = (frame) => !isStrike(frame) && (parseInt(frame.roll1) + parseInt(frame.roll2) === 10);

  const calculateFrameScore = (frameIndex) => {
    let score = 0;
    const frame = frames[frameIndex];
    
    // Basic score for the frame
    score += (parseInt(frame.roll1) || 0) + (parseInt(frame.roll2) || 0);
    
    // Add third roll for 10th frame if needed
    if (frameIndex === 9) {
      score += parseInt(frame.roll3) || 0;
    }
    
    // Add bonus for strikes and spares
    if (frameIndex < 9) {
      if (isStrike(frame)) {
        // Strike bonus: next two rolls
        const nextFrame = frames[frameIndex + 1];
        if (isStrike(nextFrame)) {
          // If next frame is also a strike, we need the first roll of the frame after that
          score += 10 + (frameIndex < 8 ? parseInt(frames[frameIndex + 2].roll1) || 0 : parseInt(nextFrame.roll2) || 0);
        } else {
          score += parseInt(nextFrame.roll1) || 0 + parseInt(nextFrame.roll2) || 0;
        }
      } else if (isSpare(frame)) {
        // Spare bonus: next roll
        score += parseInt(frames[frameIndex + 1].roll1) || 0;
      }
    }
    
    return score;
  };

  const calculateRunningTotal = (frameIndex) => {
    let total = 0;
    for (let i = 0; i <= frameIndex; i++) {
      total += calculateFrameScore(i);
    }
    return total;
  };

  const handleRollChange = (frameIndex, roll, value) => {
    // Validate input
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 0 || numValue > 10) {
      return;
    }

    // Special validation for second roll
    if (roll === 'roll2') {
      const roll1 = parseInt(frames[frameIndex].roll1) || 0;
      if (roll1 + numValue > 10) {
        return;
      }
    }

    // Special validation for third roll in 10th frame
    if (roll === 'roll3' && frameIndex === 9) {
      const roll1 = parseInt(frames[frameIndex].roll1) || 0;
      const roll2 = parseInt(frames[frameIndex].roll2) || 0;
      if (roll1 < 10 && roll1 + roll2 < 10) {
        return;
      }
    }

    const newFrames = [...frames];
    newFrames[frameIndex] = {
      ...newFrames[frameIndex],
      [roll]: value
    };
    setFrames(newFrames);

    // Auto-advance to next frame or roll
    if (roll === 'roll1' && value === '10') {
      // Strike - move to next frame
      if (frameIndex < 9) {
        setCurrentFrame(frameIndex + 1);
      }
    } else if (roll === 'roll1' && frameIndex < 9) {
      // First roll (not a strike) - stay on same frame
      setCurrentFrame(frameIndex);
    } else if (roll === 'roll2') {
      // Second roll - move to next frame
      if (frameIndex < 9) {
        setCurrentFrame(frameIndex + 1);
      }
    } else if (roll === 'roll3' && frameIndex === 9) {
      // Third roll in 10th frame - stay on 10th frame
      setCurrentFrame(9);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!user) {
        setError('Please log in to save scores');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found');
        return;
      }

      const scoreData = {
        userId: user.id,
        frames: frames.map((frame, index) => ({
          frameNumber: index + 1,
          firstRoll: parseInt(frame.roll1) || 0,
          secondRoll: parseInt(frame.roll2) || 0,
          thirdRoll: index === 9 ? parseInt(frame.roll3) || 0 : 0,
          isStrike: isStrike(frame),
          isSpare: isSpare(frame),
          frameScore: calculateFrameScore(index)
        })),
        totalScore: calculateRunningTotal(9),
        gameNumber: 1
      };

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      console.log('Submitting score:', scoreData);
      const response = await axios.post(`${config.apiUrl}/api/scores`, scoreData, config);
      console.log('Score saved successfully:', response.data);
      
      alert('Score saved successfully!');
      setFrames(Array(10).fill({ roll1: '', roll2: '', roll3: '' }));
      setCurrentFrame(0);
      setError('');
    } catch (error) {
      console.error('Error saving score:', error);
      setError(error.response?.data?.message || 'Error saving score. Please try again.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Enter Bowling Score
        </Typography>
        
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Frame</TableCell>
                <TableCell>First Roll</TableCell>
                <TableCell>Second Roll</TableCell>
                <TableCell>Third Roll</TableCell>
                <TableCell>Frame Score</TableCell>
                <TableCell>Running Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {frames.map((frame, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={frame.roll1}
                      onChange={(e) => handleRollChange(index, 'roll1', e.target.value)}
                      inputProps={{ min: 0, max: 10 }}
                      disabled={index !== currentFrame}
                      placeholder={isStrike(frame) ? 'X' : ''}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={frame.roll2}
                      onChange={(e) => handleRollChange(index, 'roll2', e.target.value)}
                      inputProps={{ min: 0, max: 10 }}
                      disabled={index !== currentFrame || isStrike(frame)}
                      placeholder={isSpare(frame) ? '/' : ''}
                    />
                  </TableCell>
                  <TableCell>
                    {index === 9 && (
                      <TextField
                        type="number"
                        value={frame.roll3}
                        onChange={(e) => handleRollChange(index, 'roll3', e.target.value)}
                        inputProps={{ min: 0, max: 10 }}
                        disabled={index !== currentFrame || (frame.roll1 !== '10' && parseInt(frame.roll1) + parseInt(frame.roll2) < 10)}
                      />
                    )}
                  </TableCell>
                  <TableCell>{calculateFrameScore(index)}</TableCell>
                  <TableCell>{calculateRunningTotal(index)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setCurrentFrame(Math.max(0, currentFrame - 1))}
            disabled={currentFrame === 0}
          >
            Previous Frame
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setCurrentFrame(Math.min(9, currentFrame + 1))}
            disabled={currentFrame === 9}
          >
            Next Frame
          </Button>
        </Box>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSubmit}
            disabled={currentFrame !== 9 || !frames[9].roll1 || !frames[9].roll2}
          >
            Save Score
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ScoreEntry;
