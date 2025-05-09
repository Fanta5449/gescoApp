import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  classes: any[] = [];
  semesters: any[] = [];
  subjects: any[] = [];
  newClassName: string = '';
  newSemesterName: string = '';
  newSubjectName: string = '';
  selectedClassId: number | null = null;
  selectedClassIdForSubject: number | null = null;
  selectedSemesterId: number | null = null;
  selectedSubjectId: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadClasses();
  }

  loadClasses() {
    this.http.get<any[]>('http://localhost:3000/api/classes').subscribe(data => {
      this.classes = data;
    });
  }

  // addClass() {
  //   const newClass = { name: this.newClassName };
  //   this.http.post('http://localhost:3000/api/classes', newClass).subscribe(() => {
  //     this.loadClasses();
  //     this.newClassName = '';
  //   });
  // }
  addClass() {
    if (this.selectedClassId) {
      // Mise à jour de la classe existante
      const updatedClass = { id: this.selectedClassId, name: this.newClassName };
      this.http.put(`http://localhost:3000/api/classes/${this.selectedClassId}`, updatedClass).subscribe(() => {
        this.loadClasses();
        this.newClassName = '';
        this.selectedClassId = null; // Réinitialise l'ID sélectionné
      });
    } else {
      // Ajout d'une nouvelle classe
      const newClass = { name: this.newClassName };
      this.http.post('http://localhost:3000/api/classes', newClass).subscribe(() => {
        this.loadClasses();
        this.newClassName = '';
      });
    }
  }

  deleteClass(id: number) {
    this.http.delete(`http://localhost:3000/api/classes/${id}`).subscribe(() => {
      this.loadClasses();
    });
  }

  loadSemesters(classId: number) {
    if (!classId) {
      this.semesters = []; // Réinitialiser si aucune classe n'est sélectionnée
      return;
    }
  
    this.http.get<any[]>(`http://localhost:3000/api/semesters/${classId}`).subscribe(
      data => {
        this.semesters = data; // Met à jour la liste des semestres
      },
      error => {
        console.error('Erreur lors de la récupération des semestres :', error);
      }
    );
  }

  // addSemester() {
  //   const newSemester = { classId: this.selectedClassId, name: this.newSemesterName };
  //   this.http.post('http://localhost:3000/api/semesters', newSemester).subscribe(() => {
  //     this.loadSemesters(this.selectedClassId!);
  //     this.newSemesterName = '';
  //   });
  // }

  addSemester() {
    if (this.selectedSemesterId) {
      // Mise à jour du semestre existant
      const updatedSemester = { id: this.selectedSemesterId, name: this.newSemesterName, classId: this.selectedClassId };
      this.http.put(`http://localhost:3000/api/semesters/${this.selectedSemesterId}`, updatedSemester).subscribe(() => {
        this.loadSemesters(this.selectedClassId!);
        this.newSemesterName = '';
        this.selectedSemesterId = null; // Réinitialise l'ID sélectionné
      });
    } else {
      // Ajout d'un nouveau semestre
      const newSemester = { classId: this.selectedClassId, name: this.newSemesterName };
      this.http.post('http://localhost:3000/api/semesters', newSemester).subscribe(() => {
        this.loadSemesters(this.selectedClassId!);
        this.newSemesterName = '';
      });
    }
  }

  deleteSemester(id: number) {
    this.http.delete(`http://localhost:3000/api/semesters/${id}`).subscribe(() => {
      this.loadSemesters(this.selectedClassId!);
    });
  }

  loadSubjects(semesterId: number) {
    this.http.get<any[]>(`http://localhost:3000/api/subjects/${semesterId}`).subscribe(data => {
      this.subjects = data;
    });
  }

  // addSubject() {
  //   const newSubject = { semesterId: this.selectedSemesterId, name: this.newSubjectName };
  //   this.http.post('http://localhost:3000/api/subjects', newSubject).subscribe(() => {
  //     this.loadSubjects(this.selectedSemesterId!);
  //     this.newSubjectName = '';
  //   });
  // }
  addSubject() {
    if (this.selectedSubjectId) {
      // Mise à jour de la matière existante
      const updatedSubject = { id: this.selectedSubjectId, name: this.newSubjectName, semesterId: this.selectedSemesterId };
      this.http.put(`http://localhost:3000/api/subjects/${this.selectedSubjectId}`, updatedSubject).subscribe(() => {
        this.loadSubjects(this.selectedSemesterId!);
        this.newSubjectName = '';
        this.selectedSubjectId = null; // Réinitialise l'ID sélectionné
      });
    } else {
      // Ajout d'une nouvelle matière
      const newSubject = { semesterId: this.selectedSemesterId, name: this.newSubjectName };
      this.http.post('http://localhost:3000/api/subjects', newSubject).subscribe(() => {
        this.loadSubjects(this.selectedSemesterId!);
        this.newSubjectName = '';
      });
    }
  }

  deleteSubject(id: number) {
    this.http.delete(`http://localhost:3000/api/subjects/${id}`).subscribe(() => {
      this.loadSubjects(this.selectedSemesterId!);
    });
  }


  //edits
  editClass(classItem: any) {
    this.newClassName = classItem.name; // Pré-remplit le champ avec le nom de la classe
    this.selectedClassId = classItem.id; // Stocke l'ID de la classe à modifier
  }
  editSemester(semesterItem: any) {
    this.newSemesterName = semesterItem.name; // Pré-remplit le champ avec le nom du semestre
    this.selectedSemesterId = semesterItem.id; // Stocke l'ID du semestre à modifier
  }
  editSubject(subjectItem: any) {
    this.newSubjectName = subjectItem.name; // Pré-remplit le champ avec le nom de la matière
    this.selectedSubjectId = subjectItem.id; // Stocke l'ID de la matière à modifier
  }


