// central hub to pull all table route files w/in the apiRoutes folder together
const express = require('express');
const router = express.Router();

router.use(require('./candidateRoutes'));

router.use(require('./partyRoutes'));

router.use(require('./voterRoutes'));

module.exports = router;