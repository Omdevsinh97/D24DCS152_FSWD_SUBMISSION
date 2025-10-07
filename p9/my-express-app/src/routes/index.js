const express = require('express');
const homeController = require('../controllers/homeController');

const router = express.Router();

function setRoutes(app) {
    app.use('/', router);
    router.get('/', homeController.getHome);
}

module.exports = setRoutes;