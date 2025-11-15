const express = require('express');
const router = express.Router();
const Email = require('../models/Email');
const { sendEmail } = require('../utils/emailService');

// GET all emails
router.get('/', async (req, res) => {
  try {
    const emails = await Email.find().sort({ receivedAt: -1 });
    res.json(emails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single email
router.get('/:id', async (req, res) => {
  try {
    const email = await Email.findById(req.params.id);
    if (!email) {
      return res.status(404).json({ message: 'Email not found' });
    }
    res.json(email);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE email
router.post('/', async (req, res) => {
  const email = new Email({
    subject: req.body.subject,
    from: req.body.from,
    to: req.body.to,
    body: req.body.body,
    account: req.body.account,
    status: req.body.status,
    priority: req.body.priority,
    receivedAt: req.body.receivedAt,
  });

  try {
    const newEmail = await email.save();
    res.status(201).json(newEmail);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE email
router.put('/:id', async (req, res) => {
  try {
    const email = await Email.findById(req.params.id);
    if (!email) {
      return res.status(404).json({ message: 'Email not found' });
    }

    Object.assign(email, req.body);
    const updatedEmail = await email.save();
    res.json(updatedEmail);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE email
router.delete('/:id', async (req, res) => {
  try {
    const email = await Email.findById(req.params.id);
    if (!email) {
      return res.status(404).json({ message: 'Email not found' });
    }

    await email.deleteOne();
    res.json({ message: 'Email deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// SEND email
router.post('/send/:id', async (req, res) => {
  try {
    const email = await Email.findById(req.params.id);
    if (!email) {
      return res.status(404).json({ message: 'Email not found' });
    }

    if (email.isSent) {
      return res.status(400).json({ message: 'Email has already been sent' });
    }

    // Send the email
    const result = await sendEmail({
      to: email.to,
      subject: email.subject,
      body: email.body,
      from: email.from,
    });

    if (result.success) {
      // Update email status
      email.isSent = true;
      email.sentAt = new Date();
      email.status = 'responded';
      await email.save();

      res.json({
        message: 'Email sent successfully',
        email: email,
        emailResult: result,
      });
    } else {
      res.status(500).json({
        message: 'Failed to send email',
        error: result.error,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