students: any[] = [];
selectedClassIdForStudents: number | null = null;
file: File | null = null;
onFileChange(event: any) {
  const target: DataTransfer = <DataTransfer>(event.target);
  if (target.files.length !== 1) {
    alert('Veuillez sélectionner un seul fichier.');
    return;
  }

  this.file = target.files[0];

  const reader: FileReader = new FileReader();
  reader.onload = (e: any) => {
    const binaryData: string = e.target.result;
    const workbook: XLSX.WorkBook = XLSX.read(binaryData, { type: 'binary' });

    // Supposons que les données sont dans la première feuille
    const sheetName: string = workbook.SheetNames[0];
    const sheet: XLSX.WorkSheet = workbook.Sheets[sheetName];

    // Convertir les données en JSON et ne garder que le champ "noms"
    const rawData = XLSX.utils.sheet_to_json(sheet);
    this.students = rawData.map((row: any) => ({
      name: row.noms, // Assurez-vous que le champ dans Excel est bien "noms"
    }));

    console.log('Étudiants importés :', this.students);
  };

  reader.readAsBinaryString(this.file);
}

loadStudents(classId: number) {
  this.http.get<any[]>(`http://localhost:3000/api/students/${classId}`).subscribe(
    (data) => {
      this.students = data;
    },
    (error) => {
      console.error('Erreur lors de la récupération des étudiants :', error);
    }
  );
}


importStudents() {
  if (!this.selectedClassIdForStudents) {
    alert('Veuillez sélectionner une classe.');
    return;
  }

  if (this.students.length === 0) {
    alert('Aucun étudiant à importer.');
    return;
  }

  const payload = {
    classId: this.selectedClassIdForStudents,
    students: this.students,
  };

  this.http.post('http://localhost:3000/api/students/import', payload).subscribe(
    () => {
      alert('Étudiants importés avec succès.');
      this.students = [];
      this.loadStudents(this.selectedClassIdForStudents);
    },
    (error) => {
      console.error('Erreur lors de l\'importation des étudiants :', error);
    }
  );
}
deleteStudent(studentId: number) {
  this.http.delete(`http://localhost:3000/api/students/${studentId}`).subscribe(
    () => {
      this.loadStudents(this.selectedClassIdForStudents!);
    },
    (error) => {
      console.error('Erreur lors de la suppression de l\'étudiant :', error);
    }
  );
}
}
