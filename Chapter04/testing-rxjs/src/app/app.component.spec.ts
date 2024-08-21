import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

describe('AppComponent', () => {
  let testScheduler: TestScheduler;
  
  beforeEach(async () => {
    // await TestBed.configureTestingModule({
    //   imports: [AppComponent],
    // }).compileComponents();
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'testing-rxjs' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('testing-rxjs');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, testing-rxjs');
  });

  fit('should emit 1, 2, 3 and then complete', () => {
    testScheduler.run(({ cold, expectObservable }) => {
      const source$ = cold('a-b-c-|', { a: 1, b: 2, c: 3 });
      const expectedMarble = 'a-b-c-|';
      expectObservable(source$).toBe(expectedMarble, { a: 1, b: 2, c: 3 });
    });
  });
});
