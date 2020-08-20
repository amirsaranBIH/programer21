import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LectureService } from 'src/app/services/lecture.service';
import { TitleToSlugPipe } from 'src/app/pipes/title-to-slug.pipe';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-edit-lecture',
  templateUrl: './edit-lecture.component.html',
  styleUrls: ['./edit-lecture.component.css']
})
export class EditLectureComponent implements OnInit {
  public editLectureForm: FormGroup;
  public lecture;
  public quizQuestions = [];
  public deletedQuizQuestions = [];
  public deletedQuizAnswers = [];

  constructor(
      private fb: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private lectureService: LectureService,
      private titleToSlug: TitleToSlugPipe,
      private toastr: ToastrService,
      private loading: LoadingService
    ) { }

    ngOnInit() {
      this.lecture = this.route.snapshot.data.lecture;
      this.quizQuestions = this.route.snapshot.data.quizQuestions;

      this.editLectureForm = this.fb.group({
        title: [this.lecture.title, [Validators.required]],
        description: [this.lecture.description, [Validators.required]],
        status: [this.lecture.status, [Validators.required]],
        difficulty: [this.lecture.difficulty, [Validators.required]],
        ert: [this.lecture.ert, [Validators.required]],
        skippable: [this.lecture.skippable]
      });
    }

    get title() {
      return this.editLectureForm.get('title');
    }

    get description() {
      return this.editLectureForm.get('description');
    }

    get difficulty() {
      return this.editLectureForm.get('difficulty');
    }

    get ert() {
      return this.editLectureForm.get('ert');
    }

    get status() {
      return this.editLectureForm.get('status');
    }

  onSubmit() {
    if (this.editLectureForm.invalid || this.loading.isLoading) {
      return false;
    }

    const data = this.editLectureForm.value;

    this.loading.setLoadingStatus = true;

    data.slug = this.titleToSlug.transform(this.editLectureForm.value.title);
    data.quizQuestions = this.quizQuestions;
    data.deletedQuizQuestions = this.deletedQuizQuestions;
    data.deletedQuizAnswers = this.deletedQuizAnswers;

    this.lectureService.editLecture(this.route.snapshot.params.lecture_id, data).subscribe({
      error: (err) => console.log(err),
      complete: () => {
        this.toastr.success('Successfully updated lecture', 'Success');
        this.loading.setLoadingStatus = false;
      }
    });
  }

  deleteLecture() {
    if (confirm('Are you sure?')) {
      this.lectureService.deleteLecture(this.route.snapshot.params.lecture_id).subscribe({
        error: (err) => console.log(err),
        complete: () => {
          this.toastr.success('Successfully deleted lecture', 'Success');
          this.router.navigate(['admin-panel', 'edit-course', this.lecture.course]);
        }
      });
    }
  }

  addQuizQuestion(quizQuestionTextInput) {
    if (quizQuestionTextInput.value.trim().length > 0) {
      this.quizQuestions.push({
        question: quizQuestionTextInput.value.trim(),
        answers: []
      });

      quizQuestionTextInput.value = '';
    }
  }

  addQuizAnswer(questionIndex, quizAnswerTextInput) {
    if (quizAnswerTextInput.value.trim().length > 0) {
      this.quizQuestions[questionIndex].answers.push({
        answer: quizAnswerTextInput.value.trim()
      });

      quizAnswerTextInput.value = '';
    }
  }

  removeQuestion(questionIndex) {
    const removedQuizQuestion = this.quizQuestions.splice(questionIndex, 1)[0];
    this.deletedQuizQuestions.push(removedQuizQuestion.id);
  }

  removeAnswer(questionIndex, answerIndex) {
    if (this.quizQuestions[questionIndex].answers[answerIndex].answer !== this.quizQuestions[questionIndex].answer) {
      const removedAnswer = this.quizQuestions[questionIndex].answers.splice(answerIndex, 1)[0];
      this.deletedQuizAnswers.push(removedAnswer.id);
    } else {
      this.toastr.error('You can\'t delete answer to the question.');
    }
  }
}
