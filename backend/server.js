const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const mysql = require('mysql2');

// Configuration de la connexion MySQL
const db = mysql.createConnection({
  host: 'localhost', // Remplacez par l'hôte de votre base de données
  user: 'root',      // Remplacez par votre nom d'utilisateur MySQL
  password: '',      // Remplacez par votre mot de passe MySQL
  database: 'etudiants_db' // Remplacez par le nom de votre base de données
});

// Connexion à la base de données
db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données :', err);
    return;
  }
  console.log('Connecté à la base de données MySQL');
});


// Route de connexion
// Route de connexion
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const sql = 'SELECT * FROM admin WHERE username = ? AND password = ?';
  db.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error('Erreur lors de la vérification des identifiants :', err);
      res.status(500).json({ error: 'Erreur serveur' });
      return;
    }
    if (results.length > 0) {
      res.status(200).json({ message: 'Connexion réussie', success: true });
    } else {
      res.status(401).json({ message: 'Identifiants invalides', success: false });
    }
  });
});

// Données simulées (à remplacer par une base de données réelle)
let classes = [];
let semesters = [];
let subjects = [];
let students = [];

// Routes pour les classes
// Ajouter une classe
app.post('/api/classes', (req, res) => {
  const { name } = req.body;
  const sql = 'INSERT INTO classes (name) VALUES (?)';
  db.query(sql, [name], (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'ajout de la classe :', err);
      res.status(500).json({ error: 'Erreur serveur' });
      return;
    }
    res.status(201).json({ id: result.insertId, name });
  });
});

// Ajouter un semestre
app.post('/api/semesters', (req, res) => {
  const { classId, name } = req.body;
  const sql = 'INSERT INTO semesters (class_id, name) VALUES (?, ?)';
  db.query(sql, [classId, name], (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'ajout du semestre :', err);
      res.status(500).json({ error: 'Erreur serveur' });
      return;
    }
    res.status(201).json({ id: result.insertId, classId, name });
  });
});

// Ajouter une matière
app.post('/api/subjects', (req, res) => {
  const { semesterId, name } = req.body;
  const sql = 'INSERT INTO subjects (semester_id, name) VALUES (?, ?)';
  db.query(sql, [semesterId, name], (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'ajout de la matière :', err);
      res.status(500).json({ error: 'Erreur serveur' });
      return;
    }
    res.status(201).json({ id: result.insertId, semesterId, name });
  });
});


// Charger toutes les classes
app.get('/api/classes', (req, res) => {
  const sql = 'SELECT * FROM classes';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des classes :', err);
      res.status(500).json({ error: 'Erreur serveur' });
      return;
    }
    res.status(200).json(results);
  });
});

// Charger les semestres d'une classe
app.get('/api/semesters/:classId', (req, res) => {
  const { classId } = req.params;
  const sql = 'SELECT * FROM semesters WHERE class_id = ?';
  db.query(sql, [classId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des semestres :', err);
      res.status(500).json({ error: 'Erreur serveur' });
      return;
    }
    res.status(200).json(results);
  });
});

// Charger les matières d'un semestre
app.get('/api/subjects/:semesterId', (req, res) => {
  const { semesterId } = req.params;
  const sql = 'SELECT * FROM subjects WHERE semester_id = ?';
  db.query(sql, [semesterId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des matières :', err);
      res.status(500).json({ error: 'Erreur serveur' });
      return;
    }
    res.status(200).json(results);
  });
});

// Supprimer une classe
app.delete('/api/classes/:id', (req, res) => {
  const { id } = req.params;

  // Supprimer les notes associées aux étudiants de la classe
  const deleteGradesSql = `
    DELETE g FROM grades g
    JOIN students s ON g.student_id = s.id
    WHERE s.class_id = ?`;
  db.query(deleteGradesSql, [id], (err, result) => {
    if (err) {
      console.error('Erreur lors de la suppression des notes :', err);
      res.status(500).json({ error: 'Erreur serveur lors de la suppression des notes' });
      return;
    }

    // Supprimer les étudiants associés à la classe
    const deleteStudentsSql = 'DELETE FROM students WHERE class_id = ?';
    db.query(deleteStudentsSql, [id], (err, result) => {
      if (err) {
        console.error('Erreur lors de la suppression des étudiants :', err);
        res.status(500).json({ error: 'Erreur serveur lors de la suppression des étudiants' });
        return;
      }

      // Supprimer la classe après avoir supprimé les étudiants
      const deleteClassSql = 'DELETE FROM classes WHERE id = ?';
      db.query(deleteClassSql, [id], (err, result) => {
        if (err) {
          console.error('Erreur lors de la suppression de la classe :', err);
          res.status(500).json({ error: 'Erreur serveur lors de la suppression de la classe' });
          return;
        }
        res.status(200).json({ message: 'Classe supprimée avec succès' });
      });
    });
  });
});

