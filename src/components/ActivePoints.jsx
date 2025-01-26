import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box
} from '@mui/material';

const ActivePoints = ({ open, onClose, onUpdate }) => {
  const [activePoints, setActivePoints] = useState(11);

  const handleSubmit = () => {
    onUpdate(parseInt(activePoints));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Set Active Points</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            label="Number of Active Points"
            type="number"
            value={activePoints}
            onChange={(e) => setActivePoints(e.target.value)}
            fullWidth
            InputProps={{
              inputProps: { min: 1 }
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ActivePoints;
