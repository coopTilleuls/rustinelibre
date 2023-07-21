import {AbstractResource} from '@resources/AbstractResource';
import {AutoDiagnostic} from '@interfaces/AutoDiagnostic';

class AutoDiagnosticResource extends AbstractResource<AutoDiagnostic> {
  protected endpoint = '/auto_diagnostics';
}

export const autoDiagnosticResource = new AutoDiagnosticResource();