// Supprimer un semestre
app.delete('/api/semesters/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM semesters WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Erreur lors de la suppression du semestre :', err);
      res.status(500).json({ error: 'Erreur serveur' });
      return;
    }
    res.status(200).json({ message: 'Semestre supprimé' });
  });
});

// Supprimer une matière
app.delete('/api/subjects/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM subjects WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Erreur lors de la suppression de la matière :', err);
      res.status(500).json({ error: 'Erreur serveur' });
      return;
    }
    res.status(200).json({ message: 'Matière supprimée' });
  });
});




//API Mis à jour classe
app.put('/api/classes/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const sql = 'UPDATE classes SET name = ? WHERE id = ?';
  db.query(sql, [name, id], (err, result) => {
    if (err) {
      console.error('Erreur lors de la mise à jour de la classe :', err);
      res.status(500).json({ error: 'Erreur serveur' });
      return;
    }
    res.status(200).json({ message: 'Classe mise à jour avec succès' });
  });
});


//Mis à jour semestre
app.put('/api/semesters/:id', (req, res) => {
  const { id } = req.params;
  const { name, classId } = req.body;
  const sql = 'UPDATE semesters SET name = ?, class_id = ? WHERE id = ?';
  db.query(sql, [name, classId, id], (err, result) => {
    if (err) {
      console.error('Erreur lors de la mise à jour du semestre :', err);
      res.status(500).json({ error: 'Erreur serveur' });
      return;
    }
    res.status(200).json({ message: 'Semestre mis à jour avec succès' });
  });
});

//Mis à jour matière
app.put('/api/subjects/:id', (req, res) => {
  const { id } = req.params;
  const { name, semesterId } = req.body;
  const sql = 'UPDATE subjects SET name = ?, semester_id = ? WHERE id = ?';
  db.query(sql, [name, semesterId, id], (err, result) => {
    if (err) {
      console.error('Erreur lors de la mise à jour de la matière :', err);
      res.status(500).json({ error: 'Erreur serveur' });
      return;
    }
    res.status(200).json({ message: 'Matière mise à jour avec succès' });
  });
});

//ajouter un étudiant
app.post('/api/students/import', (req, res) => {
  const { classId, students } = req.body;

  // Préparer les données pour l'insertion
  const sql = 'INSERT INTO students (name, class_id) VALUES ?';
  const values = students.map((student) => [student.name, classId]);

  db.query(sql, [values], (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'importation des étudiants :', err);
      res.status(500).json({ error: 'Erreur serveur' });
      return;
    }
    res.status(200).json({ message: 'Étudiants importés avec succès' });
  });
});

// Charger tous les étudiants d'une classe
app.get('/api/students/:classId', (req, res) => {
  const { classId } = req.params;

  const sql = 'SELECT * FROM students WHERE class_id = ?';
  db.query(sql, [classId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des étudiants :', err);
      res.status(500).json({ error: 'Erreur serveur' });
      return;
    }
    res.status(200).json(results);
  });
});
//supprimer un étudiant
app.delete('/api/students/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM students WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Erreur lors de la suppression de l\'étudiant :', err);
      res.status(500).json({ error: 'Erreur serveur' });
      return;
    }
    res.status(200).json({ message: 'Étudiant supprimé avec succès' });
  });
});

//sauvegarder ou modifier une note
// app.post('/api/grades', (req, res) => {
//   const { studentId, subjectId, classNote, examNote } = req.body;

//   const sql = `
//     INSERT INTO grades (student_id, subject_id, grade, exam_grade)
//     VALUES (?, ?, ?, ?, ?)
//     ON DUPLICATE KEY UPDATE grade = ?, exam_grade = ?`;

//   db.query(sql, [studentId, subjectId, classNote, examNote, classNote, examNote], (err, result) => {
//     if (err) {
//       console.error('Erreur lors de l\'enregistrement de la note :', err);
//       res.status(500).json({ error: 'Erreur serveur' });
//       return;
//     }
//     res.status(200).json({ message: 'Note enregistrée avec succès' });
//   });
// });

app.post('/api/grades', (req, res) => {
  const { studentId, subjectId, semesterId, classNote, examNote } = req.body;

  const sql = `
    INSERT INTO grades (student_id, subject_id, semester_id, grade, exam_grade)
    VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE grade = ?, exam_grade = ?`;

  db.query(sql, [studentId, subjectId, semesterId, classNote, examNote, classNote, examNote], (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'enregistrement de la note :', err);
      res.status(500).json({ error: 'Erreur serveur' });
      return;
    }
    res.status(200).json({ message: 'Note enregistrée avec succès' });
  });
});

// Démarrer le serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});