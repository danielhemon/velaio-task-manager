import { TestBed } from '@angular/core/testing';

import { TaskWizardService } from './task-wizard.service';

describe('TaskWizardService', () => {
  let service: TaskWizardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskWizardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
