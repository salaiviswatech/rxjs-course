import { Observable } from 'rxjs'

export function createHttpObservable(url: string): Observable<any> {
  return Observable.create(observer => {

    const controller = new AbortController()
    const signal = controller.signal
    fetch(url, { signal })
      .then(res => {
        if (res.ok) {
          return res.json()
        } else {
          observer.error('An error occurred with http status code:' + res.status)
        }
      }) // converts response to response json type
      .then(body => {
        observer.next(body)
        observer.complete()
      })
      .catch(err => {
        observer.next(err)
      })
    return () => controller.abort()
  })
}
