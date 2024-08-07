import React from 'react';
import { AppointmentForm as Form } from '@devexpress/dx-react-scheduler-material-ui';
import {
  TextField,
  Button,
  Grid,
  Typography
} from '@mui/material';

export default function CustomAppointmentForm({ appointmentData, onFieldChange, onCommit }) {
  const handleChange = (event) => {
    onFieldChange({ [event.target.name]: event.target.value });
  };

  const handleSubmit = () => {
    onCommit();
  };

  return (
    <Form.FormLayout>
      <Typography variant="h6">Event Details</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Title"
            name="title"
            value={appointmentData.title || ''}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Start Date"
            name="startDate"
            type="datetime-local"
            value={appointmentData.startDate || ''}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="End Date"
            name="endDate"
            type="datetime-local"
            value={appointmentData.endDate || ''}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </Form.FormLayout>
  );
}
