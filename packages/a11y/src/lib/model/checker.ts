import { Observable } from "rxjs";
import { UuvA11yResultUsecase, UuvA11yResultUsecaseLocation } from "./uuv-a11y-result";

export interface A11yChecker {
    validate(name: string, script: string, location: UuvA11yResultUsecaseLocation): Observable<UuvA11yResultUsecase>;
}
