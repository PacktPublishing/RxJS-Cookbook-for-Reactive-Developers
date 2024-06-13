import { Observable, filter, of, catchError, switchMap, map, tap } from "rxjs";
import { Action } from "./recipes.actions";

export function ofType(type: string) {
    return (source: Observable<Action>) => source.pipe(
        filter(action => action.type === type)
    );
}

export function logMetaReducer(target: Function, context: any) {
    return function (...args: any[]) {
        const [,{ type, payload }] = args;
        console.log(`%cCalling Action: ${type}\n`, 'color: #d30b8e', payload ?? '');
        const result = target.apply(context, args);
        console.log(`%cAction ${type} state:\n`, 'color: #ffc26e', result);
        return result;
    };
}
