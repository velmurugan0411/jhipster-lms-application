import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PayrollService } from '../service/payroll.service';

import { PayrollComponent } from './payroll.component';

describe('Payroll Management Component', () => {
  let comp: PayrollComponent;
  let fixture: ComponentFixture<PayrollComponent>;
  let service: PayrollService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'payroll', component: PayrollComponent }]), HttpClientTestingModule],
      declarations: [PayrollComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(PayrollComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PayrollComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PayrollService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.payrolls?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to payrollService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getPayrollIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getPayrollIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
