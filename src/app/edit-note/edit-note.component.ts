import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit-note',
  templateUrl: './edit-note.component.html',
  styleUrls: ['./edit-note.component.scss']
})
export class EditNoteComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadClasses();
  }


classes: any[] = [];
semesters: any[] = [];
subjects: any[] = [];
students: any[] = [];
selectedClassId: number | null = null;
selectedSemesterId: number | null = null;
selectedSubjectId: number | null = null;


loadClasses() {
  this.http.get<any[]>('http://localhost:3000/api/classes').subscribe(data => {
    this.classes = data;
  });
}

loadSemesters(classId: number) {
  this.http.get<any[]>(`http://localhost:3000/api/semesters/${classId}`).subscribe(
    (data) => {
      this.semesters = data;
    },
    (error) => {
      console.error('Erreur lors de la récupération des semestres :', error);
    }
  );
}

loadSubjects(semesterId: number) {
  this.http.get<any[]>(`http://localhost:3000/api/subjects/${semesterId}`).subscribe(
    (data) => {
      this.subjects = data;
    },
    (error) => {
      console.error('Erreur lors de la récupération des matières :', error);
    }
  );
}

loadStudents(classId: number) {
  this.http.get<any[]>(`http://localhost:3000/api/students/${classId}`).subscribe(
    (data) => {
      this.students = data.map((student) => ({
        ...student,
        classNote: null,
        examNote: null,
      }));
    },
    (error) => {
      console.error('Erreur lors de la récupération des étudiants :', error);
    }
  );
}
saveNote(student: any) {
  const payload = {
    studentId: student.id,
    subjectId: this.selectedSubjectId,
    semesterId: this.selectedSemesterId, // Ajout de semesterId
    classNote: student.classNote,
    examNote: student.examNote,
  };

  this.http.post('http://localhost:3000/api/grades', payload).subscribe(
    () => {
      alert('Note enregistrée avec succès.');
    },
    (error) => {
      console.error('Erreur lors de l\'enregistrement de la note :', error);
    }
  );
}

}
