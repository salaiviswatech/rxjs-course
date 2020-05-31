import { Component, OnInit } from '@angular/core';
import { Course } from '../model/course';
import { interval, Observable, of, timer, concat, throwError } from 'rxjs';
import { catchError, delayWhen, map, retryWhen, shareReplay, tap, share, finalize } from 'rxjs/operators';
import { createHttpObservable } from '../utils/utils';


@Component({
	selector: 'home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	constructor() { }

	courses$: Observable<Course[]>
	beginner$: Observable<Course[]>
	advanced$: Observable<Course[]>

	ngOnInit() {

		// create observable and emit values every second after 2s and stops after 5s
		// const interval$ = timer(2000, 1000);
		// const value = interval$.subscribe(val => console.log(val));
		// setTimeout(() => value.unsubscribe(), 5000)

		// create own http observable from promise

		// const http$ = createHttpObservable('api/courses')

		// // implement cancellable observable
		// const httpSubscription = http$.subscribe(console.log)
		// setTimeout( () => httpSubscription.unsubscribe(), 0)

		// this.beginner$ = http$.pipe(
		//     map(courses => (Object.values(courses.payload) as Course[]).filter(course => course.category === 'BEGINNER')))

		// this.advanced$ = http$.pipe(
		//     map(courses => (Object.values(courses.payload) as Course[]).filter(course => course.category === 'ADVANCED')))


		// // concatination example
		// const firstSource$ = of(1, 2, 3, 4)
		// const secondSource$ = of(5, 6, 7, 8)

		// const concatinated$ = concat(firstSource$, secondSource$)

		// concatinated$.subscribe(console.log)



		// // Error Handling: Strategy 1 of 3
		// const http$ = createHttpObservable('api/courses')
		// const courses$ = http$.pipe(
		//     map((res) => Object.values(res.payload)),
		//     tap(() => console.log('http request executed')),
		//     shareReplay(),
		//     catchError(err => of<Course[]>([{
		//         id: 0,
		//         description: 'Error',
		//         iconUrl: '',
		//         courseListIcon: '',
		//         longDescription: `An error occurred`,
		//         category: 'BEGINNER',
		//         lessonsCount: 10
		//     },
		//     {
		//         id: 0,
		//         description: 'Error',
		//         iconUrl: '',
		//         courseListIcon: '',
		//         longDescription: 'An error occurred',
		//         category: 'ADVANCED',
		//         lessonsCount: 10
		//     }]))
		// )

		//  this.beginner$ = courses$.pipe(
		//     map(courses => (<Course[]>courses).filter(course => course.category === 'BEGINNER')))

		// this.advanced$ = courses$.pipe(
		//     map(courses => (<Course[]>courses).filter(course => course.category === 'ADVANCED')))

		// // Error Handling: Strategy 2 of 3
		// const http$ = createHttpObservable('api/courses')
		// const courses$ = http$.pipe(
		// 	catchError(err => {
		// 		console.log(`Failed to load courses - ${err}`)
		// 		return throwError(err)
		// 	}),
		// 	finalize(() => { console.log('courses observable completed') }),
		// 	map((res) => Object.values(res.payload)),
		// 	tap(() => console.log('http request executed')),
		// 	shareReplay()
		// )

		// this.beginner$ = courses$.pipe(
		// 	map(courses => (<Course[]>courses).filter(course => course.category === 'BEGINNER')))

		// this.advanced$ = courses$.pipe(
		// 	map(courses => (<Course[]>courses).filter(course => course.category === 'ADVANCED')))

		// Error Handling: Strategy 3 of 3
		const http$ = createHttpObservable('api/courses')
		const courses$ = http$.pipe(
			catchError(err => console.log),
			finalize(() => { console.log('courses observable completed') }),
			map((res) => Object.values(res.payload)),
			tap(() => console.log('http request executed')),
			shareReplay(),
			retryWhen(err => err.pipe(
				delayWhen(() => timer(2000))
			)
			)
		)

		this.beginner$ = courses$.pipe(
			map(courses => (<Course[]>courses).filter(course => course.category === 'BEGINNER')))

		this.advanced$ = courses$.pipe(
			map(courses => (<Course[]>courses).filter(course => course.category === 'ADVANCED')))
	}
}
