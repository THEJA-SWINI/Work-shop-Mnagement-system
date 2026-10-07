const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());


// ========================================
// HOME / TEST API
// ========================================

app.get("/", (req, res) => {
    res.json({
        message: "Workshop Management API is running"
    });
});


// ========================================
// GET ALL WORKSHOPS
// GET /workshops
//
// Optional:
// ?category=Backend
// ?level=Beginner
// ?sort=duration
// ========================================

app.get("/workshops", (req, res) => {

    const { category, level, sort } = req.query;

    let sql = `
        SELECT
            w.workshop_id,
            w.workshop_name,
            w.description,
            c.category_name,
            w.level,
            w.duration,
            w.trainer_name
        FROM workshops w
        INNER JOIN categories c
            ON w.category_id = c.category_id
    `;

    const conditions = [];
    const values = [];

    // Filter by category
    if (category) {
        conditions.push("c.category_name = ?");
        values.push(category);
    }

    // Filter by level
    if (level) {
        conditions.push("w.level = ?");
        values.push(level);
    }

    // Add WHERE conditions
    if (conditions.length > 0) {
        sql += " WHERE " + conditions.join(" AND ");
    }

    // Sort by duration
    if (sort === "duration") {
        sql += " ORDER BY w.duration ASC";
    } else {
        sql += " ORDER BY w.workshop_id ASC";
    }

    db.query(sql, values, (err, results) => {

        if (err) {
            console.error("Database query error:", err.message);

            return res.status(500).json({
                error: "Database query failed"
            });
        }

        res.json(results);
    });
});


// ========================================
// SEARCH WORKSHOPS
// GET /workshops/search?keyword=java
// ========================================

app.get("/workshops/search", (req, res) => {

    const keyword = req.query.keyword;

    if (!keyword) {
        return res.status(400).json({
            error: "Keyword is required"
        });
    }

    const sql = `
        SELECT
            w.workshop_id,
            w.workshop_name,
            w.description,
            c.category_name,
            w.level,
            w.duration,
            w.trainer_name
        FROM workshops w
        INNER JOIN categories c
            ON w.category_id = c.category_id
        WHERE w.workshop_name LIKE ?
        ORDER BY w.workshop_id ASC
    `;

    const searchValue = `%${keyword}%`;

    db.query(sql, [searchValue], (err, results) => {

        if (err) {
            console.error("Search error:", err.message);

            return res.status(500).json({
                error: "Database search failed"
            });
        }

        res.json(results);
    });
});


// ========================================
// WORKSHOP COUNT BY CATEGORY
// GROUP BY + COUNT()
// GET /workshops/stats/category
// ========================================

app.get("/workshops/stats/category", (req, res) => {

    const sql = `
        SELECT
            c.category_name,
            COUNT(w.workshop_id) AS workshop_count
        FROM categories c
        LEFT JOIN workshops w
            ON c.category_id = w.category_id
        GROUP BY c.category_id, c.category_name
        ORDER BY c.category_id
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error("Category statistics error:", err.message);

            return res.status(500).json({
                error: "Failed to get category statistics"
            });
        }

        res.json(results);
    });
});


// ========================================
// AVERAGE DURATION BY CATEGORY
// GROUP BY + AVG()
// GET /workshops/stats/average-duration
// ========================================

app.get("/workshops/stats/average-duration", (req, res) => {

    const sql = `
        SELECT
            c.category_name,
            ROUND(AVG(w.duration), 2) AS average_duration
        FROM categories c
        INNER JOIN workshops w
            ON c.category_id = w.category_id
        GROUP BY c.category_id, c.category_name
        ORDER BY c.category_id
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error("Average duration error:", err.message);

            return res.status(500).json({
                error: "Failed to calculate average duration"
            });
        }

        res.json(results);
    });
});


// ========================================
// START SERVER
// ========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});